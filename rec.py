import sys
import matplotlib.pyplot as plt
import numpy as np
import pickle
import network

img_id = sys.argv[1]
img = plt.imread('tmp/%s.png' % (img_id))

img_matrix = []
for i in range(28):
	sub = []
	for j in range(28):
		raw = img[i][j][0]
		if raw > 0.99 and (raw - 0.99) <= 0.01:
			raw = 1.0
		out = []
		out.append(1.0 - raw)
		sub.append(out)
	img_matrix.append(sub)

img_matrix = np.reshape(img_matrix, (784, 1))

with open('net.pkl', 'rb') as pkl:
	net = pickle.load(pkl)

out = np.argmax(net.feedforward(img_matrix))
print(out)