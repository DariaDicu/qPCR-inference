# Also perform thinning by 10 (since assuming we are working on 1000000
# sample files).
import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
import json

# Fixed x0 for single experiment. TODO: put in .dat file.
#x0 = 20

# theta = [alpha p sigma]
file_obj = open("saved_data/253-10317-single-and-joint/qpcr_joint_posterior_samples_alphas.dat", "r")
lines = file_obj.readlines()

cnt = 0
all_alphas_x01_samples = []
all_alphas_p_samples = []
all_alphas_sigma_samples = []

x01_samples = []
p_samples = []
sigma_samples = []

for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		all_alphas_x01_samples.append(x01_samples)
		all_alphas_p_samples.append(p_samples)
		all_alphas_sigma_samples.append(sigma_samples)
		x01_samples = []
		p_samples = []
		sigma_samples = []
		continue
	cnt += 1
	if (cnt % 10 != 0):
		continue
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	x01_samples.append(parsed_theta[0])
	p_samples.append(parsed_theta[1])
	sigma_samples.append(parsed_theta[2])

json_outfile = open("website/different_alphas_inference.json", "w")

json_obj = dict([('x01', all_alphas_x01_samples),
	('p', all_alphas_p_samples), 
	('sigma', all_alphas_sigma_samples)])
r = json.dumps(json_obj)
json_outfile.write(r)