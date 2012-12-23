import zeoapi
import io,json

z = zeoapi.Api()

z.username = 'pdarche@gmail.com'
z.password = 'Morgortbort1'
z.apikey = '2A4AAD3C9099FAC17408661BB10F909F'
z.referrer = 'http://peterdarche.com'

#get all dates with sleep data
dates = z.getAllDatesWithSleepData()

history = []

for date in dates:
	requestDate = str(date["year"]) + '-' + str(date["month"]) + '-' + str(date["day"])
	data = z.getSleepRecordForDate(date=requestDate)
	print data
	history.append(data)

final = {"sleepData" : history}
with io.open('sleep.json', 'wb') as outfile:
		json.dump(final, outfile)




