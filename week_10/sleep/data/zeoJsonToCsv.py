#!/usr/bin/python

import json 
import csv
import datetime
import time     
import sys   

# infilename = sys.argv[1]  
# tofilename = sys.argv[2]

infile = open('sleep.json', "r") # Open up the file.  "r" says we want to read from it (as opposed to write)
data = json.loads(infile.read())
finalData = data['sleepData']

csvwriter = csv.writer(open('sleep.csv', "w"))
csvwriter.writerow([ 
		"timeInDeepZqPoints", "startDate", "timeToZ", "awakeningsZqPoints", "dayFeel", "alarmRingIndex", "morningFeel", 
		"timeInWakePercentage", "wakeWindowEndIndex", "alarmReason", "totalZ", "timeInWakeZqPoints", "riseTime", 
		"timeInRemZqPoints", "timeInLight", "timeInDeep", "wakeWindowShow", "timeInWake", "sleepStealerScore", 
		"timeInRem", "totalZZqPoints", "timeInRemPercentage", "sleepGraphStartTime", "awakenings", 
		"timeInDeepPercentage", "wakeWindowStartIndex", "bedTime", "timeInLightPercentage", "grouping"
		])

for obj in finalData:
	timeInDeepZqPoints = obj["timeInDeepZqPoints"]
	startDate = str(obj["startDate"]["year"]) + '-' + str(obj["startDate"]["month"]) + '-' + str(obj["startDate"]["day"])
	timeToZ = obj["timeToZ"]
	awakeningsZqPoints = obj["awakeningsZqPoints"]
	dayFeel = obj["dayFeel"]
	alarmRingIndex = obj["alarmRingIndex"]
	morningFeel = obj["morningFeel"]
	timeInWakePercentage = obj["timeInWakePercentage"]
	wakeWindowEndIndex = obj["wakeWindowEndIndex"]
	alarmReason = obj["alarmReason"]
	totalZ = obj["totalZ"]
	timeInWakeZqPoints = obj["timeInWakeZqPoints"]
	riseTime = datetime.datetime(
					obj["riseTime"]["year"], obj["riseTime"]["month"], 
					obj["riseTime"]["day"], obj["riseTime"]["hour"], 
					obj["riseTime"]["minute"], obj["riseTime"]["second"]  
				)
	timeInRemZqPoints = obj["timeInRemZqPoints"]
	timeInLight = obj["timeInLight"]
	timeInDeep = obj["timeInDeep"]
	wakeWindowShow = obj["wakeWindowShow"]
	timeInWake = obj["timeInWake"]
	sleepStealerScore = obj["sleepStealerScore"]
	timeInRem = obj["timeInRem"]
	totalZZqPoints = obj["totalZZqPoints"]
	timeInRemPercentage = obj["timeInRemPercentage"]
	sleepGraphStartTime = datetime.datetime(
					obj["sleepGraphStartTime"]["year"], obj["sleepGraphStartTime"]["month"], 
					obj["sleepGraphStartTime"]["day"], obj["sleepGraphStartTime"]["hour"], 
					obj["sleepGraphStartTime"]["minute"], obj["sleepGraphStartTime"]["second"]  
				)
	awakenings = obj["awakenings"]
	timeInDeepPercentage = obj["timeInDeepPercentage"]
	wakeWindowStartIndex = obj["wakeWindowStartIndex"]
	bedTime = datetime.datetime(
					obj["bedTime"]["year"], obj["bedTime"]["month"], 
					obj["bedTime"]["day"], obj["bedTime"]["hour"], 
					obj["bedTime"]["minute"], obj["bedTime"]["second"]  
				)
	timeInLightPercentage = obj["timeInLightPercentage"]
	grouping = obj["grouping"]

	newrow = [ 
			timeInDeepZqPoints, startDate, timeToZ, awakeningsZqPoints, 
			dayFeel, alarmRingIndex, morningFeel, timeInWakePercentage, 
			wakeWindowEndIndex, alarmReason, totalZ, timeInWakeZqPoints, 
			riseTime, timeInRemZqPoints, timeInLight, timeInDeep, wakeWindowShow, 
			timeInWake, sleepStealerScore, timeInRem, totalZZqPoints, timeInRemPercentage, 
			sleepGraphStartTime, awakenings, timeInDeepPercentage, wakeWindowStartIndex,
			bedTime, timeInLightPercentage, grouping
		]

	csvwriter.writerow(newrow)




