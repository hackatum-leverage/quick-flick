import random
import mongo
import urllib.request, json

mdb_url = "https://api.themoviedb.org/3/"
mdb_key = "5df139106aa0fb2f1b015f82b6bf0a7a"

def get_imdb_id_movie(id):
    with urllib.request.urlopen(mdb_url+ "movie/" + str(id) + "?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        ret = req["imdb_id"]
    return ret

def get_imdb_id_tv(id):
    with urllib.request.urlopen(mdb_url+ "tv/" + str(id) + "/external_ids" + "?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        ret = req["imdb_id"]
    return ret

def get_id(imdb_id):
    # Check length of id
    if len(str(imdb_id)) == 6:
        imdb_id = "tt0" + str(imdb_id)
    elif len(str(imdb_id)) == 7:
        imdb_id = "tt" + str(imdb_id)

    with urllib.request.urlopen(mdb_url + "find/" + imdb_id + "?api_key=" + mdb_key + "&external_source=imdb_id") as url:
        req = json.loads(url.read().decode())
        if not req["tv_results"]:
            ret = req["movie_results"][0]["id"]
        else :
            ret = req["tv_results"][0]["id"]
    return str(ret)

# Uses discover api as first suggestion and then selects next recommendation
def getRandomDiscoverMovie():
    tmdbList = []
    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&sort_by=popularity.desc" + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieList = req['results']

    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&sort_by=popularity.desc" + "&page=2") as url:
        req = json.loads(url.read().decode())
        movieList2 = req['results']

        # just extract ids
        for movie in movieList:
            tmdbList.append(str(movie['id']))
        for movie in movieList2:
            tmdbList.append(str(movie['id']))

        return tmdbList

    return -1

# Get trending movies
def getPopularMovies():
    tmdbList = []
    with urllib.request.urlopen(mdb_url + "movie/" + "popular/" + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        # just extract ids
        for movie in movieRecommendationList:
            tmdbList.append(str(movie['id']))

        return tmdbList

def getHiddenGemMovie():
    tmdbList = []
    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&sort_by=popularity.desc" + "&page=1" + "&release_date.lte=2009-12-31") as url:
        req = json.loads(url.read().decode())
        movieList = req['results']

        # just extract ids
        for movie in movieList:
            tmdbList.append(str(movie['id']))

        return tmdbList

# Call to get first Discovery movie and afterwards four more suggestions with same topic
def getMovies():
    movieList = []

    discoveryList = getRandomDiscoverMovie()
    liste = mongo.check_list(discoveryList)

    idx = list(range(0, len(liste)))
    random.shuffle(idx)

    # TODO: check size

    movieList.append(liste[idx[0]])
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

    dataFile = open('seriesData.json')
    seriesListRaw = json.load(dataFile)

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
    

if __name__ == "__main__":
    print("Ugga Ugga")