set xlabel "Number-of-clients"
set ylabel "CPU-utilization (%)"
set grid
set xtics 2
set ytics 1
plot "total.txt" using 1:2:3:4 notitle with errorbar lc "red" pt 3, "total.txt" using 1:2 notitle with lines lc "red"
set terminal postscript enhanced color
set output "CPU-utilization.eps"
replot
