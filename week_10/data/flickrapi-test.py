import flickrapi, io, json

api_key = '8096b4a55b76947f85e58c8135e9e681'
api_secret = '064ace20a3bacd41'

flickr = flickrapi.FlickrAPI(api_key, api_secret)
photos = flickr.people.getPublicPhotos(user_id='88182970@N08', per_page='10', format='json')

# with io.open('food.json', 'wb') as outfile:
# 	json.dump(photos, outfile)
print photos