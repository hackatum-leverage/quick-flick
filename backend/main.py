import os
import urllib.request, json
from flask import Flask

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

@app.route("/test/poster/<imdb_id>")
def test_poster(imdb_id="tt0137523"):
    new_id = get_id(imdb_id)
    with urllib.request.urlopen(mdb_url + "movie/" + new_id +"?api_key=" + mdb_key) as url:
        req = json.loads(url.read().decode())
        ret = req["poster_path"]
    return img_baseurl+size+ret

def get_id(imdb_id):
    with urllib.request.urlopen(mdb_url + "find/" + imdb_id + "?api_key=" + mdb_key + "&external_source=imdb_id") as url:
        req = json.loads(url.read().decode())
        if not req["tv_results"]:
            ret = req["movie_results"][0]["id"]
        else :
            ret = req["tv_results"][0]["id"]
    return str(ret)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
