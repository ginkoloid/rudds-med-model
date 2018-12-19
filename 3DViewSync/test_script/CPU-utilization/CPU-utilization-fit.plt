set xlabel "Number-of-clients"
set ylabel "CPU-utilization (%)"
set grid
set xtics 2
set ytics 1
#f(x)=a*log10(x)+b
f(x)=a*x+b
a=1.1
b=4.4
c=1
fit f(x) "total.txt" using 1:2 via a,b
plot "total.txt" using 1:2:3:4 notitle with errorbar lc "red" pt 3, "total.txt" using 1:2 notitle with lines lc "red"
plot f(x), "total.txt" using 1:2 notitle
set terminal postscript enhanced color
set output "CPU-utilization-fit.eps"
replot
