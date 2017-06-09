import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
import json

# Fixed x0 for single experiment. TODO: put in .dat file.
#x0 = 20

# theta = [alpha p sigma]
file_obj = open("saved_data/10_03_well352/qpcr_posterior_samples.dat", "r")
lines = file_obj.readlines()

theta_values = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		# Extract the line containing the theta MAP.
		theta_map = list(map(lambda theta_i: float(theta_i), theta[1:]))
		break
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	theta_values.append(parsed_theta)

json_outfile = open("website/samples_10_3_17.json", "w")
theta_values = np.asarray(theta_values)
data = theta_values[:, 0]

# For json HighCharts.
bins = np.arange(1000);
binned_data = np.histogram(data, bins)
json.dump(binned_data[0].tolist(), json_outfile)