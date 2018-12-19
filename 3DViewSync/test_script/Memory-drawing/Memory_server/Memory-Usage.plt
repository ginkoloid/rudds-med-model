set xlabel "Number-of-clients"
set ylabel "Memory-Usage (MBytes/sec)"
set grid
set xtics 2
plot "total.txt" using 1:2:3:4 notitle with errorbar lc "red" pt 3, "total.txt" using 1:2 notitle with lines lc "red"
set terminal postscript enhanced color
set output "Memory-Usage.eps"
replot
