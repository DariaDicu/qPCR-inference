import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re

# TODO: + C*f
def F(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb 

fig = plt.figure()
efficiency_plot = fig.add_subplot(111, title="Efficiency values")

file_obj_10_3_17 = open("10-3-17-clipped.txt", "r")

standards = []

lines = file_obj_10_3_17.readlines()
lines = lines[2:]


# TODO: add the rest!
single_cell_wells = [13,14,15,16,17,18,19,20,21,22,23,24,
	61,62,63,64,65,66,67,68,69,70,71,72,
	109,110,111,112,113,114,115,116,117,118,119,120]

filtered_lines = []
for line in lines:
	well = re.split(r'\t+', line)[0]
	if (int(well) in single_cell_wells):
		filtered_lines.append(line)

print("Done extracting wells")

iteration = 0
k_samples = []
for line in filtered_lines:
	# Split by tab.
	singlecell_data = re.split(r'\t+', line)
	#2:47
	#47:(47+45)
	Rn_data = list(map(lambda val: float(val), singlecell_data[47:92]))

	xdata = range(1, 46)

	popt, pcov = curve_fit(F, xdata, Rn_data, bounds=([0, 0, 0, 0], np.inf))

	'''
	#if (plotted == 0):
	if (iteration == 7):
		# Only plot first one.
		plotted = 1
		Rn_plot.scatter(xdata, Rn_data)
		Rn_plot.plot(xdata, F(xdata, *popt), 'r-', label='fit')
	'''
	print(*popt)

	Fmax = popt[0]
	Chalf = popt[1]
	k = popt[2]
	Fb = popt[3]

	iteration += 1

	k_samples.append(k)
	'''
	if (experiment_label == 1):
		alpha_samples_1.append(alpha_estimate)
	elif (experiment_label == 2):
		alpha_samples_2.append(alpha_estimate)
	elif (experiment_label == 3):
		alpha_samples_3.append(alpha_estimate)
	else:
		alpha_samples_4.append(alpha_estimate)
	print("Alpha estimate: ", alpha_estimate)'''

print("k mean and variance: ", np.mean(k_samples), " ", np.var(k_samples))

efficiency_plot.boxplot([k_samples])

plt.show()