# Also perform thinning by 10 (since assuming we are working on 1000000
# sample files).
import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
import json

from statsmodels.tsa.stattools import acf, pacf

file_obj = open("saved_data/253-10317-single-and-joint/qpcr_joint_posterior_samples_10-5runs_3params.dat", "r")
lines = file_obj.readlines()

cnt = 0
x01_samples = []
x02_samples = []
x03_samples = []
p_samples = []
sigma_samples = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		break
	cnt += 1
	if (cnt % 10 != 0):
		continue
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	x01_samples.append(parsed_theta[0])
	x02_samples.append(parsed_theta[1])
	x03_samples.append(parsed_theta[2])
	p_samples.append(parsed_theta[3])
	sigma_samples.append(parsed_theta[4])


acf1 = acf(x01_samples)
acf2 = acf(p_samples)
acf3 = acf(sigma_samples)


fig = plt.figure()
acf_x0 = fig.add_subplot(221, title="x0 acf")
acf_p = fig.add_subplot(222, title="p acf")
acf_sigma = fig.add_subplot(223, title="sigma acf")
acf_x0.plot(acf1)
acf_p.plot(acf2)
acf_sigma.plot(acf3)
plt.show()

json_outfile = open("website/acf_data.json", "w")

json_obj = dict([('x01_acf', acf1.tolist()),
	('p_acf', acf2.tolist()),
	('sigma_acf', acf3.tolist())])
r = json.dumps(json_obj)
json_outfile.write(r)