import numpy as np
from matplotlib import pyplot as plt

# Constant used in data generation. TODO: Put in .dat file.
alpha = 3.03125968064e-09
params = 5
std_curve_data_means = [61, 79, 58];#, 71];

file_obj = open("qpcr_joint_posterior_samples.dat", "r")
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

theta_values = np.asarray(theta_values)


print("Theta mean: ")
for i in range(params):
	print(np.mean(theta_values[:, i]))
print("\n")
k = len(theta_values[0])

# Traceplots.
for i in range(params):
	fig = plt.figure("Traceplots "+str(i))
	plt.plot(theta_values[:, i])

	# Plot marginal posteriors.

fig2 = plt.figure()
x0_posterior = fig2.add_subplot(221, title="x0 posterior")
p_posterior = fig2.add_subplot(222, title="p posterior")
sigma_posterior = fig2.add_subplot(223, title="sigma posterior")

for i in range(params-2):
	x0_min = int(min(theta_values[:, i]))
	x0_max = int(max(theta_values[:, i]))
	x0_centers = range(x0_min, x0_max+1)
	x0_posterior.hist(theta_values[:, i], x0_centers, align='left')

for xc in std_curve_data_means:
    x0_posterior.axvline(x=xc, color='k', linestyle='--')

p_posterior.hist(theta_values[:, params-2], 100)
sigma_posterior.hist(theta_values[:, params-1], 100)


plt.show()

