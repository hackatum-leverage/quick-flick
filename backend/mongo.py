import json

from bson import json_util
from pymongo import MongoClient
import random

client = MongoClient(
    'mongodb+srv://quick-flick:viGRrJtfaneBym2l@streamerdata.fxukpfy.mongodb.net/?retryWrites=true&w=majority')

db = client.data

col_disney = db.disney
col_apple = db.apple
col_rtl = db.rtl
col_netflix = db.netflix
col_netflix_full = db.netflix_full

def get_random_movie():
    ret = []
    agg = col_netflix_full.aggregate([
        {
            '$match': {
                'serie': '0'
            }
        }, {
            '$sample': {
                'size': 5
            }
        }
    ])
    for a in agg:
        ret.append(parse_json(a))
    return ret

def get_random_tv():
    ret = []
    agg = col_netflix_full.aggregate([
        {
            '$match': {
                'serie': '1'
            }
        }, {
            '$sample': {
                'size': 5
            }
        }
    ])
    for a in agg:
        ret.append(parse_json(a))
    return ret


def find_by_imdb(imdb_id):
    ret_d = col_disney.find_one({'imdb_id': str(imdb_id)})
    ret_a = col_apple.find_one({'imdb_id': str(imdb_id)})
    ret_r = col_rtl.find_one({'imdb_id': str(imdb_id)})
    ret_n = col_netflix.find_one({'imdb_id': str(imdb_id)})
    ret_n_f = col_netflix_full.find_one({'imdb_id': str(imdb_id)})
    l = [ret_n, ret_r, ret_a, ret_d, ret_n_f]
    ret = None
    while ret is None:
        ret = random.choice(l)
    return ret

def check_imdb(_imdbID):
    agg = col_netflix_full.aggregate([
        {
            '$match': {
                'imdb_id': str(_imdbID)
            }
        },
    ])

    searchResults = list(agg)

    if len(searchResults) > 0:
        return True
    else:
        return False
        
def parse_json(data):
    return json.loads(json_util.dumps(data))