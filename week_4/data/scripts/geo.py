import csv

f = open('geo.csv', 'r')

lines = f.readlines()

del lines[0]


csvwriter = csv.writer(open('newgeo.csv', "w"))
csvwriter.writerow(["lat", "lon"])
for line in lines:
	line = line.split(',')
	# del line[0]
	newrow = [line[1], line[2][:-1]] 
	print newrow
	csvwriter.writerow(newrow)


