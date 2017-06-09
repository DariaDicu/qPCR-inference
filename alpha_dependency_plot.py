import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde

# Fixed x0 for single experiment. TODO: put in .dat file.
#x0 = 20

# theta = [alpha p sigma]
file_obj = open("saved_data/posterior_samples_10_3_17_different_alphas.dat", "r")
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
posteriors.axvline(266, color='k', linestyle='--')
molecule_plots[0].axvline(266, color='k', linestyle='--')
molecule_plots[1].axvline(266, color='k', linestyle='--')
molecule_plots[2].axvline(266, color='k', linestyle='--')
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