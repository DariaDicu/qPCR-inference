# qPCR-inference
Data analysis project - modelling errors in qPCR using Bayesian inference

Command to run C code for inference:
```bash
# Compile and link to the GSL library (used for Cholesky decomposition).
gcc -Wall -c -I/usr/local/include inference.c | gcc -L /usr/local/lib -lgsl -lblas inference.c
# Run code (the argument is the seed for the random number generator).
./a.out 1 

```
