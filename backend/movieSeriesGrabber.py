import random
import mongo
import urllib.request, json

mdb_url = "https://api.themoviedb.org/3/"
mdb_key = "5df139106aa0fb2f1b015f82b6bf0a7a"

# Uses discover api as first suggestion and then selects next recommendation
def getRandomDiscoverMovie():
    tmdbList = []
    votingList = []
    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&sort_by=popularity.desc" + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieList = req['results']

    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&sort_by=popularity.desc" + "&page=2") as url:
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
    with urllib.request.urlopen(mdb_url + "movie/" + "popular/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        # just extract ids
        for movie in movieRecommendationList:
            tmdbList.append(str(movie['id']))

        return tmdbList

def getHiddenGemMovie():
    tmdbList = []
    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&language=en-US" + "&sort_by=popularity.desc" + "&page=1" + "&release_date.lte=2009-12-31") as url:
        req = json.loads(url.read().decode())
        movieList = req['results']

        # just extract ids
        for movie in movieList:
            tmdbList.append(str(movie['id']))

        return tmdbList

# Call to get first Discovery movie and afterwards four more suggestions with same topic
def getMovies():
    movieList = []

    discoveryList, votingList = getRandomDiscoverMovie()
    liste = mongo.check_list(discoveryList)

    idx = list(range(0, len(liste)))
    random.shuffle(idx)

    # TODO: check size

    movieList.append(liste[idx[0]])

    #var = discoveryList.index(movieList[0]['tmdb'])

    movieList.append(liste[idx[1]])
    movieList.append(liste[idx[2]])

    popularList = getPopularMovies()
    liste = mongo.check_list(popularList)

    idx = list(range(0, len(liste)))
    random.shuffle(idx)

    # TODO: check size

    movieList.append(liste[idx[0]])

    gemList = getHiddenGemMovie()
    liste = mongo.check_list(gemList)

    idx = list(range(0, len(liste)))
    random.shuffle(idx)

    # TODO: check size

    movieList.append(liste[idx[0]])

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
    with urllib.request.urlopen(mdb_url + "movie/" + str(_tmdbID) + "/recommendations" + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        # just extract ids
        for movie in movieRecommendationList:
            tmdbList.append(str(movie['id']))

        liste = mongo.check_list(tmdbList)

        idx = list(range(0, len(liste)))
        random.shuffle(idx)

        movieList.append(liste[idx[0]])
        movieList.append(liste[idx[1]])
        movieList.append(liste[idx[2]])
        movieList.append(liste[idx[3]])
        movieList.append(liste[idx[4]])

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
    
def getRating(_tmdb):
    tmdbList = []
    movieList = []
    with urllib.request.urlopen(mdb_url + "movie/" + str(_tmdbID) + "/recommendations" + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        # just extract ids
        for movie in movieRecommendationList:
            tmdbList.append(str(movie['id']))

if __name__ == "__main__":
    print("Ugga Ugga")

    getMovies()