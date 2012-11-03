import csv
import httplib
import requests

# hidf = open('hdi.csv', 'r')	

# lines = hidf.readlines()

# for line in lines:
# 	line = line.split(',')
# 	# r = requests.get('http://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false' % line[1].encode('utf8'))
# 	print line[1].encode('utf8')

hdi = open('hdi.csv','r')
geo = open('newgeo.csv', 'r')

hdilines = hdi.readlines()
geolines = geo.readlines()

# geolines = geo.readlines()

for idx, line in enumerate(hdilines):
	# newline = hdilines[idx] + ',' + line
	line = line.split(',')
	print line
	 
