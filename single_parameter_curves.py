import numpy as np
from matplotlib import pyplot as plt

# Number of single qPCR experiment simulations.
simulations = 1000

# Fixed x0 for single experiment. TODO: put in .dat file.
x0 = 30
p = 0.8
alpha = 0.05
sigma = 100



# Perform multiple simulations for single parameter.
cycles = 15

# Plot filled space between q5 and q95, together with MAP and means.
# theta = [x0 p sigma]
cycle_range = np.arange(1, cycles+1, 1)


# Curves between Q5 and Q95.
fig = plt.figure()
data = fig.add_subplot(111)


# Parse theta values from file.
file_obj = open("qpcr_posterior_samples.dat", "r")
lines = file_obj.readlines()

theta_values = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		# Extract the line containing the theta MAP.
		theta_map = list(map(lambda theta_i: float(theta_i), theta[1:]))
		continue
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	theta_values.append(parsed_theta)

print("Theta MAP: ", theta_map)

theta_values = np.asarray(theta_values)

y = []
for theta in theta_values:
	# Simulate a qPCR experiment to get curve for current theta.
	molecules = theta[0]
	ampl_curve = []
	for c in range(cycles):
		diff = np.random.binomial(molecules, theta[1])
		molecules = molecules + diff
		ampl_curve.append(alpha*molecules)
	y.append(ampl_curve)
y = np.asarray(y)
y_q5 = []
y_q95 = []
y_mean = []
for i in range(cycles):
	y_values = y[:,i]
	y_q5.append(np.percentile(y_values, 5))
	y_mean.append(np.percentile(y_values, 50))
	y_q95.append(np.percentile(y_values, 95))


data.fill_between(cycle_range, y_q5, y_q95, alpha=0.5, color='r')
#data.plot(cycle_range, y_map, color='r', label='MAP')
#data.plot(cycle_range, y_mean, color='k', label = 'Mean theta')






'''
# Parse generated training data from corresponding file.
training_data_file = open("qpcr_generated_data.dat", "r")
lines = training_data_file.readlines()
true_theta = lines[0].split()
true_theta = list(map(lambda theta_i: float(theta_i), true_theta))

# Parse the rest of the data, corresponding to the generated fluorescence reads.
lines = lines[1:]
f_data = []
for line in lines:
	f_data.append(float(line))
'''



y = []
for i in range(simulations):
	# Simulate a qPCR experiment to get curve for current theta.
	molecules = x0
	ampl_curve = []
	for c in range(cycles):
		diff = np.random.binomial(molecules, p)
		molecules = molecules + diff
		ampl_curve.append(alpha*molecules)
	y.append(ampl_curve)

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
data.plot(cycle_range, y_mean, color='k', label = 'Mean curve')
#data.plot(cycle_range, f_data, '--', color='r',
#	label='Training fluorescence data')
data.legend()

plt.show()

