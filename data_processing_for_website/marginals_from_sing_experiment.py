# Also perform thinning by 10 (since assuming we are working on 1000000
# sample files).
import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
import json

file_obj = open("saved_data/253-10317-single-and-joint/qpcr_posterior_samples.dat", "r")
lines = file_obj.readlines()

cnt = 0
x0_samples = []
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
	x0_samples.append(parsed_theta[0])
	p_samples.append(parsed_theta[1])
	sigma_samples.append(parsed_theta[2])


json_outfile = open("website/single_inf_all_marginals.json", "w")
json_obj = dict([('x0', x0_samples),
	('p', p_samples), 
	('sigma', sigma_samples)])
r = json.dumps(json_obj)
json_outfile.write(r)
