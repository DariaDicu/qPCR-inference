import numpy as np
from matplotlib import pyplot as plt
import json

# Constant used in data generation. TODO: Put in .dat file.
alpha = 3.03125968064e-09

cycles = 35
true_x0 = 50
true_p = 0.5

# Curves between Q5 and Q95.
fig2 = plt.figure()
data = fig2.add_subplot(211, title="p=0.7")

data2 = fig2.add_subplot(212, title="p=0.7")

# Perform multiple simulations
y1 = []
for i in range(1000):
	# Simulate a qPCR experiment to get curve for current theta.
	molecules = 100000
	ampl_curve = []
	for c in range(cycles):
		diff = np.random.binomial(molecules, 0.7)
		molecules = molecules + diff
		ampl_curve.append(alpha*molecules)
	y1.append(ampl_curve)

y2 = []
for i in range(1000):
	# Simulate a qPCR experiment to get curve for current theta.
	molecules = true_x0
	ampl_curve = []
	for c in range(cycles):
		diff = np.random.binomial(molecules, 0.7)
		molecules = molecules + diff
		ampl_curve.append(alpha*molecules)
	y2.append(ampl_curve)

# Get y-value for Q5, Q95 and mean values at each cycle.
y1 = np.asarray(y1)
y_q5 = []
y_q95 = []
y_mean = []
for i in range(cycles):
	y_values = y1[:,i]
	y_q5.append(np.percentile(y_values, 5))
	y_mean.append(np.percentile(y_values, 50))
	y_q95.append(np.percentile(y_values, 95))

cycle_range = range(1, cycles+1)


data.fill_between(cycle_range, y_q5, y_q95, alpha=0.5)
data.plot(cycle_range, y_mean, color='k', label = 'Mean theta')
data.legend()

y2 = np.asarray(y2)
y_q5_2 = []
y_q95_2 = []
y_mean_2 = []
for i in range(cycles):
	y_values = y2[:,i]
	y_q5_2.append(np.percentile(y_values, 5))
	y_mean_2.append(np.percentile(y_values, 50))
	y_q95_2.append(np.percentile(y_values, 95))

data2.fill_between(cycle_range, y_q5_2, y_q95_2, alpha=0.5)
data2.plot(cycle_range, y_mean_2, color='k', label = 'Mean theta')
data2.legend()

json_outfile = open("website/stochasticity_alpha_estimate.json", "w")

json_obj = dict([('y_q5', y_q5),
	('y_q95', y_q95),
	('y_mean', y_mean),('y_q5_2', y_q5_2),
	('y_q95_2', y_q95_2),
	('y_mean_2', y_mean_2)])

r = json.dumps(json_obj)
json_outfile.write(r)
plt.show()

