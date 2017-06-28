// Code for inference that uses pseudo-marginal Metropolis Hastings (PMMH).
// The parameter is theta = [X0 p sigma] (copy number, efficiency, noise).
// The parameter priors are uniform for X0, Beta(0.5, 0.5) for p, Jeffreys prior
// for sigma.
//
// The log posterior is computed using a bootstrap particle filter with M
// particles (D. Wilkinson).
//
// The main algorithm has three stages:
// - A normal PMMH run to get a better estimate of theta MAP.
// - An adaptive run to get a better estimate of the proposal covariance.
// - A normal PMMH run.
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <gsl/gsl_linalg.h>
#include <gsl/gsl_matrix.h>
#include <gsl/gsl_rng.h>
#include <gsl/gsl_randist.h>
#include <inttypes.h>

#define ADAPTIVE_THRESHOLD 100
#define NEG_INF -DBL_MAX
#define ADAPTIVE_SCALE 1.92
#define ADAPTIVE_EPS 0.00001
#define MAX_ACCEPTED 100000
#define BURNIN 5000
//#define THIN 10
#define ALPHA 3.03125968064e-09 // The mean obtained with sigmoid fitting.
#define M 200 // Number of particles for bootstrap filter.
#define MIN_X0 1 // Minimum number of initial molecules.
#define MAX_X0 100 // Maximum number of initial molecules.
#define BETA_NORM 3.141592653589793238463 // Beta(0.5, 0.5).
//#define BETA_NORM 0.00202020202020202020202 // Beta(9, 3) for p in (0.7, 0.9).

#define TRUE_X0 61 // Good to use the standard curve method estimate here.
#define TRUE_P 0.75
#define TRUE_SIGMA 2.0

// To be used in log-sum-exp calculations.
#define LOG_EPS -36 // ln(2^-53) // Wanted precision for log-sum-exp trick.
#define LOG_M 5.29831736655 // ln(200)

// Random number generator from GSL library used to sample from binomial.
gsl_rng *gsl_rand;

double rand_N() {
	// The method produces two independent random samples from N(0, 1). Using
	// static variables to return the second one on every second call.
	static unsigned int call = 0;
	static double z0, z1;
	if (call == 1) {
		call = 0;
		return z1;
	}
	double r1 = drand48();
	double r2 = drand48();
	z0 = sqrt(-2*log(r1))*cos(2*M_PI*r2);
	z1 = sqrt(-2*log(r1))*sin(2*M_PI*r2);
	call = 1;
	return z0;
}

int64_t binomial_sample(double p, int64_t x) {
	// Normal approximation.
	if ((double)x*p > 5.0 && (double)x*(1-p) > 5.0) {
		// Approximate with normal and return.
		// Sample from N(0, 1).
		double N_sample = rand_N();
		// Shift and scale to get N(xp, xp(1-p)).
		double result = N_sample*sqrt(x*p*(1-p)) + x*p;
		return (int64_t)(result > 0 ? result : 0);
	}
	// Otherwise use GSL to sample.
	return gsl_ran_binomial(gsl_rand, p, x);
}

// Sample uniformly from range (x, y).
double uniform_in_range(double x, double y) {
	return x + drand48()*(y - x);
}

// Samples from a discrete distribution according to the normalized array p.
// Assumes normalized p is array of size M (number of particles in PMMH).
void sample_discrete(const double* p, int* samples) {
	double cdf[M];
	int i, step;
	cdf[0] = p[0];
	for (i = 1; i < M; i++) cdf[i] = cdf[i-1] + p[i];
	// First compute cumulative distribution.
	for (int s = 0; s < M; s++) {
		double r = uniform_in_range(0, 1);

		// Perform binary search to get sample from discrete distribution.
		// Finds last i such that cdf[i] <= r.
		// We are interested in first i such that cdf[i] > r.
		// Therefore, take i+1 (unless i is 0 and cdf[i] > r).
		step = 1;
		while (step < M) step <<= 1;
		for (i = 0; step > 0; step >>= 1) {
			if (i+step < M && cdf[i+step] <= r) i += step;
		}
		samples[s] = (cdf[i] > r) ? i : (i+1);
	}
}

// Compute the log posterior using bootstrap particle filter.
double log_posterior(const double *F, int n, double alpha, const double *theta) {
	int64_t x0 = (int64_t)theta[0]; // Round the double value to int64.
	double p = theta[1];
	double sigma = theta[2];
	int64_t x[M]; // Latent variable value at current time (initially t = 0).
	double w[M]; // Particle weights at current time.
	double ll = 0;

	// Add Beta prior for p.
	ll -= log(BETA_NORM) + 0.5*log(p) + 0.5*log(1-p);
	//ll -= log(BETA_NORM) + 8*log(p) + 2*log(1-p);

	// Add on Jeffreys prior for sigma.
	ll -= log(sigma);

	if (x0 < MIN_X0 || x0 > MAX_X0) {
		// Automatically reject if x0 out of bounds.
		return NEG_INF;
	}

	// Uncomment if using log uniform prior on X0.
	/*double c = 0;
	for (int i = MIN_X0; i <= MAX_X0; i++) c += (1/i);
	ll -= log(x0);*/

	// Initialize particles at t = 0.
	for (int k = 0; k < M; k++) {
		x[k] = x0;
		w[k] = 1.0/M;
	}
	for (int i = 1; i <= n; i++) {
		// Resample according to w.
		int sample_indices[M];
		int64_t x_samples[M];
		
		// The array sample_indices will contain the indices in x_samples that
		// have been resampled by the discrete sampling procedure (not the
		// values).
		sample_discrete(w, sample_indices);

		// Use the indices from sample_indices to compute the new values.
		for (int k = 0; k < M; k++) x_samples[k] = x[sample_indices[k]];

		// First compute the maximum from all the negative numbers to apply
		// exp-normalize: norm(i) = exp(pi - max_p) / sum_j(exp(pj - max_p)).
		// This is a trick to avoid unrepresentable point numbers.
		double max_p, prob;
		for (int k = 0; k < M; k++) {
			// Propagate each particle forward using the resampled value.
			x[k] = x_samples[k] + binomial_sample(p, x_samples[k]);
			prob = -(F[i] - alpha*x[k])*(F[i] - alpha*x[k])/(2*sigma);
			if (k == 0) max_p = prob;
			if (max_p < prob) max_p = prob;
		}
		double sum_exp_weights = 0.0;
		for (int k = 0; k < M; k++) {
			// Compute the probability based on the existing x values.
			// TODO: store p values instead of x to avoid recomputation.
			prob = -(F[i] - alpha*x[k])*(F[i] - alpha*x[k])/(2*sigma);
			// Assign w[k] to be log(p(y_t | x_t)). Subtract max_p to avoid
			// underflow.
			w[k] = prob - max_p;
			// If the weight will be unrepresentable (w[k] < LOG_EPS - LOG_M),
			// do not add it (to get relative precision LOG_EPS):
			// https://stats.stackexchange.com/questions/66616/converting-normalizing-very-small-likelihood-values-to-probability
			sum_exp_weights += (w[k] >= (LOG_EPS - LOG_M)) ?
				exp(w[k]) : 0;
		}

		// Normalize the weights so they add up to 1. Move from log space
		// to linear.
		for (int k = 0; k < M; k++) {
			// If the weight will be unrepresentable (w[k] < LOG_EPS - LOG_M),
			// do not add it (to get relative precision LOG_EPS):
			// https://stats.stackexchange.com/questions/66616/converting-normalizing-very-small-likelihood-values-to-probability
			w[k] = (w[k] >= (LOG_EPS - LOG_M)) ? 
				(exp(w[k] - log(sum_exp_weights))) : 
				0;
		}
		// Normally log(2*M_PI*sigma)/2 is part of all w[k], but we
		// subtract it only when computing the likelihood to avoid
		// dealing with very small numbers (since it is constant for
		// fixed sigma, so doesn't matter when weights are normalized).
		// Add log(exp(max_p)) since it was factored out to avoid
		// underflow.
		ll += log(sum_exp_weights) + max_p - log(M) - log(2*M_PI*sigma)/2;
	}
	return ll;
}

// Uses GNU GSL to get the Cholesky factor of positive definite matrix A.
void cholesky(const double *A, double *chol, int n) {
	int i, j;
	gsl_matrix *m = gsl_matrix_alloc(n, n);

	for (i = 0; i < n; i++)
		for (j = 0; j < n; j++)
			gsl_matrix_set (m, i, j, A[i*n+j]);
	int err_code = gsl_linalg_cholesky_decomp(m);
	if (err_code != 0) {
		printf("Error in the Cholesky decomposition!\n");
	}
	for (i = 0; i < n; i++) {
		for (j = 0; j < n; j++) {
			chol[i*n+j] = (i < j) ? 0 : gsl_matrix_get (m, i, j);
		}
	}
}
// Sample from multivariate normal using an undecomposed covariance. It first
// decomposes cov, then uses the Cholesky factor to sample.
void multivariate_with_cov(int params, const double *cov, double *noise) {
	// Sample each parameter as IID from N(0, 1).
	double z[params];
	double chol[params*params];
	cholesky(cov, chol, params);
	
	for (int i = 0; i < params; i++) {
		z[i] = rand_N();
	}

	// Multiply by the Cholesky term to obtain the multivariate samples.
	for (int i = 0; i < params; i++) {
		noise[i] = 0;
		for (int j = 0; j < params; j++) {
			noise[i] += chol[params*i + j] * z[j];
		}
	}
}

// Sample from multivariate normal using the Cholesky factor of the covariance
// matrix.
void multivariate_with_cholesky(int params, const double *chol, double *noise) {
	// Sample each parameter as IID from N(0, 1).
	double z[params];
	for (int i = 0; i < params; i++) {
		z[i] = rand_N();
	}

	// Multiply by the Cholesky term to obtain the multivariate samples.
	for (int i = 0; i < params; i++) {
		noise[i] = 0;
		for (int j = 0; j < params; j++) {
			noise[i] += chol[params*i + j] * z[j];
		}
	}
}

void simulate_for_MAP(double *F, int n, int params, double *cov,
	double *theta_map, int iters, double alpha) {
	double theta[params];
	theta[0] = TRUE_X0; theta[1] = TRUE_P; theta[2] = TRUE_SIGMA;

	double lp_sample = log_posterior(F, n, alpha, theta);

	double lp_proposal;
	double new_theta[params], noise[params];

	// Initialize MAP estimate variables. 
	double lp_map = lp_sample;
	memcpy(theta_map, theta, sizeof(theta));
	
	for (int i = 0; i < iters; i++) {
		// Propose using Q(new_theta/theta).
		multivariate_with_cholesky(params, cov, noise);

		// Multivariate for new_theta[j] samples is centered at theta[j] for
		// each j.
		for (int j = 0; j < params; j++) new_theta[j] = noise[j] + theta[j];

		// Check if either parameter is out of bounds.
		int out_of_bounds = 0;
		if (new_theta[0] < 0.0) out_of_bounds = 1;
		if (new_theta[1] < 0.0 || new_theta[1] > 1.0) out_of_bounds = 1;
		if (new_theta[2] < 0.0) out_of_bounds = 1;

		lp_proposal = log_posterior(F, n, alpha, new_theta);
		
		// Accept with probability r and if r > 1, then accept.
		double r = uniform_in_range(0,1);
		if (lp_proposal - lp_sample > log(r) && !out_of_bounds) {
			// Accept.
			lp_sample = lp_proposal;
			memcpy(theta, new_theta, sizeof(new_theta));
		}
		// Update empirical MAP estimate.
		if (lp_proposal > lp_map && !out_of_bounds) {
			lp_map = lp_proposal;
			memcpy(theta_map, new_theta, sizeof(new_theta));
		}
	}

	printf("Theta MAP:\n");
	for (int i = 0; i < params; i++) printf("%lf ", theta_map[i]);
	printf("\n");
}

void simulate_adaptive_mh(double *f, int n, int params, double* cov0,
	double* sample_cov, double *theta_map, int iters, double alpha) {
	double theta[params], sample_mean[params], prev_mean[params];
	// Initialize parameters with MAP estimate from previous run.
	for (int i = 0; i < params; i++) {
		theta[i] = theta_map[i];
		sample_mean[i] = theta_map[i];
	}
	double lp_sample = log_posterior(f, n, alpha, theta);
	double lp_map = lp_sample;

	double* covariance;
	double new_theta[params], noise[params], lp_proposal;
	int accepted = 0;

	for (int run = 0; run < iters; run++) {
		covariance = (run < ADAPTIVE_THRESHOLD) ? cov0 : sample_cov;

		// Get next sample, but also decompose the covariance in LTM.
		multivariate_with_cov(params, covariance, noise);
		for (int i = 0; i < params; i++) new_theta[i] = noise[i] + theta[i];

		// Check if either parameter is out of bounds.
		int out_of_bounds = 0;
		if (new_theta[0] < 0.0) out_of_bounds = 1;
		if (new_theta[1] < 0.0 || new_theta[1] > 1.0) out_of_bounds = 1;
		if (new_theta[2] < 0.0) out_of_bounds = 1;

		lp_proposal = log_posterior(f, n, alpha, new_theta);

		// Accept with probability r and if r > 1, then accept.
		double r = uniform_in_range(0, 1);
		
		if (lp_proposal - lp_sample > log(r) && !out_of_bounds) {
			// Accept.
			lp_sample = lp_proposal;
			accepted += 1;
			memcpy(theta, new_theta, sizeof(new_theta));
		}

		// Update empirical MAP estimate.
		if (lp_proposal > lp_map && !out_of_bounds) {
			lp_map = lp_proposal;
			memcpy(theta_map, new_theta, sizeof(new_theta));
		}

		for (int i = 0; i < params; i++) {
			prev_mean[i] = sample_mean[i];
			sample_mean[i] = (sample_mean[i]*(run+1) + theta[i])/(run+2);
		}

		if (run == 0) {
			// Initialize covariance matrix when there are two samples
			for (int i = 0; i < params; i++)
				for (int j = 0; j < params; j++) {
					// Using theta_map as it stores the first value of theta.
					sample_cov[i*params+j] = (theta[i] - sample_mean[i]) *
						(theta[j] - sample_mean[j]) + 
						(theta_map[i] - sample_mean[i]) *
						(theta_map[j] - sample_mean[j]) + 
						((i == j) ? ADAPTIVE_EPS : 0);
					sample_cov[i*params+j] *= ADAPTIVE_SCALE;
				}
		} else {
			// For subsequent runs, update the existing sample covariance.
			for (int i = 0; i < params; i++) 
				for (int j = 0; j < params; j++) {
					double diff = (run+1)*prev_mean[i]*prev_mean[j] -
						(run+2)*sample_mean[i]*sample_mean[j] +
						theta[i]*theta[j] +
						((i == j) ? ADAPTIVE_EPS : 0);

					sample_cov[i*params+j] = run*sample_cov[i*params+j]/
						(run+1) + ADAPTIVE_SCALE*diff/(run+1);
				}
		}
	}

	printf("Accepted in Adaptive MH: %d out of %d\n", accepted, iters);
}

void simple_metropolis(FILE *sample_fp, double *f, int n, int params,
	double *cov, double *theta_map, int iters, double alpha) {
	int out_of_bounds_rejections_count = 0;
	double theta[params];
	for (int i = 0; i < params; i++) theta[i] = theta_map[i];
	double lp_sample = log_posterior(f, n, alpha, theta);
	double lp_map = lp_sample;
	int accepted = 0;
	double lp_proposal;
	double new_theta[params], noise[params];

	for (int i = 0; i < iters; i++) {
		// Propose using Q(new_theta/theta).
		multivariate_with_cholesky(params, cov, noise);

		// Multivariate for new_theta[j] samples is centered at theta[j] for
		// each j.
		for (int j = 0; j < params; j++) new_theta[j] = noise[j] + theta[j];

		// Check if either parameter is out of bounds.
		int out_of_bounds = 0;
		if (new_theta[0] < 0.0) out_of_bounds = 1;
		if (new_theta[1] < 0.0 || new_theta[1] > 1.0) out_of_bounds = 1;
		if (new_theta[2] < 0.0) out_of_bounds = 1;
		if (out_of_bounds) out_of_bounds_rejections_count++;

		lp_proposal = log_posterior(f, n, alpha, new_theta);

		// Accept with probability r and if r > 1, then accept.
		double r = uniform_in_range(0,1);
		if (lp_proposal - lp_sample > log(r) && !out_of_bounds) {
			// Accept.
			lp_sample = lp_proposal;
			accepted += 1;
			memcpy(theta, new_theta, sizeof(new_theta));
		}

		// Update empirical MAP estimate.
		if (lp_proposal > lp_map && !out_of_bounds) {
			lp_map = lp_proposal;
			//printf("%lf %lf %lf %lf\n", theta_map[0], new_theta[0], lp_proposal, lp_map);
			memcpy(theta_map, new_theta, sizeof(new_theta));
		}
		
		// Print to file for plots.
		if (i > BURNIN)// && i%THIN == 0)
		{
			for (int j = 0; j < params; j++) {
				fprintf(sample_fp, "%lf ", theta[j]);
			}
			fprintf(sample_fp, "\n");
		}
	}
	// Add a single line at the end containing MAP.
	fprintf(sample_fp, "MAP ");
	for (int i = 0; i < params; i++) {
		fprintf(sample_fp, "%lf ", theta_map[i]);
	}
	fprintf(sample_fp, "\n");
	printf("Accepted: %lf\n", (double)accepted/(double)iters);
	printf("Out of bounds rejections count: %d\n",
		out_of_bounds_rejections_count);

}

// Code to generate fluorescence reads.
void generate_data(double alpha, double *F, int n) {
	FILE *fp;
	fp = fopen("inference_data/qpcr_generated_data.dat", "w");
	int64_t x = TRUE_X0;
	double p = TRUE_P;
	double sigma = TRUE_SIGMA;
	for (int i = 1; i <= n; i++) {
		x = x + binomial_sample(p, x);
		// First amplify, then measure fluorescence (since no F0 for x0).
		F[i] = alpha*x + sqrt(sigma)*rand_N();
		fprintf(fp, "%lf\n", F[i]);
	}
	fclose(fp);
}

void read_data_file(double *F, int* n) {
	FILE *fp;
	fp = fopen("inference_data/fluorescence_reads.dat", "r");
	*n = 0;
	// F[0] will be 0 (index at 1, since no read for X0).
	double d;
	while (fscanf(fp, "%lf", &d) != EOF) {
		F[++(*n)] = d;
		printf("%lf\n", F[*n]);
	}
	fclose(fp);
}

int main(int argc, char* argv[]) {
	int my_seed;
	// Setup GSL library.
  	gsl_rng_env_setup();
	gsl_rand = gsl_rng_alloc(gsl_rng_default);

	clock_t begin = clock();
	if (argc != 2) {
		printf("You must provide seed for srand()!\n");
		return 0;
	} else {
		my_seed = atoi(argv[1]);		
		printf("Seed = %d\n", my_seed);
	}

	srand48(my_seed);

	// Read fluorescence from file.
	int n = 35;
	double F[50];
	read_data_file(F, &n);

	FILE *sample_fp;
	sample_fp = fopen("inference_data/qpcr_posterior_samples_alphas.dat", "w");

	// Empirical covariance to be derived using Adaptive MH or a simple MH run.
	double empirical_cov[9];
	double empirical_chol[9];
	double theta_map[3];
	double cov[9] = {
		0.1,0,0,
		0,0.1,0,
		0,0,0.1};

	// Run simulation to get MAP estimate.
	simulate_for_MAP(F, n, 3, cov, theta_map, 1000, ALPHA);
	
	// Run adaptive MH to get a better covariance estimate.
	simulate_adaptive_mh(F, n, 3, cov, empirical_cov, theta_map, 1000, ALPHA);
	
	// Get Cholesky factor of empirical covariance matrix.
	cholesky(empirical_cov, empirical_chol, 3);
	
	// Run MH with bootstrap particle filter step using covariance estimate
	// from adaptive MH.
	simple_metropolis(sample_fp, F, n, 3, empirical_chol, theta_map, 100000,
		ALPHA);

	// Print time.
	clock_t end = clock();
	double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
	printf("Total execution time: %lf\n", time_spent);
	fclose(sample_fp);
	gsl_rng_free(gsl_rand);

	return 0;
}