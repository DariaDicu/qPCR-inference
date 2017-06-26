import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re
data = [-2.9843912, -3.500936, -3.0409336, -3.1643357, -2.7622252, -2.7776258, -2.375027, -2.4586647, -1.8583272, -1.587549, -1.2040541, -1.0458095, -1.2144692, -0.824642, -0.41247588, -0.48210606, -0.45844397, -0.21189678, 0.034055337, 0.041924562, -0.02901786, -0.15696712, -0.052326653, 0.28021908, -0.11332465, 0.061460465, 0.5802092, 0.3371324, 0.7466435, 2.1853447, 4.4825053, 9.235721, 17.086393, 32.21566, 55.45563, 84.45778, 113.788086, 140.14575, 159.53291, 173.48251, 182.1414, 189.41588, 195.12259, 200.0211, 205.79031]

def sigmoid(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb


def exponential(C, a, b, c):
	return a*np.exp(b*C) + c

def compare_AIC(i):
	Rn_data = data

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
	print("exponential ", *popt_exp)
	print("sigmoid ", *popt_sig)

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

compare_AIC(35)
		