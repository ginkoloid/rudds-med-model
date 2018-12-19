set xlabel "Number-of-clients"
set ylabel "CPU-utilization (%)"
set grid
set xtics 2
set ytics 1
set xrange[2:20]
set yrange[0:3]
f(x) = a*x*x*x*x + b*x*x*x + c*x*x + d*x + e
a=1
b=1
c=1
d=1
e=1
fit f(x) "total.txt" using 1:2 via a,b,c,d,e
plot "total.txt" using 1:2:3:4 notitle with errorbar lc "red" pt 3, "total.txt" using 1:2 notitle with lines lc "red"
#plot f(x), "total.txt" using 1:2 notitle
set terminal postscript enhanced color
set output "CPU-utilization.eps"
replot
