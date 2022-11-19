
import re
import json
import openai
import requests
from bs4 import BeautifulSoup

CLEANR = re.compile('<.*?>')
NUMREVIEWS = 4

def cleanHtml(_rawHtml):
        cleanText = re.sub(CLEANR, '', _rawHtml)
        return cleanText

def getReviewData(_imdbID):
    # Check _imdbID
    if len(str(_imdbID)) == 6:
        _imdbID = "0" + str(_imdbID)
    elif len(str(_imdbID)) == 7:
        _imdbID = str(_imdbID)

    URL = "https://www.imdb.com/title/tt" + str(_imdbID) + "/reviews?ref_=tt_sa_3"
    page = requests.get(URL)

    # Get necessary data of webpage
    soup = BeautifulSoup(page.content, "html.parser")
    # Get overall review box
    reviewsBox = soup.find(class_="lister-list")
    # Get Usernames
    userNames = reviewsBox.find_all("span", class_="display-name-link")
    # Get corresponding reviews
    reviews = reviewsBox.find_all("div", class_="text show-more__control")

    # Max number of elements
    if len(reviews) > NUMREVIEWS:
        reviews = reviews[0:NUMREVIEWS]
        userNames = userNames[0:NUMREVIEWS]

    # Convert to string list
    reviewList = []
    for review in reviews:
        reviewList.append(cleanHtml(str(review)))
    userNameList = []
    for userName in userNames:
        userNameList.append(cleanHtml(str(userName)))

    # Settings for openai
    openai.api_key = "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"

    # Get data from open ai
    responseList = []
    userNameCounter = 0
    for review in reviewList:
        response = openai.Completion.create(
            model = "text-davinci-002",
            prompt = "Summarize the following review in short positive form from the first person:" + review,
            temperature = 0.7,
            max_tokens = 12,
            top_p = 1,
            frequency_penalty = 0,
            presence_penalty = 0
        )

        # Try to get data out of response
        try:
            reviewString = response['choices'][0]['text'].replace("\n", "")
            reviewString = reviewString.replace("\n", "")
            reviewStringList = reviewString.rsplit('.', 1)

            if len(reviewStringList) == 0:
                reviewString = "Just a marvellous movie. Nothing more to say!"
            elif len(reviewStringList) == 1:
                reviewString = "".join(reviewStringList) + "."
            else:
                reviewString = "".join(reviewStringList[:-1]) + "."

            responseJson = {
                "name": userNameList[userNameCounter],
                "review": reviewString,
            }
            responseList.append(responseJson)
            userNameCounter = userNameCounter + 1
        except Exception as e:
            print("There was an error while summarizing data from openai")

    return responseList

#with open('openAIReponse.json', 'w') as f:
#        json.dump(getReviewData(0), f)

if __name__ == "__main__":
    print(getReviewData(816692))