import sys
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation



class AdaptiveMetropolisSampler:
    def __init__(self, parameters, log_posterior, threshold=100,
                 epsilon=1e-5, scale=5.76, mode='update'):
        # Store information
        self.parameters = np.atleast_1d(parameters)
        self.log_posterior = log_posterior
        self.threshold = threshold
        self.epsilon = epsilon
        self.mode = mode

        # Store derived information
        self.num_parameters = self.parameters.shape[0]
        # Initialise the proposal scale
        self.scale = scale / self.num_parameters
        # Initialise the covariance matrix
        self.covariance0 = epsilon * np.eye(self.num_parameters)
        # Initialise the running mean and variance
        self.sample_mean = np.zeros(self.num_parameters)
        self.sample_covariance = 0
        # Initialise containers for the samples and log posterior
        self._samples = []
        self.log_posteriors = []

    def acceptance_rate(self, burnin=0):
        """
        Computes the acceptance rate.
        """
        samples = np.asarray(self._samples[burnin:])
        return np.mean(samples[1:] != samples[:-1])

    def __call__(self, num_steps, *args, **kwargs):
        """
        Performs the specified number of Metropolis-Hastings steps.
        :param num_steps: The number of steps to make.
        :return: All samples of the parameter values including samples from previous calls.
        """
        report = kwargs.pop('report', None)
        # Initialise log posterior
        if self.mode=='update':
            lp_current = self.log_posterior(self.parameters, *args, **kwargs)

        # Iterate over steps
        for step in range(num_steps):
            # Make a proposal with the initial covariance or the scaled sample covariance
            _covariance =  0.1*np.eye(self.num_parameters)
            proposal = np.random.multivariate_normal(self.parameters, _covariance)
            # Compute the log posterior
            if self.mode=='update':
                lp_proposal = self.log_posterior(proposal, *args, **kwargs)
            elif self.mode=='reevaluate':
                lp_proposal, lp_current = self.log_posterior(proposal, self.parameters, *args, **kwargs)
            else:
                raise KeyError(self.mode)
            # Accept or reject the step
            if lp_proposal - lp_current > np.log(np.random.uniform()):
                # Update the log posterior and the parameter values
                lp_current = lp_proposal
                self.parameters = proposal

            # Update the sample mean...
            previous_mean = self.sample_mean
            self.sample_mean = (self.parameters + len(self._samples) * previous_mean) / (len(self._samples) + 1)

            # Save the parameters
            self._samples.append(self.parameters)
            self.log_posteriors.append(lp_current)
    
            # Report if desired
            if report and (step + 1) % report==0:
                print(step + 1, self.acceptance_rate(step + 1 - report))

        return np.asarray(self._samples)

    @property
    def samples(self):
        return np.asarray(self._samples)


    def plot_trace(self):
        import matplotlib.pyplot as plt
        ax1 = plt.subplot(121)
        ax1.plot(self._samples)


def __main__():
    from matplotlib import pyplot as plt
    # Generate test data from a multivariate Gaussian
    num_samples = 100
    mu = [3, 4]
    sigma = np.eye(len(mu))
    data = np.random.multivariate_normal(mu, sigma, num_samples)

    # Define the log posterior
    def log_posterior(_parameters, **kwargs):
        residuals = kwargs['data'] - _parameters
        return -5 * np.sum(residuals * residuals)

    # Initialise the adaptive metropolis sampler
    ams = AdaptiveMetropolisSampler(mu, log_posterior)
    # Obtain 2000 samples
    samples = ams(2000, data=data)
    fig = plt.figure()
    fig.set_tight_layout(True)
    colours = "rgb"
    ax1 = fig.add_subplot(111)
    ax1.set_xlabel("Parameter value 1")
    ax1.set_ylabel("Parameter value 2")
    
    for i in range(len(mu)-1):
        ax1.scatter(samples[:, 0], samples[:, 1])
        #ax1.axhline(np.mean(data[:, i]), color=colours[i], ls='--')
        #ax2 = fig.add_subplot(122)

    plt.savefig('hot_posterior.png')
    plt.show()
    print("Acceptance rate: {}".format(ams.acceptance_rate()))
    return ams


if __name__ == '__main__':
    ams = __main__()

'''
fig, ax = plt.subplots()
fig.set_tight_layout(True)

# Query the figure's on-screen size and DPI. Note that when saving the figure to
# a file, we need to provide a DPI for that separately.
print('fig size: {0} DPI, size in inches {1}'.format(
    fig.get_dpi(), fig.get_size_inches()))

# Plot a scatter that persists (isn't redrawn) and the initial line.
x = np.arange(0, 20, 0.1)
ax.scatter(x, x + np.random.normal(0, 3.0, len(x)))
line, = ax.plot(x, x - 5, 'r-', linewidth=2)

def update(i):
    label = 'timestep {0}'.format(i)
    print(label)
    # Update the line and the axes (with a new xlabel). Return a tuple of
    # "artists" that have to be redrawn for this frame.
    line.set_ydata(x - 5 + i)
    ax.set_xlabel(label)
    return line, ax

if __name__ == '__main__':'''
