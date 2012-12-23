import fitbit
import io,json

z = fitbit.FitBit()

auth_url, auth_token = z.GetRequestToken()

auth_url

access_token = z.GetAccessToken(<oauth verifier>, auth_token)

#get user info
response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/profile.json')

with io.open('user_info.json', 'wb', encoding='utf-8') as outfile:
  json.dump(data, outfile)

response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/profile.json')

#get steps
response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/steps/date/2010-07-26/2012-11-27.json')

with io.open('steps.json', 'wb') as outfile:
  json.dump(response, outfile)

#get distance 
response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/distance/date/2010-07-26/2012-11-27.json')

with io.open('distance.json', 'wb') as outfile:
  json.dump(response, outfile)

#get clories
response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/calories/date/2010-07-26/2012-11-27.json')

with io.open('calories.json', 'wb') as outfile:
  json.dump(response, outfile)

#get floors
response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/floors/date/2010-07-26/2012-11-27.json')

with io.open('floors.json', 'wb') as outfile:
  json.dump(response, outfile)

#get elevation
response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/elevation/date/2010-07-26/2012-11-27.json')

with io.open('elevation.json', 'wb') as outfile:
  json.dump(response, outfile)

response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/minutesSedentary/date/2010-07-26/2012-11-27.json')

with io.open('sedentary.json', 'wb') as outfile:
  json.dump(response, outfile)

response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/minutesLightlyActive/date/2010-07-26/2012-11-27.json')

with io.open('lighly.json', 'wb') as outfile:
  json.dump(response, outfile)


response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/minutesFairlyActive/date/2010-07-26/2012-11-27.json')

with io.open('fairly.json', 'wb') as outfile:
  json.dump(response, outfile)


response = z.ApiCall(access_token, apiCall='/1/user/22DD3P/activities/minutesVeryActive/date/2010-07-26/2012-11-27.json')

with io.open('very.json', 'wb') as outfile:
  json.dump(response, outfile)












