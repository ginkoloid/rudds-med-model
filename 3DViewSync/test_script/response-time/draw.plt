set xlabel "Number-of-clients"
set ylabel "response-time (msec)"
set grid
set xtics 2
set ytics 0.1
plot "total.txt" using 1:2 notitle with lines lc "red"
set terminal postscript enhanced color
set output "response-time.eps"
replot
