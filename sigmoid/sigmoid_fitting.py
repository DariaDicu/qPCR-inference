import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re
import json

# TODO: + C*f
def F(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb 

fig = plt.figure()
#Rn_plot = fig.add_subplot(211, title="Rn amplification plot")
alpha_plot = fig.add_subplot(111, title="Alpha values")
plotted = 0

file_obj_2_3_17 = open("2-3-17.txt", "r")
file_obj_10_3_17 = open("10-3-17-clipped.txt", "r")
file_obj_16_12_16 = open("16-12-16.txt", "r")
lines = file_obj_2_3_17.readlines()

standards = []

experiment1_wells = [7, 8, 9, 31, 32, 33, 55, 56, 57, 79, 80, 81, 103, 104, 105,
	127, 128, 151, 152, 153, 176, 177]
lines = lines[2:]
# Manually add lines.
for i in range(8):
	l1 = 7 + i*24
	l2 = l1 + 3
	x0 = 262144/pow(4,i)
	# Really slow, but fast to code.
	filtered_lines = []
	for line in lines:
		well = re.split(r'\t+', line)[0]
		if (int(well) >= l1 and int(well) < l2):
			filtered_lines.append(line)
	standards.extend(map(lambda line: (line, x0, 1), filtered_lines))

for i in range(7):
	l1 = 10 + i*24
	l2 = l1 + 3
	x0 = 262144/pow(4,i)
	# Really slow, but fast to code.
	filtered_lines = []
	for line in lines:
		well = re.split(r'\t+', line)[0]
		if (int(well) >= l1 and int(well) < l2):
			filtered_lines.append(line)
	standards.extend(map(lambda line: (line, x0, 2), filtered_lines))


lines = file_obj_16_12_16.readlines()

standards.extend(map(lambda line: (line, 1000000, 3), lines[2:5]))
standards.extend(map(lambda line: (line, 1000000, 3), lines[26:29]))
standards.extend(map(lambda line: (line, 100000, 3), lines[50:53]))
standards.extend(map(lambda line: (line, 100000, 3), lines[74:77]))
standards.extend(map(lambda line: (line, 10000, 3), lines[98:101]))
standards.extend(map(lambda line: (line, 10000, 3), lines[122:125]))
standards.extend(map(lambda line: (line, 1000, 3), lines[146:149]))
standards.extend(map(lambda line: (line, 1000, 3), lines[170:173]))


lines = file_obj_10_3_17.readlines()
lines = lines[2:]
# Manually add lines.
for i in range(3):
	l1 = 1 + i*24
	l2 = l1 + 3

	x0 = 1000000/pow(10,i)
	# Really slow, but fast to code.
	filtered_lines = []
	for line in lines:
		well = re.split(r'\t+', line)[0]
		if (int(well) >= l1 and int(well) < l2):
			filtered_lines.append(line)
	standards.extend(map(lambda line: (line, x0, 4), filtered_lines))

print("Done extracting wells")

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

	'''
	#if (plotted == 0):
	if (iteration == 7):
		# Only plot first one.
		plotted = 1
		Rn_plot.scatter(xdata, Rn_data)
		Rn_plot.plot(xdata, F(xdata, *popt), 'r-', label='fit')
	'''

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

alpha_samples_file_obj_10_3 = open("alpha_samples_10_03_17.dat", "w")
alpha_samples_file_obj_10_3.write("\n".join(map(str, alpha_samples_4)))
alpha_samples_file_obj_2_3_cyb_c57 = open("alpha_samples_02_03_17_cyb_c57.dat", "w")
alpha_samples_file_obj_2_3_cyb_c57.write("\n".join(map(str, alpha_samples_2)))
alpha_samples_file_obj_2_3_bjcoii = open("alpha_samples_02_03_17_bjcoii.dat", "w")
alpha_samples_file_obj_2_3_bjcoii.write("\n".join(map(str, alpha_samples_1)))

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
json_outfile = open("../website/alpha_boxplots.json", "w")
json_obj = dict([('exp1', alpha_samples_1.tolist()),
	('exp2', alpha_samples_2.tolist()), 
	('exp3', alpha_samples_3.tolist()),
	('exp4', alpha_samples_4.tolist())])
r = json.dumps(json_obj)
json_outfile.write(r)


plt.show()