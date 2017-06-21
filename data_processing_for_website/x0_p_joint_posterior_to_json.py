# Also perform thinning by 10 (since assuming we are working on 1000000
# sample files).
import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
import json

# Fixed x0 for single experiment. TODO: put in .dat file.
#x0 = 20

# theta = [alpha p sigma]
file_obj = open("saved_data/253-10317-single-and-joint/qpcr_posterior_samples.dat", "r")
lines = file_obj.readlines()

cnt = 0
x0_p_samples = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		break

	cnt += 1
	if (cnt % 10 != 0):
		continue
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	x0_p_pair_list = [parsed_theta[0], parsed_theta[1]]
	x0_p_samples.append(x0_p_pair_list)

json_outfile = open("website/x0_p_joint_10_3_17.json", "w")
json.dump(x0_p_samples, json_outfile)