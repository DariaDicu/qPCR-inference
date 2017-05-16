import numpy as np
from matplotlib import pyplot as plt

file_obj = open("qpcr_posterior_samples.dat", "r")
lines = file_obj.readlines()

theta_values = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		theta_map = list(map(lambda theta_i: float(theta_i), theta[1:]))
		continue
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
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
data = fig2.add_subplot(111)

# Posteriors.
fig3 = plt.figure()
x0_posterior = fig3.add_subplot(221, title="x0 posterior")
p_posterior = fig3.add_subplot(222, title="p posterior")
sigma_posterior = fig3.add_subplot(223, title="sigma posterior")
#a2_posterior = fig3.add_subplot(233, title="a2 posterior")
#a3_posterior = fig3.add_subplot(234, title="a3 posterior")
#sigma_posterior = fig3.add_subplot(235, title="sigma posterior")

x0_trace.plot(theta_values[:, 0])
p_trace.plot(theta_values[:, 1])
sigma_trace.plot(theta_values[:, 2])

# Parse generated training data from corresponding file.
training_data_file = open("qpcr_generated_data.dat", "r")
lines = training_data_file.readlines()
true_theta = lines[0].split()
true_theta = list(map(lambda theta_i: float(theta_i), true_theta))
#TODO: plot mean lines.
lines = lines[1:]
f_data = []
for line in lines:
	f_data.append(float(line))
cycles = len(f_data)
x_data = range(len(f_data))
#data.plot(x_data, f_data, "-", alpha=0.5)

# Plot filled space between q5 and q95, together with MAP and means.
# theta = [x0 p sigma]
cycle_range = np.arange(0, cycles+1, 1)
y = []
for theta in theta_values:
	molecules = theta[0]
	ampl_curve = [molecules]
	for c in range(cycles):
		diff = np.random.binomial(molecules, theta[1])
		molecules = molecules + diff
		ampl_curve.append(molecules)
	y.append(ampl_curve)


molecules = theta_map[0]
y_map = [molecules]
for c in range(cycles):
	diff = np.random.binomial(molecules, theta_map[1])
	molecules = molecules + diff
	y_map.append(molecules)

molecules = true_theta[0]
y_true = [molecules]
for c in range(cycles):
	diff = np.random.binomial(molecules, true_theta[1])
	molecules = molecules + diff
	y_true.append(molecules)

y = np.asarray(y)
y_q5 = []
y_q95 = []
y_mean = []
for i in cycle_range:
	y_values = y[:,i]
	y_q5.append(np.percentile(y_values, 5))
	y_mean.append(np.percentile(y_values, 50))
	y_q95.append(np.percentile(y_values, 95))


data.fill_between(cycle_range, y_q5, y_q95, alpha=0.5)
data.plot(cycle_range, y_map, color='r')
data.plot(cycle_range, y_mean, color='k')
data.plot(cycle_range, y_true, '--', color='r')
# Plot marginal posteriors.
x0_posterior.hist(theta_values[:, 0], 100)
p_posterior.hist(theta_values[:, 1], 100)
sigma_posterior.hist(theta_values[:, 2], 100)

plt.show()

