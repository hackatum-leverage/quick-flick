import os
import urllib.request, json
from flask import Flask
import mongo

app = Flask(__name__)

mdb_url = "https://api.themoviedb.org/3/"
mdb_key = "5df139106aa0fb2f1b015f82b6bf0a7a"
img_baseurl = "http://image.tmdb.org/t/p/"
size = "w500"

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/testjson")
def test_json():
    return {
        "success": True
    }

@app.route("/movie/trends")
def movie_trends():
    with urllib.request.urlopen(mdb_url + "trending/" + "movie/" + "week" +"?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        req_id = req["results"][0]["id"]
        ret_id = get_imdb_id_movie(str(req_id))
    return ret_id

@app.route("/series/trends")
def tv_trends():
    with urllib.request.urlopen(mdb_url + "trending/" + "tv/" + "week" +"?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        req_id = req["results"][0]["id"]
        ret_id = get_imdb_id_tv(str(req_id))
    return ret_id

@app.route("/movie/poster/<imdb_id>")
def movie_poster(imdb_id="tt0137523"):
    new_id = get_id(imdb_id)
    with urllib.request.urlopen(mdb_url + "movie/" + new_id +"?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        ret = req["poster_path"]
    return img_baseurl+size+ret

@app.route("/series/next/")
def tv_next():
    pass

@app.route("/movie/next/")
def movie_next():
    return json.dumps(mongo.get_random_movie())

@app.route("/series/poster/<imdb_id>")
def tv_poster(imdb_id):
    new_id = str(get_id(imdb_id))
    with urllib.request.urlopen(mdb_url + "tv/" + new_id + "/images" + "?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        ret = req["posters"][0]["file_path"]
    return img_baseurl+size+ret

@app.route("/movie/comments/<imdb_id>")
def movie_comments(imdb_id):
    new_id = get_id(imdb_id)
    with urllib.request.urlopen(mdb_url+ "movie/" + new_id + "/reviews" + "?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        comments = []
        for r in req["results"]:
            comments.append(r["content"])
    return {"comments": comments}

@app.route("/series/comments/<imdb_id>")
def tv_comments(imdb_id):
    new_id = get_id(imdb_id)
    with urllib.request.urlopen(mdb_url + "tv/" + new_id + "/reviews" + "?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        comments = []
        for r in req["results"]:
            comments.append(r["content"])
    return {"comments": comments}

@app.route("/offer/<imdb_id>")
def get_offer_record(imdb_id):
    pass

def get_id(imdb_id): #vllt parameter einfügen für TV oder Movie ergebnisse
    with urllib.request.urlopen(mdb_url + "find/" + imdb_id + "?api_key=" + mdb_key + "&external_source=imdb_id") as url:
        req = json.loads(url.read().decode())
        if not req["tv_results"]:
            ret = req["movie_results"][0]["id"]
            print("got movie result")
        else :
            ret = req["tv_results"][0]["id"]
            print("got tv result")
    return str(ret)

def get_imdb_id_movie(id):
    with urllib.request.urlopen(mdb_url+ "movie/" + id + "?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        ret = req["imdb_id"]
    return ret

def get_imdb_id_tv(id):
    with urllib.request.urlopen(mdb_url+ "tv/" + id + "/external_ids" + "?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        ret = req["imdb_id"]
    return ret

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
