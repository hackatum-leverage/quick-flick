import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReviewComment } from '../models/comment.model';
import { Offer } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private BACKEND_URL = "https://quick-flick-backend-pu2rnvaodq-ew.a.run.app";

  constructor(
    private http: HttpClient
  ) { }

  public async getMovies() {
    return Promise.resolve(this.augmentOffers(this.DUMMY_MOVIE_OFFERS));
    return this.http.get<Offer[]>(`${this.BACKEND_URL}/movie/next/`).toPromise().then(async (movies: Offer[] | undefined) => {
      return this.augmentOffers(movies);
    }).catch(() => {
      return []
    })
  }

  public async getRelatedMovies(offer: Offer) {
    return this.http.get<Offer[]>(`${this.BACKEND_URL}/movie/next/${offer.tmdb ?? "634649"}`).toPromise().then(async (movies: Offer[] | undefined) => {
      return this.augmentOffers(movies);
    }).catch(() => {
      return []
    })
  }

  public async getSeries() {
    return Promise.resolve(this.augmentOffers(this.DUMMY_SERIES_OFFERS));
    return this.http.get<Offer[]>(`${this.BACKEND_URL}/series/next/`).toPromise().then(async (series: Offer[] | undefined) => {
      return this.augmentOffers(series);
    }).catch(() => {
      return []
    })
  }

  private augmentOffers(offers: Offer[] | undefined, fixedLabel?: "gem" | "trending" | "for you") {
    offers = offers ?? []
    offers.forEach(async (offer, index) => {
      let loadReasons = false
      let loadAdjectives = false;
      if (!fixedLabel) {
        if (index % 5 == 4) {
          offer.label = "gem"
          if (offer.tmdb) {
            loadAdjectives = true
          }
        } else if (index % 5 == 3) {
          offer.label = "trending"
        } else {
          offer.label = "for you"
        }
      } else {
        offer.label = fixedLabel;
      }
      let gif_url = ""
      let reasons = undefined
      let adjectives = undefined
      if (loadReasons) {
        [gif_url, reasons] = await Promise.all([this.getGif(offer), this.getReasons(offer.tmdb!)])
      } else if (loadAdjectives) {
        [gif_url, adjectives] = await Promise.all([this.getGif(offer), this.getAdjectives(offer.tmdb!)])
      }
      else {
        gif_url = await this.getGif(offer)
      }
      offer.gif_url = gif_url
      offer.reasons = reasons
      offer.adjectives = adjectives
      if (!offer.posters || offer.posters.split(',').length === 0) {
        offer.posters = await this.getPosterURL(offer);
      }
    });
    return offers;
  }

  private getPosterURL(offer: Offer) {
    const id = offer.serie ? offer.tvdb : offer.imdb_id;
    let placeholderPoster = "../../../assets/poster-placeholder.jpg";
    if (!id) {
      return placeholderPoster;
    }
    return this.http.get<string>(`${this.BACKEND_URL}/${offer.serie ? "series" : "movie"}/poster/${id ?? "1722512"}`).toPromise().then(async (url: string | undefined) => {
      url = url ?? placeholderPoster
      return url
    }).catch(() => {
      return placeholderPoster
    })
  }

  public async getReasons(id: string) {
    return this.http.get<string[]>(`${this.BACKEND_URL}/movie/reasons/${id}/1`).toPromise().then(async (reasons: string[] | undefined) => {
      return reasons ?? [];
    }).catch(() => {
      return []
    })
  }

  public async getAdjectives(id: string) {
    return Promise.resolve(["intense", "mind-blowing", "futuristic"])

    return this.http.get<string[]>(`${this.BACKEND_URL}/movie/reasons/${id}/0`).toPromise().then(async (reasons: string[] | undefined) => {
      return reasons ?? [];
    }).catch(() => {
      return []
    })
  }

  private getGif(item: Offer) {
    const query_addon = item.serie ? " series" : " movie";
    const query_title = escape(((item.otitle || item.title || "The Matrix"))).substring(0, 50 - query_addon.length).replace(/%+\d*$/, "");

    return this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=${environment.giphyAPIKey}&q=${query_title}${query_addon}&limit=1&rating=g`).toPromise().then((data) => {
      let res = data as GiphyResponse;
      let gitUrl = `https://i.giphy.com/${res.data[0].id}.gif`;
      return gitUrl;
    }).catch((error) => {
      console.error(error);
      return `https://i.giphy.com/xUOxfj6cTg3ezmjIoo.gif`;
    })
  }

  public getComments(item: Offer) {
    return this.http.get<ReviewComment[]>(`${this.BACKEND_URL}/${item.serie ? "series" : "movie"}/comments/${(item.tmdb ?? "634649")}`).toPromise().then(async (comments: ReviewComment[]| undefined) => {
      return comments ?? [];
    }).catch(() => {
      return []
    });
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }


  private DUMMY_COMMENTS: ReviewComment[] = [
      {
          "name": "Top_Dawg_Critic",
          "review": "It was a great movie with a different setting than most other movies I know."
      },
      {
          "name": "scottedwards-87359",
          "review": "I was waiting for this day for the longest time and oh boy it was wort it. I was blown away!!!"
      },
      {
          "name": "goshamorrell",
          "review": "The writing was spot-on and the action sequences were bombastic. The special effects were stunning and the cinematography was picture-perfect. "
      },
      {
          "name": "dtucker86",
          "review": "I think the acting, visuals, and soundtrack were all great!"
      },
      {
          "name": "lovefalloutkindagamer",
          "review": "Looved it"
      },
      {
          "name": "alexglimbergwindh",
          "review": "I highly recommend seeing this movie in the theaters. The big screen and booming speakers make for an amazing experience. I"
      }
  ]

  private DUMMY_MOVIE_OFFERS: Offer[] = [
    {"id":"4418249395","tmdb":"293660","imdb_id":"1431045","imdb_episode_id":"","title":"Deadpool","otitle":"","original":true,"serie":false,"season":"0","episode":"0","episodetitle":"","oepisodetitle":"","year":"2016","directors":"Tim Miller","actors":"Ryan Reynolds, Morena Baccarin, Ed Skrein, T.J. Miller, Brianna Hildebrand, Stan Lee","companies":"Marvel","countries":"","genres":"Comedy, Superhero, Action-Adventure","channel":"","banners":"","posters":"http:\/\/www.vodster.de\/db\/w500\/zWD1ZXM6w73UNdTfXwVzUm6fd95.jpg, http:\/\/www.vodster.de\/db\/w500\/VEfCqkbK062Egob26rYQWAJoE7.jpg, http:\/\/www.vodster.de\/db\/w500\/r9TNidNK1xtlvYXeM0hvX8hWIcf.jpg, http:\/\/www.vodster.de\/db\/w500\/tdVPICyJLENwgmZHr8RsOgeWoyP.jpg, http:\/\/www.vodster.de\/db\/w500\/2drDLdrmgq5zvxvWzAYhzv2pH0c.jpg","pid":"dp","provider":"Disney+","url":"https:\/\/www.disneyplus.com\/movies\/-\/3Kh13Lrb0Pnv","seasonurl":"","episodeurl":"","language":"Espa\u00f1ol (Latinoamericano)","subtitles":"Deutsch\nPortugu\u00eas (Brasil)\nPortugu\u00eas\n\u00cdslenska\nEnglish [CC]\nFran\u00e7ais (Canadien)\nSloven\u010dina\nDansk\nPolski\nJapanese\nRom\u00e2n\u0103\nKorean\nGreek\nSuomi\nNederlands\nChinese (Traditional)\nEspa\u00f1ol (Latinoamericano)\n\u010ce\u0161tina\nFran\u00e7ais\nEspa\u00f1ol\nMagyar\nSvenska\nT\u00fcrk\u00e7e\nNorsk\nItaliano\nChinese (Simplified)\nChinese (Hong Kong)","audio":"Dolby Digital 5.1","runtime":"110","fsk":"16","rating":9.5},
    {"id":"1849470903","tmdb":"10195","tvdb":"","imdb_id":"800369","imdb_episode_id":"","title":"Marvel Studios' Thor","otitle":"Thor","original":true,"serie":false,"season":"0","episode":"0","episodetitle":"","oepisodetitle":"","year":"2011","directors":"Kenneth Branagh","actors":"Chris Hemsworth, Natalie Portman, Tom Hiddleston, Stellan Skarsg\u00e5rd, Kat Dennings, Clark Gregg","companies":"Marvel, The Avengers","countries":"","genres":"Fantasy, Superhero, Action-Adventure","channel":"","banners":"http:\/\/www.vodster.de\/db\/w780\/6aABl5cNaiIox3dQ3yawp08CBtU.jpg","posters":"http:\/\/www.vodster.de\/db\/w500\/9zDwvsISU8bR15R2yN3kh1lfqve.jpg, http:\/\/www.vodster.de\/db\/w500\/4orbobSnGQrzxQvVz4n8jYnTxIO.jpg, http:\/\/www.vodster.de\/db\/w500\/1eauJgD6DsfnQxE2DlGzR18OJ59.jpg, http:\/\/www.vodster.de\/db\/w500\/8r2BcXUxdkODHGC4flpCTKg7k9J.jpg, http:\/\/www.vodster.de\/db\/w500\/hv6reAEiA6hFtlSzcW3N4atVuSP.jpg","pid":"dp","provider":"Disney+","url":"https:\/\/www.disneyplus.com\/movies\/-\/1p4vdKzTuhzr","seasonurl":"","episodeurl":"","language":"Espa\u00f1ol (Latinoamericano)","subtitles":"Deutsch\nPortugu\u00eas (Brasil)\nPortugu\u00eas\n\u00cdslenska\nEnglish [CC]\nFran\u00e7ais (Canadien)\nSloven\u010dina\nDansk\nPolski\nFran\u00e7ais (Canadien) [CC]\nJapanese\nRom\u00e2n\u0103\nKorean\nGreek\nSuomi\nNederlands\nChinese (Traditional)\nEspa\u00f1ol (Latinoamericano)\n\u010ce\u0161tina\nFran\u00e7ais\nEspa\u00f1ol\nMagyar\nSvenska\nT\u00fcrk\u00e7e\nNorsk\nItaliano\nChinese (Simplified)\nChinese (Hong Kong)","audio":"Dolby Digital 5.1","runtime":"117","fsk":"12","rating":8.6},
    {"id":"12951487474","tmdb":"361743","tvdb":"","imdb_id":"1745960","imdb_episode_id":"","title":"Top Gun: Maverick","otitle":"Top Gun: Maverick","original":false,"serie":false,"season":"0","episode":"0","episodetitle":"","oepisodetitle":"","year":"2022","directors":"Joseph Kosinski","actors":"Tom Cruise, Miles Teller, Jennifer Connelly, Jon Hamm, Glen Powell, Ed Harris, Val Kilmer, Lewis Pullman","companies":"Paramount Pictures., Paramount Pictures","countries":"","genres":"Action","channel":"","banners":"http:\/\/www.vodster.de\/db\/w780\/2OxhjU4Zcs1ucC0VqnquWjGLijG.jpg, http:\/\/www.vodster.de\/db\/w780\/epxqthcHl4fSF5cdX5WchfIgHQ3.jpg","posters":"http:\/\/www.vodster.de\/db\/w500\/8zoeQOVDfn4TfXi0yV5oP2RIeQX.jpg, http:\/\/www.vodster.de\/db\/w500\/4wsyujRuefCKMkpxGBUxskPxmp3.jpg, http:\/\/www.vodster.de\/db\/w500\/ajDJ1wB8l0KyKaQbldpJTMO6cpZ.jpg, http:\/\/www.vodster.de\/db\/w500\/peXbIcwjmjotkTxld58ydplRU7m.jpg, http:\/\/www.vodster.de\/db\/w500\/nAtvO2iI2wQ07mePxrs2wROEa0E.jpg","pid":"ap","provider":"Apple iTunes","url":"https:\/\/itunes.apple.com\/de\/movie\/id1622177554","seasonurl":"","episodeurl":"","language":"Deutsch","subtitles":"Deutsch","audio":"Dolby Atmos","runtime":"130","fsk":"-1","rating":7.0},
    {"id":"6799815","tmdb":"603","imdb_id":"133093","imdb_episode_id":"","title":"Matrix","otitle":"The Matrix","original":false,"serie":false,"season":"0","episode":"0","episodetitle":"","oepisodetitle":"","year":"1999","directors":"Lilly Wachowski, Lana Wachowski","actors":"Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Gloria Foster, Joe Pantoliano, Marcus Chong, Julian Arahanga, Matt Doran, Belinda McClory","companies":"","countries":"","genres":"Martial Arts Movies, Sci-Fi Movies, Unkonventionell, Action Movies","channel":"","banners":"http:\/\/www.vodster.de\/db\/w780\/qMzFjzoYwBRMOh0yzN55T78nzT2.jpg","posters":"http:\/\/www.vodster.de\/db\/w500\/bfuMEU1Sc4K24j2lSIvDQDCD6ix.jpg, http:\/\/www.vodster.de\/db\/w500\/65TMLqL8C5KhdmHBRQCvI8u3IUd.jpg, http:\/\/www.vodster.de\/db\/w500\/vybQQ7w7vGvF53IsGD0y0JSgIsA.jpg, http:\/\/www.vodster.de\/db\/w500\/dL0n7ciODbtGj7V7i0X0PEaU8We.jpg, http:\/\/www.vodster.de\/db\/w500\/qK76PKQLd6zlMn0u83Ej9YQOqPL.jpg","pid":"nf","provider":"Netflix","url":"https:\/\/www.netflix.com\/de\/title\/20557937","seasonurl":"","episodeurl":"", "language":"Deutsch","subtitles":"Deutsch\nEnglisch","audio":"Dolby Digital 5.1","runtime":"136","fsk":"16","rating":8.5},
    {"id":"4456580","tmdb":"157336","imdb_id":"816692","imdb_episode_id":"","title":"Interstellar (2014)","otitle":"Interstellar (2014)","original":false,"serie":false,"season":"0","episode":"0","episodetitle":"","oepisodetitle":"","year":"2014","directors":"Christopher Nolan","actors":"Matthew McConaughey, Anne Hathaway, Jessica Chastain, Bill Irwin, Ellen Burstyn, Michael Caine","companies":"Warner Bros. Entertainment Inc. and Paramount Pictures Corporation. ., WARNER BROS.","countries":"","genres":"Action","channel":"","banners":"http:\/\/www.vodster.de\/db\/w780\/1KJKaerVTo6z6ulY9clHW4I89E9.jpg","posters":"http:\/\/www.vodster.de\/db\/w500\/ceObcMuQxtX9HJ4VaJvLg6WuhIf.jpg, http:\/\/www.vodster.de\/db\/w500\/jYTnA6BrYWxhKXj30oacq3nNTDo.jpg, http:\/\/www.vodster.de\/db\/w500\/lnt01kCIgjfd8ncRsn9UqZxZkpg.jpg, http:\/\/www.vodster.de\/db\/w500\/mR2OK5aK5kMOdAQYfc5kkOg06Pn.jpg, http:\/\/www.vodster.de\/db\/w500\/lckRcubpItGlnO1v60clysNirme.jpg","pid":"ap","provider":"Apple iTunes","url":"https:\/\/itunes.apple.com\/de\/movie\/id965491522","seasonurl":"","episodeurl":"","language":"Englisch","subtitles":"Deutsch","audio":"Dolby Digital 5.1","runtime":"169","fsk":"-1","rating":9.5},
    {"id":"3822536","tmdb":"64682","tvdb":"","imdb_id":"1343092","imdb_episode_id":"","title":"Der gro\u00dfe Gatsby [2013]","otitle":"The Great Gatsby (2013)","original":false,"serie":false,"season":"0","episode":"0","episodetitle":"","oepisodetitle":"","year":"2013","directors":"Baz Luhrmann","actors":"Leonardo DiCaprio, Tobey Maguire, Carey Mulligan, Joel Edgerton, Isla Fisher, Jason Clarke, Elizabeth Debicki","companies":"Bazmark Film III Pty Ltd., Warner Bros.","countries":"","genres":"Drama","channel":"","banners":"","posters":"http:\/\/www.vodster.de\/db\/w500\/rRRVIbWZSxXdQC4dUmVGrWrs1bJ.jpg, http:\/\/www.vodster.de\/db\/w500\/lGPsjOTRRSANa7BiOKIT1tCjNZr.jpg, http:\/\/www.vodster.de\/db\/w500\/26xuWmTyY7LSYrHD5P2zpmjzzQ9.jpg, http:\/\/www.vodster.de\/db\/w500\/cfZhXPCrAPLmadLYp6YC0pBd50i.jpg, http:\/\/www.vodster.de\/db\/w500\/4nEsWo7bPP0KpG1xCOAO78voHwn.jpg","pid":"ap","provider":"Apple iTunes","url":"https:\/\/itunes.apple.com\/de\/movie\/id687755816","seasonurl":"","episodeurl":"","language":"Englisch","subtitles":"","audio":"Dolby Digital 5.1","runtime":"142","fsk":"-1","rating":7.9},
    {"id":"498466468","tmdb":"10192","tvdb":"","imdb_id":"892791","imdb_episode_id":"","title":"F\u00fcr immer Shrek","otitle":"F\u00fcr immer Shrek","original":false,"serie":false,"season":"0","episode":"0","episodetitle":"","oepisodetitle":"","year":"2010","directors":"Mike Mitchell","actors":"John Cleese, Julie Andrews, Antonio Banderas, Eddie Murphy, Jane Lynch, Walt Dorhn, Jon Hamm, Mike Myers, Craig Robinson, Cameron Diaz","companies":"DreamWorks Animation LLC. ., Dreamworks Animation","countries":"","genres":"Kinder und Familie","channel":"","banners":"http:\/\/www.vodster.de\/db\/w780\/3FVvfeMLz7BX7iVDySfVn6POuRi.jpg","posters":"http:\/\/www.vodster.de\/db\/w500\/eVY61Mj9PdvD0Le2fxgrjr97sX4.jpg, http:\/\/www.vodster.de\/db\/w500\/bsjiAVTA6ml59BcQGcANosSzDXw.jpg, http:\/\/www.vodster.de\/db\/w500\/eukamA7W6MHNDQoFMFD4A4zcpNq.jpg, http:\/\/www.vodster.de\/db\/w500\/lhoXBpEPvLJXPZ4tHuIF7nzeu58.jpg, http:\/\/www.vodster.de\/db\/w500\/bu1VbqHRPopPxewQCgvhuMJ9xKM.jpg","pid":"ap","provider":"Apple iTunes","url":"https:\/\/itunes.apple.com\/de\/movie\/id1338593242","seasonurl":"","episodeurl":"","language":"Englisch","subtitles":"Deutsch","audio":"Dolby Digital 5.1","runtime":"93","fsk":"-1","rating":5.5},
  ]


  private DUMMY_SERIES_OFFERS: Offer[] = [
    {"id":"2928204341","tmdb":"940535","tvdb":"77526","imdb_id":"60028","imdb_episode_id":"","title":"Star Trek: The Original Series (Remastered)","otitle":"","original":false,"serie":true,"season":"1","episode":"36","episodetitle":"Season 2, Episode 7: Catspaw","oepisodetitle":"","year":"2020","directors":"","actors":"","companies":"CBS Corp","countries":"","genres":"Drama, TV-Sendungen, Science-Fiction und Fantasy","channel":"","banners":"http:\/\/www.vodster.de\/db\/fanart\/original\/77526-5.jpg, http:\/\/www.vodster.de\/db\/fanart\/original\/77526-1.jpg, http:\/\/www.vodster.de\/db\/fanart\/original\/77526-20.jpg","posters":"http:\/\/www.vodster.de\/db\/seasons\/77526-0-8.jpg, http:\/\/www.vodster.de\/db\/posters\/77526-9.jpg","pid":"ap","provider":"Apple iTunes","url":"https:\/\/itunes.apple.com\/de\/artist\/1439512969","seasonurl":"https:\/\/itunes.apple.com\/de\/tv-season\/id1439512970","episodeurl":"https:\/\/itunes.apple.com\/de\/tv-season\/id1439512970?i=1440260223","language":"Deutsch","subtitles":"","audio":"DolbySurround","runtime":"50","fsk":"-1","rating":6.8},
  ];
}


interface GiphyResponse {
  data: [
    {
      id: string;
    }
  ]
}
