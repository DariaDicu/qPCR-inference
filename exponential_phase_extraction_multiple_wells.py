# Similar to exponential_phase_extraction_single_experiment.py, but produces a
# file joint_fluorescence_reads.dat that contains fluorescence reads
# corresponding to multiple wells. This file is used when performing parameter
# pooling inference.
# For more details about the method for extracting the exponential phase, see
# exponential_phase_extraction_single_experiment.py.
import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re

wanted_wells = [253,254,255,256]

file_obj = open("experimental_data/10-3-17.txt", "r")
lines = file_obj.readlines()
lines = lines[2:]
output_file = open("inference_data/joint_fluorescence_reads.dat", 'w')

def sigmoid(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb


def exponential(C, a, b, c):
	return a*np.exp(b*C) + c

def compare_AIC(i, wanted_well, Rn_data):
	xdata = range(1, i+1)
	popt_sig, pcov_sig = curve_fit(sigmoid, xdata, Rn_data, maxfev=10000)
	popt_exp, pcov_exp = curve_fit(exponential, xdata, Rn_data, maxfev=10000)

	Fmax = popt_sig[0]
	Chalf = popt_sig[1]
	k = popt_sig[2]
	Fb = popt_sig[3]

	rss_exp = np.sum(np.array(Rn_data - exponential(xdata, *popt_exp))**2)
	rss_sig = np.sum(np.array(Rn_data - sigmoid(xdata, *popt_sig))**2)

	AIC_exp = 2*3 + i*np.log(rss_exp/i)
	AIC_sig = 2*4 + i*np.log(rss_sig/i)

	#print(AIC_exp, " ", AIC_sig, "\n")
	
	if (AIC_exp < AIC_sig):
		output_file.write(str(len(Rn_data))+"\n")
		output_file.write("\n".join(map(str, Rn_data))+"\n")
		'''
		fig = plt.figure()
		exp_plot = fig.add_subplot(211, title="Exponential")
		sig_plot = fig.add_subplot(212, title="Sigmoid")
		sig_plot.scatter(xdata, Rn_data)
		sig_plot.plot(xdata, sigmoid(xdata, *popt_sig), 'r-', label='fit')


		exp_plot.scatter(xdata, Rn_data)
		exp_plot.plot(xdata, exponential(xdata, *popt_exp), 'r-', label='fit')

		plt.show()'''
	return (AIC_exp < AIC_sig)


# Main function.
output_file.write(str(len(wanted_wells))+"\n")
for wanted_well in wanted_wells:
	Rn_data = []
	for line in lines:
		well = re.split(r'\t+', line)[0]
		if (int(well) == wanted_well):
			singlecell_data = re.split(r'\t+', line)
			Rn_data = list(map(lambda val: float(val), singlecell_data[47:92]))


	for i in range(45, 0, -1):
		is_exp_AIC_smaller = compare_AIC(i, wanted_well, Rn_data[:i])
		if (is_exp_AIC_smaller):
			print("Smaller at cycle ", i)
			break
		