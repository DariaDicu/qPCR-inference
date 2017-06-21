import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re

wanted_well = 253 # Used for 10-3-17
#wanted_well = 352 # Used for 10-3-17
#wanted_well = 22 # Used for 2-3-17-BJCOII
#file_obj = open("sigmoid/10-3-17-clipped.txt", "r")
file_obj = open("sigmoid/10-3-17-clipped.txt", "r")
lines = file_obj.readlines()
lines = lines[2:]

def sigmoid(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb


def exponential(C, a, b, c):
	return a*np.exp(b*C) + c

def compare_AIC(i):
	Rn_data = []
	for line in lines:
		well = re.split(r'\t+', line)[0]
		if (int(well) == wanted_well):
			singlecell_data = re.split(r'\t+', line)
			Rn_data = list(map(lambda val: float(val), singlecell_data[47:92]))


	Rn_data = Rn_data[:i]
	xdata = range(1, i+1)
	popt_sig, pcov_sig = curve_fit(sigmoid, xdata, Rn_data, maxfev=100000)
	popt_exp, pcov_exp = curve_fit(exponential, xdata, Rn_data, maxfev=100000)

	Fmax = popt_sig[0]
	Chalf = popt_sig[1]
	k = popt_sig[2]
	Fb = popt_sig[3]

	#print(Fmax, " ", Chalf, " ", k, " ", Fb)

	last_read = int(Chalf) + 1


	#print(Rn_data[:last_read])

	rss_exp = np.sum(np.array(Rn_data - exponential(xdata, *popt_exp))**2)
	#print(rss_exp)
	rss_sig = np.sum(np.array(Rn_data - sigmoid(xdata, *popt_sig))**2)
	#print(rss_sig)


	AIC_exp = 2*3 + i*np.log(rss_exp/i)
	AIC_sig = 2*4 + i*np.log(rss_sig/i)

	#print(AIC_exp, " ", AIC_sig)
	
	if (AIC_exp < AIC_sig):
		f = open("fluorescence_reads.dat", 'w')
		f.write("\n".join(map(str, Rn_data)))
		#print(Rn_data)
		'''fig = plt.figure()
		exp_plot = fig.add_subplot(211, title="Exponential")
		sig_plot = fig.add_subplot(212, title="Sigmoid")
		sig_plot.scatter(xdata, Rn_data)
		sig_plot.plot(xdata, sigmoid(xdata, *popt_sig), 'r-', label='fit')


		exp_plot.scatter(xdata, Rn_data)
		exp_plot.plot(xdata, exponential(xdata, *popt_exp), 'r-', label='fit')

		plt.show()'''
	return (AIC_exp < AIC_sig)

for i in range(45, 0, -1):
	is_exp_AIC_smaller = compare_AIC(i)
	if (is_exp_AIC_smaller):
		print("Smaller at cycle ", i)
		break
		