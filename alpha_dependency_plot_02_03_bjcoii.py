import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
import json

# Fixed x0 for single experiment. TODO: put in .dat file.
#x0 = 20

# theta = [alpha p sigma]
file_obj = open("saved_data/qpcr_posterior_samples_bjcoii_02_03.dat", "r")
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
posteriors = fig.add_subplot(331, title="Posterior")
molecule_plots = [fig.add_subplot(332, title="X0 = 262144 molecules"),
	fig.add_subplot(333, title="X0 = 65536 molecules"),
	fig.add_subplot(334, title="X0 = 16384 molecules"),
	fig.add_subplot(335, title="X0 = 4096 molecules"),
	fig.add_subplot(336, title="X0 = 1024 molecules"),
	fig.add_subplot(337, title="X0 = 256 molecules"),
	fig.add_subplot(338, title="X0 = 64 molecules"),
	fig.add_subplot(339, title="X0 = 16 molecules")]

# Experimental result by standard curve method.
posteriors.axvline(266, color='k', linestyle='--')
for i in range(8):
	molecule_plots[i].axvline(266, color='k', linestyle='--')

cnt = 0
colors = ['m', 'g', 'c', 'k', 'm', 'g', 'c', 'k']
bin_index = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7]
for bin in alpha_sample_bins:
	theta_values = np.asarray(bin)
	data = theta_values[:, 0]
	density = gaussian_kde(data)
	xs = np.linspace(np.min(data), np.max(data), 1000)
	density.covariance_factor = lambda : .25
	density._compute_covariance()
	# Color each depending on number of initial molecules.
	x0_bin_number = bin_index[cnt]
	posteriors.fill_between(xs, 0, density(xs), alpha=0.3,
		color=colors[x0_bin_number])
	molecule_plots[x0_bin_number].fill_between(xs, 0, density(xs), alpha=0.3,
		color=colors[x0_bin_number])
	#m = np.max(density(xs))
	cnt += 1
	#posteriors.axvline(m, color='r', linestyle='--', label=str(cnt))

plt.show()