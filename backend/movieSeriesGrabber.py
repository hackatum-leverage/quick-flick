import random
import mongo
import urllib.request, json

mdb_url = "https://api.themoviedb.org/3/"
mdb_key = "5df139106aa0fb2f1b015f82b6bf0a7a"

# Uses discover api as first suggestion and then selects next recommendation
def getRandomDiscoverMovie():
    tmdbList = []
    votingList = []

    randomNumber = random.randint(1, 10)
    randomNumber2 = randomNumber + 1

    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&sort_by=popularity.desc" + "&page=" + str(randomNumber)) as url:
        req = json.loads(url.read().decode())
        movieList = req['results']

    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&sort_by=popularity.desc" + "&page=" + str(randomNumber2)) as url:
        req = json.loads(url.read().decode())
        movieList2 = req['results']

        # just extract ids
        for movie in movieList:
            tmdbList.append(str(movie['id']))
            votingList.append(str(movie['vote_average']))
        for movie in movieList2:
            tmdbList.append(str(movie['id']))
            votingList.append(str(movie['vote_average']))

        return (tmdbList, votingList)

    return -1

# Get trending movies
def getPopularMovies():
    tmdbList = []
    votingList = []

    randomNumber = random.randint(1, 5)

    with urllib.request.urlopen(mdb_url + "movie/" + "popular/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&page=" + str(randomNumber)) as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        # just extract ids
        for movie in movieRecommendationList:
            tmdbList.append(str(movie['id']))
            votingList.append(str(movie['vote_average']))

        return (tmdbList, votingList)

def getHiddenGemMovie():
    tmdbList = []
    votingList = []

    randomNumber = random.randint(1, 5)
    
    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&sort_by=popularity.desc" + "&page=" + str(randomNumber) + "&release_date.lte=2009-12-31") as url:
        req = json.loads(url.read().decode())
        movieList = req['results']

        # just extract ids
        for movie in movieList:
            tmdbList.append(str(movie['id']))
            votingList.append(str(movie['vote_average']))

        return (tmdbList, votingList)

# Call to get first Discovery movie and afterwards four more suggestions with same topic
def getMovies():
    movieList = []

    discoveryList, votingList = getRandomDiscoverMovie()
    liste = mongo.check_list(discoveryList)
    
    cleanedList = []
    tmdbList = []
    for element in liste:
        if element['tmdb'] not in tmdbList:
            cleanedList.append(element)
            tmdbList.append(element['tmdb'])

    liste = cleanedList

    idx = list(range(0, len(liste)))
    random.shuffle(idx)

    # TODO: check size

    movieList.append(liste[idx[0]])
    movieList.append(liste[idx[1]])
    movieList.append(liste[idx[2]])

    # Get rating for data
    movieList[0]['rating'] = votingList[discoveryList.index(movieList[0]['tmdb'])]
    movieList[1]['rating'] = votingList[discoveryList.index(movieList[1]['tmdb'])]
    movieList[2]['rating'] = votingList[discoveryList.index(movieList[2]['tmdb'])]

    popularList, votingList = getPopularMovies()
    liste = mongo.check_list(popularList)

    # delete current movie list elemets out of list
    liste = [num for num in liste if num != movieList[0]['tmdb']]
    liste = [num for num in liste if num != movieList[1]['tmdb']]
    liste = [num for num in liste if num != movieList[2]['tmdb']]

    idx = list(range(0, len(liste)))
    random.shuffle(idx)

    # TODO: check size

    movieList.append(liste[idx[0]])
    movieList[3]['rating'] = votingList[popularList.index(movieList[3]['tmdb'])]

    gemList, votingList = getHiddenGemMovie()
    liste = mongo.check_list(gemList)

    liste = [num for num in liste if num != movieList[0]['tmdb']]
    liste = [num for num in liste if num != movieList[1]['tmdb']]
    liste = [num for num in liste if num != movieList[2]['tmdb']]
    liste = [num for num in liste if num != movieList[3]['tmdb']]

    idx = list(range(0, len(liste)))
    random.shuffle(idx)

    # TODO: check size

    movieList.append(liste[idx[0]])
    movieList[4]['rating'] = votingList[gemList.index(movieList[4]['tmdb'])]

    return movieList

# Call to get first Discovery series and afterwards four more suggestions with same topic
def getSeries():
    seriesList = []

    seriesListRaw = mongo.getSeriesData()

    idx = list(range(0, len(seriesListRaw)))
    random.shuffle(idx)

    for counter in range(0,5):
        seriesList.append(seriesListRaw[idx[counter]])

    return seriesList

# Get recommendation for given tmdb id
def getMovieRecommendation(_tmdbID):
    tmdbList = []
    movieList = []
    votingList = []
    with urllib.request.urlopen(mdb_url + "movie/" + str(_tmdbID) + "/recommendations" + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        # just extract ids
        for movie in movieRecommendationList:
            tmdbList.append(str(movie['id']))
            votingList.append(str(movie['vote_average']))

        liste = mongo.check_list(tmdbList)

        # delete duplicates
        cleanedList = []
        tmdbList = []
        for element in liste:
            if element['tmdb'] not in tmdbList:
                cleanedList.append(element)
                tmdbList.append(element['tmdb'])

        liste = cleanedList

        idx = list(range(0, len(liste)))
        random.shuffle(idx)

        movieList.append(liste[idx[0]])
        movieList.append(liste[idx[1]])
        movieList.append(liste[idx[2]])
        movieList.append(liste[idx[3]])
        movieList.append(liste[idx[4]])

        movieList[0]['rating'] = votingList[tmdbList.index(movieList[0]['tmdb'])]
        movieList[1]['rating'] = votingList[tmdbList.index(movieList[1]['tmdb'])]
        movieList[2]['rating'] = votingList[tmdbList.index(movieList[2]['tmdb'])]
        movieList[3]['rating'] = votingList[tmdbList.index(movieList[3]['tmdb'])]
        movieList[4]['rating'] = votingList[tmdbList.index(movieList[4]['tmdb'])]

        return movieList

# Get recommendation for given tmdb id
def getSeriesRecommendation(_imdbID):
    seriesList = []

    dataFile = open('seriesData.json')
    seriesListRaw = json.load(dataFile)

    idx = list(range(0, len(seriesListRaw)))
    random.shuffle(idx)

    for counter in range(0,5):
        seriesList.append(seriesListRaw[idx[counter]])

    return seriesList

if __name__ == "__main__":
    print("Ugga Ugga")

    print(getMovies())