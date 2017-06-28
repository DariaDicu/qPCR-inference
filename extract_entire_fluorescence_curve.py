# Code for extracting the entire fluorescence curve for a single well from a
# data file.
# Should not be used for inference, since it does not extract the exponential
# phase only! Use exponential_phase_extraction_single_experiment.py instead.
import numpy as np
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import re

wanted_well = 253

def F(C, Fmax, Chalf, k, Fb):
	return (Fmax/(1+np.exp(-(C - Chalf)/k))) + Fb 
fig = plt.figure()
#Rn_plot = fig.add_subplot(211, title="Rn amplification plot")
Rn_plot = fig.add_subplot(111, title="Alpha values")

file_obj = open("experimental_data/10-3-17.txt", "r")
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