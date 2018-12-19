set xlabel "Number-of-clients"
set ylabel "Network load (Bytes/s)"
set xrange [2:20]
set yrange[0:60000]
set xtics 2
set grid
f(x)=a*x+b
a=1
b=1
c=1
d=1
fit f(x) "total_network_load.txt" using 1:2 via a,b
fit c*x+d "total_network_load.txt" using 1:5 via c,d
plot "total_network_load.txt" using 1:2:3:4 title "Bytes received" with errorbar lc "red" pt 3, "total_network_load.txt" using 1:2 notitle with lines lc "red", "total_network_load.txt" using 1:5:6:7 title "Bytes sent" with errorbar lc "blue" pt 4, "total_network_load.txt" using 1:5 notitle with lines lc "blue"
plot f(x) title "Bytes received", "total_network_load.txt" using 1:2 notitle , c*x+d title "Bytes sent", "total_network_load.txt" using 1:5 notitle
set terminal postscript enhanced color
set output "Network_load-fit.eps"
replot
