# Also perform thinning by 10 (since assuming we are working on 1000000
# sample files).
import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
import json

file_obj = open("saved_data/253-10317-single-and-joint/qpcr_joint_posterior_samples_10-5runs_3params.dat", "r")
lines = file_obj.readlines()

cnt = 0
x01_p_samples = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		break
	cnt += 1
	if (cnt % 10 != 0):
		continue
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	x01_p_pair_list = [parsed_theta[0], parsed_theta[len(parsed_theta)-2]]
	x01_p_samples.append(x01_p_pair_list)

json_outfile = open("website/x01_p_joint_10_3_17.json", "w")
json.dump(x01_p_samples, json_outfile)