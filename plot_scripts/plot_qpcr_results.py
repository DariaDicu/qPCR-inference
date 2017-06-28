import numpy as np
from matplotlib import pyplot as plt

# Constant used in data generation. TODO: Put in .dat file.
alpha = 3.03125968064e-09

file_obj = open("inference_data/qpcr_posterior_samples.dat", "r")
lines = file_obj.readlines()

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

# Traceplots.
fig = plt.figure()
x0_trace = fig.add_subplot(221, title="x0 trace")
p_trace = fig.add_subplot(222, title="p trace")
sigma_trace = fig.add_subplot(223, title="sigma trace")

# Curves between Q5 and Q95.
fig2 = plt.figure()
data = fig2.add_subplot(111, title="Fluorescence reads")

# Posteriors.
fig3 = plt.figure()
x0_posterior = fig3.add_subplot(221, title="x0 posterior")
p_posterior = fig3.add_subplot(222, title="p posterior")
sigma_posterior = fig3.add_subplot(223, title="sigma posterior")

x0_trace.plot(theta_values[:, 0])
p_trace.plot(theta_values[:, 1])
sigma_trace.plot(theta_values[:, 2])

# Parse generated training data from corresponding file.
training_data_file = open("real_fluorescence_data.dat", "r")
lines = training_data_file.readlines()

# Parse fluorescence data used for inference.
f_data = []
for line in lines:
	f_data.append(float(line))

print(f_data)

theta_mean = [1, 2, 3]
for i in range(3):
	theta_mean[i] = np.mean(theta_values[:,i])
print("Theta mean: ", theta_mean)

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
		diff = np.random.binomial(molecules, theta[1])
		molecules = molecules + diff
		ampl_curve.append(alpha*molecules)
	y.append(ampl_curve)


# Simulate curve for theta_MAP.
molecules = theta_map[0]
y_map = []
for c in range(cycles):
	diff = np.random.binomial(molecules, theta_map[1])
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

# Plot marginal posteriors.
x0_min = int(min(theta_values[:, 0]))
x0_max = int(max(theta_values[:, 0]))
x0_centers = range(x0_min, x0_max+1)
x0_posterior.hist(theta_values[:, 0], x0_centers, align='left')
p_posterior.hist(theta_values[:, 1], 100)
sigma_posterior.hist(theta_values[:, 2], 100)

plt.show()

