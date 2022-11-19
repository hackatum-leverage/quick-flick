import json

def copyEntity(_entity):
    returnJson = {
        "id": _entity['id'],
        "available": _entity['available'],
        "tmdb": _entity['tmdb'],
        "tvdb": _entity['tvdb'],
        "imdb_id": _entity['imdb_id'],
        "imdb_episode_id": _entity['imdb_episode_id'],
        "title": _entity['title'],
        "otitle": _entity['otitle'],
        "original": _entity['original'],
        "serie": _entity['serie'], 
        "season": _entity['season'], 
        "episode": _entity['episode'],
        "episodetitle": _entity['episodetitle'],
        "oepisodetitle": _entity['oepisodetitle'],
        "year": _entity['year'],
        "directors": _entity['directors'],
        "actors": _entity['actors'],
        "companies": _entity['companies'],
        "countries": _entity['countries'],
        "genres": _entity['genres'],
        "channel": _entity['channel'],
        "airtime": _entity['airtime'],
        "banners": _entity['banners'],
        "posters": _entity['posters'],
        "pid": _entity['pid'],
        "provider": {
            "netflix": "0",
            "apple": "0",
            "disney": "0",
            "rtl": "0",
        },
        "url": _entity['url'],
        "seasonurl": _entity['seasonurl'],
        "episodeurl": _entity['episodeurl'],
        "type": _entity['type'],
        "ditribution": _entity['distribution'],
        "price": _entity['price'],
        "publication": _entity['publication'],
        "resolution": _entity['resolution'],
        "stereoscopic": _entity['stereoscopic'],
        "language": _entity['language'],
        "subtitles": _entity['subtitles'],
        "audio": _entity['audio'],
        "runtime": _entity['runtime'],
        "fsk": _entity['fsk'],
        "added": _entity['added'],
        "modifed": _entity['modified'],
        "timestamp": _entity['timestamp'],
        "expires": _entity['expires']
    }

    return returnJson

#dataFile1 = open('streampicker/ap.json')
#dataFile2 = open('streampicker/nf.json')
#dataFile3 = open('streampicker/dp.json')
#dataFile4 = open('streampicker/tn.json')

#dataFile1 = open('JSON_files/newAppleList.json')
#dataFile2 = open('JSON_files/newNetflixList.json')
#dataFile3 = open('JSON_files/newDisneyList.json')
dataFile4 = open('JSON_files/newRTLList.json')

#dataFile1 = open('imdbApple.json')
#dataFile2 = open('imdbNetflix.json')
#dataFile3 = open('imdbDisney.json')
#dataFile4 = open('imdbRTL.json')


"""movieListAP = [
    {
        "id": "0",
        "available": "0",
        "tmdb": "0",
        "tvdb": "0",
        "imdb_id": "123456",
        "imdb_episode_id": "0",
        "title": "0",
        "otitle": "0",
        "original": "0",
        "serie": "0", 
        "season": "0", 
        "episode": "0",
        "episodetitle": "0",
        "oepisodetitle": "0",
        "year": "0",
        "directors": "djsa",
        "actors": "jkdsb",
        "companies": "kdbsk",
        "countries": "jkjds",
        "genres": "kjds",
        "channel": "0",
        "airtime": "0",
        "banners": "jdsk",
        "posters": "kjfds",
        "pid": "",
        "provider": "0",
        "url": "0",
        "seasonurl": "0",
        "episodeurl": "0",
        "type": "0",
        "distribution": "0",
        "price": "0",
        "publication": "0",
        "resolution": "0",
        "stereoscopic": "0",
        "language": "0",
        "subtitles": "0",
        "audio": "0",
        "runtime": "0",
        "fsk": "0",
        "added": "0",
        "modified": "0",
        "timestamp": "0",
        "expires": "0"
    },
    {
        "id": "0",
        "available": "0",
        "tmdb": "0",
        "tvdb": "0",
        "imdb_id": "1234567",
        "imdb_episode_id": "0",
        "title": "0",
        "otitle": "0",
        "original": "0",
        "serie": "0", 
        "season": "0", 
        "episode": "0",
        "episodetitle": "0",
        "oepisodetitle": "0",
        "year": "0",
        "directors": "djsa",
        "actors": "jkdsb",
        "companies": "kdbsk",
        "countries": "jkjds",
        "genres": "kjds",
        "channel": "0",
        "airtime": "0",
        "banners": "jdsk",
        "posters": "kjfds",
        "pid": "",
        "provider": "0",
        "url": "0",
        "seasonurl": "0",
        "episodeurl": "0",
        "type": "0",
        "distribution": "0",
        "price": "0",
        "publication": "0",
        "resolution": "0",
        "stereoscopic": "0",
        "language": "0",
        "subtitles": "0",
        "audio": "0",
        "runtime": "0",
        "fsk": "0",
        "added": "0",
        "modified": "0",
        "timestamp": "0",
        "expires": "0"
    },
    {
        "id": "0",
        "available": "0",
        "tmdb": "0",
        "tvdb": "0",
        "imdb_id": "1234568",
        "imdb_episode_id": "0",
        "title": "0",
        "otitle": "0",
        "original": "0",
        "serie": "0", 
        "season": "0", 
        "episode": "0",
        "episodetitle": "0",
        "oepisodetitle": "0",
        "year": "0",
        "directors": "djsa",
        "actors": "jkdsb",
        "companies": "kdbsk",
        "countries": "jkjds",
        "genres": "kjds",
        "channel": "0",
        "airtime": "0",
        "banners": "jdsk",
        "posters": "kjfds",
        "pid": "",
        "provider": "0",
        "url": "0",
        "seasonurl": "0",
        "episodeurl": "0",
        "type": "0",
        "distribution": "0",
        "price": "0",
        "publication": "0",
        "resolution": "0",
        "stereoscopic": "0",
        "language": "0",
        "subtitles": "0",
        "audio": "0",
        "runtime": "0",
        "fsk": "0",
        "added": "0",
        "modified": "0",
        "timestamp": "0",
        "expires": "0"
    },
]

movieListNF = [
    {
        "id": "0",
        "available": "0",
        "tmdb": "0",
        "tvdb": "0",
        "imdb_id": "123456",
        "imdb_episode_id": "0",
        "title": "0",
        "otitle": "0",
        "original": "0",
        "serie": "0", 
        "season": "0", 
        "episode": "0",
        "episodetitle": "0",
        "oepisodetitle": "0",
        "year": "0",
        "directors": "djsa",
        "actors": "jkdsb",
        "companies": "kdbsk",
        "countries": "jkjds",
        "genres": "kjds",
        "channel": "0",
        "airtime": "0",
        "banners": "jdsk",
        "posters": "kjfds",
        "pid": "",
        "provider": "0",
        "url": "0",
        "seasonurl": "0",
        "episodeurl": "0",
        "type": "0",
        "distribution": "0",
        "price": "0",
        "publication": "0",
        "resolution": "0",
        "stereoscopic": "0",
        "language": "0",
        "subtitles": "0",
        "audio": "0",
        "runtime": "0",
        "fsk": "0",
        "added": "0",
        "modified": "0",
        "timestamp": "0",
        "expires": "0"
    },
    {
        "id": "0",
        "available": "0",
        "tmdb": "0",
        "tvdb": "0",
        "imdb_id": "1234561",
        "imdb_episode_id": "0",
        "title": "0",
        "otitle": "0",
        "original": "0",
        "serie": "0", 
        "season": "0", 
        "episode": "0",
        "episodetitle": "0",
        "oepisodetitle": "0",
        "year": "0",
        "directors": "djsa",
        "actors": "jkdsb",
        "companies": "kdbsk",
        "countries": "jkjds",
        "genres": "kjds",
        "channel": "0",
        "airtime": "0",
        "banners": "jdsk",
        "posters": "kjfds",
        "pid": "",
        "provider": "0",
        "url": "0",
        "seasonurl": "0",
        "episodeurl": "0",
        "type": "0",
        "distribution": "0",
        "price": "0",
        "publication": "0",
        "resolution": "0",
        "stereoscopic": "0",
        "language": "0",
        "subtitles": "0",
        "audio": "0",
        "runtime": "0",
        "fsk": "0",
        "added": "0",
        "modified": "0",
        "timestamp": "0",
        "expires": "0"
    },
]"""

#movieListAP = json.load(dataFile1)
#print("Finished loading apple")
#movieListNF = json.load(dataFile2)
#print("Finished loading netflix")
#movieListDP = json.load(dataFile3)
#print("Finished loading disney")
#movieListTN = json.load(dataFile4)
#print("Finished loading rtl")

imdbIDList = []
outputList = []

print("Start matching...")

"""
# Create unique elements 
tmpAlreadyExisting = []
for movieIdx in range(0, len(movieListTN)):
    if movieListTN[movieIdx]['imdb_id'] not in imdbIDList:
        imdbIDList.append(movieListTN[movieIdx]['imdb_id'])
        outputList.append(movieListTN[movieIdx])

with open('rtlShort.json', 'w') as f:
    json.dump(outputList, f)

"""


"""
# Function to merge all four imdb list together
mergedList = list(set(movieListAP + movieListNF + movieListDP + movieListTN))

with open('mergedIMDB.json', 'w') as f:
    json.dump(mergedList, f)
"""


"""
# Just take single imdb_id of every film or series
for movieIdxTN in range(0, len(movieListTN)):
    if movieListTN[movieIdxTN]['imdb_id'] not in imdbIDList:
        imdbIDList.append(movieListTN[movieIdxTN]['imdb_id'])

        # Save imdb list
        with open('imdbRTL.json', 'w') as f:
            json.dump(imdbIDList, f)
"""





# Check imdb for apple
"""for movieIdxAP in range(0, len(movieListAP)):
    counter = counter + 1
    if not counter % 10000:
        print("Data processed: ", counter)

    # Check in netflix data
    for movieIdxNF in range(0, len(movieListNF)):
        if movieListNF[movieIdxNF]['imdb_id'] == movieListAP[movieIdxAP]['imdb_id']:
            # This is a matching movie
            found = True
            foundIdx = movieIdxNF
            break

    if found == False:
        # No Match found - add netflix film
        if movieListNF[foundIdx]['imdb_id'] not in entityAlrInside:
            outputJson = copyEntity(movieListNF[foundIdx])
            outputJson['provider']['netflix'] = 1
            outputJson['provider']['apple'] = 0

            # Add entity from just netflix
            finalJson.append(outputJson)
            entityAlrInside.append(movieListNF[foundIdx]['imdb_id'])
            

        outputJson = copyEntity(movieListAP[movieIdxAP])
        outputJson['provider']['netflix'] = "0"
        outputJson['provider']['apple'] = "1"

        # Add entity from just apple
        finalJson.append(outputJson)


    if found == True:
        outputJson = copyEntity(movieListAP[movieIdxAP])
        outputJson['provider']['netflix'] = "1"
        outputJson['provider']['apple'] = "1"

        # Add entity to final json
        finalJson.append(outputJson)
        
        found = False

"""

# Extract the movies and series with valid imdb_id and imdb_episode_id
"""
for movieIdx in range(0, len(movieListAP)):
    if movieListAP[movieIdx]['imdb_id'] is not None and movieListAP[movieIdx]['imdb_episode_id'] is not None:
        newList.append(movieListAP[movieIdx])


for movieIdx in range(0, len(movieListNF)):
    if movieListNF[movieIdx]['imdb_id'] is not None and movieListNF[movieIdx]['imdb_episode_id']:
        newList.append(movieListNF[movieIdx])


for movieIdx in range(0, len(movieListDP)):
    if movieListDP[movieIdx]['imdb_id'] is not None and movieListDP[movieIdx]['imdb_episode_id']:
        newList.append(movieListDP[movieIdx])


# Clean data from RTL by checking for valid imdb_id and imdb_episode_id
for movieIdx in range(0, len(movieListTN)):
    if movieListTN[movieIdx]['imdb_id'] is not None and movieListTN[movieIdx]['imdb_episode_id']:
        newList.append(movieListTN[movieIdx])

# Save imdb list
with open('newRTLList.json', 'w') as f:
    json.dump(newList, f)

"""



    






    