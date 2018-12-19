set xlabel "Number-of-clients"
set ylabel "Memory-Usage (MBytes/sec)"
set grid
set xtics 2
set xrange [0:20]
f(x) = a*x*x+b*x+c
a=1
b=1
c=1
fit f(x) "total.txt" using 1:2 via a,b,c
plot "total.txt" using 1:2:3:4 notitle with errorbar lc "red" pt 3, "total.txt" using 1:2 notitle with lines lc "red"
plot f(x), "total.txt" using 1:2 notitle
set terminal postscript enhanced color
set output "Memory-Usage.eps"
replot
