import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re

wanted_well = 352

def F(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb 
fig = plt.figure()
#Rn_plot = fig.add_subplot(211, title="Rn amplification plot")
Rn_plot = fig.add_subplot(111, title="Alpha values")

file_obj = open("sigmoid/10-3-17-clipped.txt", "r")
lines = file_obj.readlines()

Rn_data = []
lines = lines[2:]
for line in lines:
	well = re.split(r'\t+', line)[0]
	if (int(well) == wanted_well):
		singlecell_data = re.split(r'\t+', line)
		Rn_data = list(map(lambda val: float(val), singlecell_data[47:92]))


xdata = range(1, 46)
popt, pcov = curve_fit(F, xdata, Rn_data, bounds=([0, 0, 0, 0], np.inf))

Fmax = popt[0]
Chalf = popt[1]
k = popt[2]
Fb = popt[3]

last_read = int(Chalf) + 1


print(Rn_data[:last_read])
Rn_data = Rn_data[:last_read]

plotted = 1
Rn_plot.scatter(range(1, last_read+1), Rn_data)
Rn_plot.plot(xdata, F(xdata, *popt), 'r-', label='fit')

plt.show()

'''
iteration = 0
alpha_samples_1 = []
alpha_samples_2 = []
alpha_samples_3 = []
alpha_samples_4 = []
for entry in standards:
	# Split by tab.
	line, X0, experiment_label = entry
	singlecell_data = re.split(r'\t+', line)
	#2:47
	#47:(47+45)
	Rn_data = list(map(lambda val: float(val), singlecell_data[47:92]))

	xdata = range(1, 46)

	popt, pcov = curve_fit(F, xdata, Rn_data, bounds=([0, 0, 0, 0], np.inf))

	print("\n\nX0 for this standard is ", X0)
	print("\n", line, "\n")
	print(*popt)

	Fmax = popt[0]
	Chalf = popt[1]
	k = popt[2]
	Fb = popt[3]

	F0 = Fmax/(1+np.exp(Chalf/k))
	alpha_estimate = F0/X0
	iteration += 1
	if (experiment_label == 1):
		alpha_samples_1.append(alpha_estimate)
	elif (experiment_label == 2):
		alpha_samples_2.append(alpha_estimate)
	elif (experiment_label == 3):
		alpha_samples_3.append(alpha_estimate)
	else:
		alpha_samples_4.append(alpha_estimate)
	print("Alpha estimate: ", alpha_estimate)

print("Alpha mean and variance for 10/3/17: ", np.mean(alpha_samples_4), " ", np.var(alpha_samples_4))

#alpha_samples = np.concatenate([alpha_samples_1, alpha_samples_2], 0)
alpha_samples_1 = np.log10(alpha_samples_1)
alpha_samples_2 = np.log10(alpha_samples_2)
alpha_samples_3 = np.log10(alpha_samples_3)
alpha_samples_4 = np.log10(alpha_samples_4)
alpha_samples_combined = np.concatenate([alpha_samples_1, alpha_samples_2,
	alpha_samples_3, alpha_samples_4], 0)
#min_v = np.min(np.min(alpha_samples_1), np.min(alpha_samples_2))
#max_v = np.max(np.max(alpha_samples_1), np.max(alpha_samples_2))
alpha_plot.boxplot([alpha_samples_1, alpha_samples_2, alpha_samples_3, alpha_samples_4])
alpha_plot.set_xticks([1,2,3,4])
alpha_plot.set_xticklabels(['BJCOII (02/03/17)', 'BJ-CYB C57 (02/03/17)', 'BJmmMUP (16/12/16)', '10/03/17'], rotation=45, rotation_mode="anchor")
#alpha_plot.scatter(range(1, iteration+1), alpha_samples)
#alpha_plot.axhline(y=np.mean(alpha_samples))
#alpha_plot.set_ylim([min_v, max_v])
plt.show()
'''