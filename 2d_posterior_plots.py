import numpy as np
from matplotlib import pyplot as plt
import scipy.stats as st
from scipy.stats import gaussian_kde

# Fixed x0 for single experiment. TODO: put in .dat file.
x0 = 20

# theta = [alpha p sigma]
file_obj = open("saved_data/posterior_samples_10_3_17_different_alphas.dat",
	"r")
lines = file_obj.readlines()

theta_values = []
for line in lines:
	theta = line.split()
	if (theta[0] == "MAP"):
		# Extract the line containing the theta MAP.
		theta_map = list(map(lambda theta_i: float(theta_i), theta[1:]))
		# STOP SINCE ONLY TAKING FIRST PARAMS.
		break
	parsed_theta = list(map(lambda theta_i: float(theta_i), theta))
	theta_values.append(parsed_theta)

theta_values = np.array(theta_values)
x = theta_values[:, 0]
y = theta_values[:, 1]


xmin, xmax = np.min(x), np.max(x)
ymin, ymax = np.min(y), np.max(y)

# Peform the kernel density estimate
xx, yy = np.mgrid[xmin:xmax:100j, ymin:ymax:100j]
positions = np.vstack([xx.ravel(), yy.ravel()])
values = np.vstack([x, y])
kernel = st.gaussian_kde(values)
f = np.reshape(kernel(positions).T, xx.shape)

fig = plt.figure()
ax = fig.gca()
ax.set_xlim(xmin, xmax)
ax.set_ylim(ymin, ymax)
# Contourf plot
cfset = ax.contourf(xx, yy, f, cmap='Blues')
## Or kernel density estimate plot instead of the contourf plot
#ax.imshow(np.rot90(f), cmap='Blues', extent=[xmin, xmax, ymin, ymax])
# Contour plot
cset = ax.contour(xx, yy, f, colors='k')
# Label plot
#ax.clabel(cset, inline=1, fontsize=10)
ax.set_xlabel('X0')
ax.set_ylabel('p')

plt.show()