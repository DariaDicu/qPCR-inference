# Produce a plot showing how the marginals inferred for X0 depend on the
# different 9 alphas estimated standards using data from 10/3/17.
# A different alpha was estimated for each of the 9 standards, using sigmoid
# fitting. The initial copy number of the standards was 100,000 for the first 3,
# 10,000 for the next 3 and 1,000 for the 
import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde

# Set the true X0 (or the standard curve estimate).
true_x0 = 60

file_obj = open("inference_data/qpcr_joint_posterior_samples_alphas.dat", "r")
lines = file_obj.readlines()

alpha_sample_bins = []

theta_values = []
theta_map_array = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		# Extract the line containing the theta MAP.
		theta_map = list(map(lambda theta_i: float(theta_i), theta[1:]))
		alpha_sample_bins.append(theta_values)
		theta_map_array.append(theta_map)
		theta_values = []
		continue
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	theta_values.append(parsed_theta)


# Traceplots.
fig = plt.figure()
posteriors = fig.add_subplot(221, title="Posterior")
molecule_plots = [fig.add_subplot(222, title="X0 = 10^6 molecules"),
	fig.add_subplot(223, title="X0 = 10^5 molecules"),
	fig.add_subplot(224, title="X0 = 10^4 molecules")]

# Experimental result by standard curve method.
posteriors.axvline(true_x0, color='k', linestyle='--')
molecule_plots[0].axvline(true_x0, color='k', linestyle='--')
molecule_plots[1].axvline(true_x0, color='k', linestyle='--')
molecule_plots[2].axvline(true_x0, color='k', linestyle='--')
cnt = 0
colors = ['m', 'g', 'c']
for bin in alpha_sample_bins:
	theta_values = np.asarray(bin)
	data = theta_values[:, 0]
	density = gaussian_kde(data)
	xs = np.linspace(np.min(data), np.max(data), 1000)
	density.covariance_factor = lambda : .25
	density._compute_covariance()
	# Color each depending on number of initial molecules.
	x0_bin_number = int(cnt/3)
	posteriors.fill_between(xs, 0, density(xs), alpha=0.3,
		color=colors[x0_bin_number])
	molecule_plots[x0_bin_number].fill_between(xs, 0, density(xs), alpha=0.3,
		color=colors[x0_bin_number])
	#m = np.max(density(xs))
	cnt += 1
	#posteriors.axvline(m, color='r', linestyle='--', label=str(cnt))

plt.show()