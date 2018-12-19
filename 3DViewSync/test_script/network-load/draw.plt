set xlabel "Number-of-clients"
set ylabel "Network load (Bytes/s)"
set xtics 2
set xrange[2:20]
set grid
plot "total_network_load.txt" using 1:2:3:4 title "Bytes received" with errorbar lc "red" pt 3, "total_network_load.txt" using 1:2 notitle with lines lc "red", "total_network_load.txt" using 1:5:6:7 title "Bytes sent" with errorbar lc "blue" pt 4, "total_network_load.txt" using 1:5 notitle with lines lc "blue"
set terminal postscript enhanced color
set output "Network_load.eps"
replot
