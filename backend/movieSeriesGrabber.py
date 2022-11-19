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
def getTrendingMovies(_stage):
    # _stage = 0 -> 24 hours
    # _stage = 1 -> 7 dayy
    tmp = ""
    if _stage == 0:
        tmp = "day"
    else:
        tmp = "week"

    tmdbList = []
    with urllib.request.urlopen(mdb_url + "trending/" + "movie/" + tmp + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        # just extract ids
        for movie in movieRecommendationList:
            tmdbList.append(movie['id'])

        return tmdbList

# Call to get first Discovery movie and afterwards four more suggestions with same topic
def getMovies():
    movieList = []

    defaultDiscoveryVideos = [1300851, 960144, 87544]

    # Select random movie
    discoveryList = getRandomDiscoverMovie()
    for numberDiscovery in range(0,3):
        movieAvailable = False
        counter = 0
        counterOverFlow = False
        while not movieAvailable:
            if counter >= len(discoveryList) - 1:
                counterOverFlow = True
            counter = counter + 1

            discoveryMovieIdx = random.randint(0, len(discoveryList) - 1)

            # Get imdb from tmdb
            try:
                equivalentID = get_imdb_id_movie(discoveryList[discoveryMovieIdx])
            except Exception as e:
                continue
            if equivalentID is None:
                continue
            imdbID = int(equivalentID.replace("tt", ""))

            movieAvailable = mongo.check_imdb(imdbID)

            # If movie is already in list, dont select once more
            if discoveryList[discoveryMovieIdx] in movieList:
                movieAvailable = False

        # If counter overflow happend just add interstellar
        if counterOverFlow:
            movieList.append(defaultDiscoveryVideos[numberDiscovery])
        else:
            movieList.append(discoveryList[discoveryMovieIdx])

    # Get one trending movie from the last 24 hours
    trending1DayList = getTrendingMovies(0)
    movieAvailable = False
    counter = 0
    counterOverFlow = False
    while not movieAvailable:
        if counter >= len(trending1DayList) - 1:
            counterOverFlow = True
        counter = counter + 1

        trendingMovieIdx = random.randint(0, len(trending1DayList) - 1)

        # Get imdb from tmdb
        try:
            equivalentID = get_imdb_id_movie(trending1DayList[trendingMovieIdx])
        except Exception as e:
            continue
        if equivalentID is None:
            continue
        imdbID = int(equivalentID.replace("tt", ""))

        movieAvailable = mongo.check_imdb(imdbID)

        # If movie is already in list, dont select once more
        if trending1DayList[trendingMovieIdx] in movieList:
            movieAvailable = False

    # Add existing movie to list. If counter overflow happend just add interstellar
    if counterOverFlow:
        movieList.append(816692)
    else:
        movieList.append(trending1DayList[trendingMovieIdx])

    # Get one trending movie from the last 7 days
    trending7DayList = getTrendingMovies(1)
    movieAvailable = False
    counter = 0
    counterOverFlow = False
    while not movieAvailable:
        if counter >= len(trending7DayList) - 1:
            counterOverFlow = True
        counter = counter + 1

        trendingMovieIdx = random.randint(0, len(trending7DayList) - 1)

        # Get imdb from tmdb
        try:
            equivalentID = get_imdb_id_movie(trending7DayList[trendingMovieIdx])
        except Exception as e:
            continue
        if equivalentID is None:
            continue
        imdbID = int(equivalentID.replace("tt", ""))

        movieAvailable = mongo.check_imdb(imdbID)

        # If movie is already in list, dont select once more
        if trending7DayList[trendingMovieIdx] in movieList:
            movieAvailable = False

    # Add existing movie to list. If counter overflow happend just add interstellar
    if counterOverFlow:
        movieList.append(816692)
    else:
        movieList.append(trending7DayList[trendingMovieIdx])

    return movieList

# Uses discover api as first suggestion and then selects next recommendation series
def getRandomDiscoverSeries():
    tmdbList = []
    with urllib.request.urlopen(mdb_url + "discover/" + "tv/" + "?api_key=" + str(mdb_key) + "&sort_by=popularity.desc" + "&page=1") as url:
        req = json.loads(url.read().decode())
        seriesList = req['results']

    with urllib.request.urlopen(mdb_url + "discover/" + "tv/" + "?api_key=" + str(mdb_key) + "&sort_by=popularity.desc" + "&page=2") as url:
        req = json.loads(url.read().decode())
        seriesList2 = req['results']

        # just extract ids
        for series in seriesList:
            tmdbList.append(series['id'])
        for series in seriesList2:
            tmdbList.append(series['id'])

        return tmdbList

    return -1

# Get trending series
def getTrendingSeries(_stage):
    # _stage = 0 -> 24 hours
    # _stage = 1 -> 7 dayy
    tmp = ""
    if _stage == 0:
        tmp = "day"
    else:
        tmp = "week"

    tmdbList = []
    with urllib.request.urlopen(mdb_url + "trending/" + "tv/" + tmp + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        seriesRecommendationList = req['results']

        # just extract ids
        for movie in seriesRecommendationList:
            tmdbList.append(movie['id'])

        return tmdbList

# Call to get first Discovery series and afterwards four more suggestions with same topic
def getSeries():
    seriesList = []

    defaultDiscoveryVideos = [386676, 60028, 367279]

    # Select random movie
    discoveryList = getRandomDiscoverSeries()
    for numberDiscovery in range(0,3):
        seriesAvailable = False
        counter = 0
        counterOverFlow = False
        while not seriesAvailable:
            if counter >= len(discoveryList) - 1:
                counterOverFlow = True
            counter = counter + 1

            discoverySeriesIdx = random.randint(0, len(discoveryList) - 1)

            # Get imdb from tmdb
            equivalentID = 0
            try:
                equivalentID = get_imdb_id_tv(discoveryList[discoverySeriesIdx])
            except Exception as e:
                continue
            if equivalentID is None:
                continue
            imdbID = int(equivalentID.replace("tt", ""))

            seriesAvailable = mongo.check_imdb(imdbID)

            # If movie is already in list, dont select once more
            if discoveryList[discoverySeriesIdx] in seriesList:
                seriesAvailable = False

        # If counter overflow happend just add interstellar
        if counterOverFlow:
            seriesList.append(defaultDiscoveryVideos[numberDiscovery])
        else:
            seriesList.append(discoveryList[discoverySeriesIdx])

    # Get one trending movie from the last 24 hours
    trending1DayList = getTrendingSeries(0)
    seriesAvailable = False
    counter = 0
    counterOverFlow = False
    while not seriesAvailable:
        if counter >= len(trending1DayList) - 1:
            counterOverFlow = True
        counter = counter + 1

        trendingSeriesIdx = random.randint(0, len(trending1DayList) - 1)

        # Get imdb from tmdb
        equivalentID = 0
        try:
            equivalentID = get_imdb_id_tv(trending1DayList[trendingSeriesIdx])
        except Exception as e:
            continue
        if equivalentID is None:
                continue
        imdbID = int(equivalentID.replace("tt", ""))

        seriesAvailable = mongo.check_imdb(imdbID)

        # If movie is already in list, dont select once more
        if trending1DayList[trendingSeriesIdx] in seriesList:
            seriesAvailable = False

    # Add existing movie to list. If counter overflow happend just add interstellar
    if counterOverFlow:
        seriesList.append(487831)
    else:
        seriesList.append(trending1DayList[trendingSeriesIdx])

    # Get one trending movie from the last 7 days
    trending7DayList = getTrendingSeries(1)
    seriesAvailable = False
    counter = 0
    counterOverFlow = False
    while not seriesAvailable:
        if counter >= len(trending7DayList) - 1:
            counterOverFlow = True
        counter = counter + 1

        trendingSeriesIdx = random.randint(0, len(trending7DayList) - 1)

        # Get imdb from tmdb
        equivalentID = 0
        try:
            equivalentID = get_imdb_id_tv(trending7DayList[trendingSeriesIdx])
        except Exception as e:
            continue
        if equivalentID is None:
                continue
        imdbID = int(equivalentID.replace("tt", ""))

        seriesAvailable = mongo.check_imdb(imdbID)

        # If movie is already in list, dont select once more
        if trending7DayList[trendingSeriesIdx] in seriesList:
            seriesAvailable = False

    # Add existing movie to list. If counter overflow happend just add interstellar
    if counterOverFlow:
        seriesList.append(417299)
    else:
        seriesList.append(trending7DayList[trendingSeriesIdx])

    return seriesList

# Get recommendation for given tmdb id
def getMovieRecommendation(_imdbID):
    # Convert from imdb to tmdb
    equivalentID = 0
    try:
        equivalentID = get_id(_imdbID)
    except Exception as e:
        return ["-1"]   # No movie found
    if equivalentID is None:
        return ["-1"]   # No movie found
    tmdbID = int(equivalentID)

    with urllib.request.urlopen(mdb_url + "movie/" + str(tmdbID) + "/recommendations" + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        movieRecommendationList = req['results']

        imdbList = []
        for movie in movieRecommendationList:
            equivalentID = 0
            try:
                equivalentID = get_imdb_id_movie(movie['id'])
            except Exception as e:
                return ["-1"]
            imdbList.append(equivalentID.replace("tt", ""))

        return imdbList[:5]
        
    return -1

# Get recommendation for given tmdb id
def getSeriesRecommendation(_imdbID):
    # Convert from imdb to tmdb
    equivalentID = 0
    try:
        equivalentID = get_id(_imdbID)
    except Exception as e:
        return ["-1"]   # No series found
    if equivalentID is None:
        return ["-1"]   # No series found
    tmdbID = int(equivalentID)

    with urllib.request.urlopen(mdb_url + "tv/" + str(tmdbID) + "/recommendations" + "?api_key=" + str(mdb_key) + "&page=1") as url:
        req = json.loads(url.read().decode())
        seriesRecommendationList = req['results']

        imdbList = []
        for series in seriesRecommendationList:
            equivalentID = 0
            try:
                equivalentID = get_imdb_id_tv(series['id'])
            except Exception as e:
                return ["-1"]
            imdbList.append(equivalentID.replace("tt", ""))

        return imdbList[:5]
        
    return -1

if __name__ == "__main__":
    print("Ugga Ugga")

    liste = getMovies()
    print(liste)