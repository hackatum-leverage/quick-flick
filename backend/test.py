import random
import urllib.request, json

mdb_url = "https://api.themoviedb.org/3/"
mdb_key = "5df139106aa0fb2f1b015f82b6bf0a7a"

# Uses discover api as first suggestion and then selects next recommendation
def getRandomDiscoverMovie():
    tmdbList = []
    with urllib.request.urlopen(mdb_url + "discover/" + "movie/" + "?api_key=" + str(mdb_key) + "&sort_by=popularity.desc" + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieList = req['results']

        # just extract ids
        for movie in movieList:
            tmdbList.append(movie['id'])

        return tmdbList

    return -1

# Get recommendation for given tmdb id
def getMovieRecommendation(_tmdbID):
    with urllib.request.urlopen(mdb_url + "movie/" + str(_tmdbID) + "/recommendations" + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        return movieRecommendationList



# Call to get first Discovery movie and afterwards four more suggestions with same topic
def getMovies():
    movieList = []

    discoveryList = getRandomDiscoverMovie()

    # Select random movie
    discoveryMovieIdx = random.randint(0, len(discoveryList) - 1)
    
    # Check if 

    # Get more suggestions for this movie
    similarMovie
