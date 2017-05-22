import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re

X0 = 1000000

# TODO: + C*f
def F(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb 

fig = plt.figure()
Rn_plot = fig.add_subplot(211, title="Rn amplification plot")
alpha_plot = fig.add_subplot(212, title="Alpha values")
plotted = 0

file_obj = open("16-12-16.txt", "r")
lines = file_obj.readlines()

standards = []
standards.extend(map(lambda line: (line, 1000000), lines[2:5]))
standards.extend(map(lambda line: (line, 1000000), lines[26:29]))
standards.extend(map(lambda line: (line, 100000), lines[50:53]))
standards.extend(map(lambda line: (line, 100000), lines[74:77]))
standards.extend(map(lambda line: (line, 10000), lines[98:101]))
standards.extend(map(lambda line: (line, 10000), lines[122:125]))
standards.extend(map(lambda line: (line, 1000), lines[146:149]))
standards.extend(map(lambda line: (line, 1000), lines[170:173]))

iteration = 0
alpha_samples = []
for entry in standards:
	# Split by tab.
	line, X0 = entry
	singlecell_data = re.split(r'\t+', line)
	#2:47
	#47:(47+45)
	Rn_data = list(map(lambda val: float(val), singlecell_data[47:92]))

	xdata = range(1, 46)

	popt, pcov = curve_fit(F, xdata, Rn_data, bounds=([0, 0, 0, 0], np.inf))

	if (plotted == 0):
		# Only plot first one.
		plotted = 1
		Rn_plot.scatter(xdata, Rn_data)
		Rn_plot.plot(xdata, F(xdata, *popt), 'r-', label='fit')

	print("\n\nX0 for this standard is ", X0)
	print(*popt)

	Fmax = popt[0]
	Chalf = popt[1]
	k = popt[2]
	Fb = popt[3]

	F0 = Fmax/(1+np.exp(Chalf/k))
	alpha_estimate = F0/X0
	iteration += 1
	alpha_samples.append(alpha_estimate)
	print("Alpha estimate: ", alpha_estimate)

print("Alpha mean and variance: ", np.mean(alpha_samples), " ", np.var(alpha_samples))
alpha_plot.scatter(range(1, iteration+1), alpha_samples)
alpha_plot.axhline(y=np.mean(alpha_samples))
alpha_plot.set_ylim([np.min(alpha_samples), np.max(alpha_samples)])
plt.show()