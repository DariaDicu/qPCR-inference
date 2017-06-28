# The code used to extract the fluorescence reads corresponding to the 
# exponential phase. It produces a file "fluorescence_reads.dat" containing the
# exponential phase reads from a single well.
# The inference code opens "fluorescence_reads.dat" for training data.
# The qPCR well and qPCR data file are hardcoded below.
# Each experiment has a different data file (10-3-17.txt)

# The algorithm progressively discards the last read from the fluorescence curve
# and compares the AIC of an exponential model vs. sigmoid model. When the
# exponential model is a better fit, the algorithm stops.
import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re

# The id of the well corresponding to a single qPCR amplification curve.
wanted_well = 253
# The experiment data file, as extracted from the qPCR analysis tool (Windows).
file_obj = open("experimental_data/10-3-17.txt", "r")
lines = file_obj.readlines()
lines = lines[2:] # Discard the header containing column names.

# Exponential model from Goll et al., 2006.
def sigmoid(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb

def exponential(C, a, b, c):
	return a*np.exp(b*C) + c

# Compare AIC for sigmoid vs. exponential by considering the first i cycles.
def compare_AIC(i):
	Rn_data = []
	# Look through all rows in the experiment data file.
	for line in lines:
		# Get well id of current data row.
		well = re.split(r'\t+', line)[0]
		if (int(well) == wanted_well):
			singlecell_data = re.split(r'\t+', line)
			# Columns 2-46 correspond to non-background-corrected fluorescence
			# and 47-91 correspond to background-corrected fluorescence.
			Rn_data = list(map(lambda val: float(val), singlecell_data[47:92]))

	Rn_data = Rn_data[:i]
	xdata = range(1, i+1)
	popt_sig, pcov_sig = curve_fit(sigmoid, xdata, Rn_data, maxfev=100000)
	popt_exp, pcov_exp = curve_fit(exponential, xdata, Rn_data, maxfev=100000)

	Fmax = popt_sig[0]
	Chalf = popt_sig[1]
	k = popt_sig[2]
	Fb = popt_sig[3]

	rss_exp = np.sum(np.array(Rn_data - exponential(xdata, *popt_exp))**2)
	#print(rss_exp)
	rss_sig = np.sum(np.array(Rn_data - sigmoid(xdata, *popt_sig))**2)
	#print(rss_sig)

	AIC_exp = 2*3 + i*np.log(rss_exp/i)
	AIC_sig = 2*4 + i*np.log(rss_sig/i)
	
	if (AIC_exp < AIC_sig):
		f = open("inference_data/fluorescence_reads.dat", 'w')
		f.write("\n".join(map(str, Rn_data)))

		'''
		# Plot the two models.
		fig = plt.figure()
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
		