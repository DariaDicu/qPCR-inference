import numpy as np
from matplotlib import pyplot as plt
import json


file_obj = open("saved_data/253-10317-single-and-joint/qpcr_joint_posterior_samples_10-5runs_3params.dat", "r")
lines = file_obj.readlines()

# Constant used in data generation. TODO: Put in .dat file.
alpha = 3.03125968064e-09

theta_values = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		# Extract the line containing the theta MAP.
		theta_map = list(map(lambda theta_i: float(theta_i), theta[1:]))
		break
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	#if (parsed_theta[1] > 0.88):
	#	continue
	theta_values.append(parsed_theta)

print("Theta MAP: ", theta_map)

theta_values = np.asarray(theta_values)

k = len(theta_values[0])

# Curves between Q5 and Q95.
fig2 = plt.figure()
data = fig2.add_subplot(111, title="Fluorescence reads")

f_data = [-2.9843912,-3.500936, -3.0409336,-3.1643357, -2.7622252,-2.7776258, -2.375027, -2.4586647, -1.8583272, -1.587549,
-1.2040541,-1.0458095,-1.2144692,-0.824642,-0.41247588,-0.48210606,-0.45844397,-0.21189678,0.034055337,0.041924562,-0.02901786,-0.15696712,-0.052326653,0.28021908,-0.11332465,0.061460465,0.5802092,0.3371324,0.7466435,2.1853447,4.4825053,9.235721,17.086393,
32.21566,55.45563]

print(f_data)

cycles = len(f_data)

# Plot filled space between q5 and q95, together with MAP and means.
# theta = [x0 p sigma]
cycle_range = np.arange(1, cycles+1, 1)
y = []
for theta in theta_values:
	# Simulate a qPCR experiment to get curve for current theta.
	molecules = theta[0]
	ampl_curve = []
	for c in range(cycles):
		diff = np.random.binomial(molecules, theta[3])
		molecules = molecules + diff
		ampl_curve.append(alpha*molecules)
	y.append(ampl_curve)


# Simulate curve for theta_MAP.
molecules = theta_map[0]
y_map = []
for c in range(cycles):
	diff = np.random.binomial(molecules, theta_map[3])
	molecules = molecules + diff
	y_map.append(alpha*molecules)

# Get y-value for Q5, Q95 and mean values at each cycle.
y = np.asarray(y)
y_q5 = []
y_q95 = []
y_mean = []
for i in range(cycles):
	y_values = y[:,i]
	y_q5.append(np.percentile(y_values, 5))
	y_mean.append(np.percentile(y_values, 50))
	y_q95.append(np.percentile(y_values, 95))

data.fill_between(cycle_range, y_q5, y_q95, alpha=0.5)
data.plot(cycle_range, y_map, color='r', label='MAP')
data.plot(cycle_range, y_mean, color='k', label = 'Mean theta')
data.plot(cycle_range, f_data, '--', color='r', label = 'Training data')
data.legend()


json_outfile = open("website/bci_data.json", "w")
json_obj = dict([('f_data', f_data),
	('y_map', y_map), 
	('y_mean', y_mean),
	('y_q5', y_q5),
	('y_q95', y_q95)])
r = json.dumps(json_obj)
json_outfile.write(r)


plt.show()

