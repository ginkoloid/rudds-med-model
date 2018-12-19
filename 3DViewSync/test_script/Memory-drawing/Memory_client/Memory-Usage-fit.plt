set xlabel "Number-of-clients"
set ylabel "Memory-Usage (MBytes/sec)"
set grid
set xtics 2
f(x)=a*x*x*x*x+b*x*x*x+c*x*x+d*x+e
#f(x)=a/(1+b*x*x)
#f(x)=1/a*exp(b*x)
#f(x)=a*x*x+b*x+c
#f(x)=x**a*exp(b)+c
a=1
b=1
c=1
d=1
e=3500
fit f(x) "total.txt" using 1:2 via a,b,c,d,e
#fit f(x) "total.txt" using 1:2 via a,b,c
#fit f(x) "total.txt" using 1:2 via a,b
plot "total.txt" using 1:2:3:4 notitle with errorbar lc "red" pt 3, "total.txt" using 1:2 notitle with lines lc "red",
plot f(x), "total.txt" using 1:2 notitle
set terminal postscript enhanced color
set output "Memory-Usage-Client-fit2.eps"
replot
