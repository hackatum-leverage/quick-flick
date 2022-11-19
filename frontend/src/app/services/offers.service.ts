import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Offer } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(
    private http: HttpClient
  ) { }

  public async getMovies() {

    return this.http.get<Offer[]>("https://quick-flick-backend-pu2rnvaodq-ew.a.run.app/movie/next").toPromise().then(async (movies: Offer[] | undefined) => {
      movies = movies ?? []
      for (let movie of movies) {
        movie.gif_url = await this.getGif(movie);
      }
      return movies
    });
  }

  public async getSeries() {
    return this.http.get<Offer[]>("https://quick-flick-backend-pu2rnvaodq-ew.a.run.app/series/next").toPromise().then(async (series: Offer[] | undefined) => {
      series = series ?? []
      for (let s of series) {
        s.gif_url = await this.getGif(s);
      }
      return series;
    });
  }

  public getGif(item: Offer) {
    const query_addon = item.serie ? " series" : " movie";
    const query_title = escape(((item.otitle || item.title || "The Matrix"))).substring(0, 50 - query_addon.length).replace(/%+\d*$/, "");

    return this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=${environment.giphyAPIKey}&q=${query_title}${query_addon}&limit=1&rating=g`).toPromise().then((data) => {
      let res = data as GiphyResponse;
      let gitUrl = `https://i.giphy.com/${res.data[0].id}.gif`;
      item.gif_url = gitUrl;
      return gitUrl;
    }).catch((error) => {
      console.log(error);
      return `https://i.giphy.com/xUOxfj6cTg3ezmjIoo.gif`;
    })
  }

  private DUMMY_MOVIE_OFFERS: Offer[] = [
    {
      "id": "89594320",
      "tmdb": "744",
      "imdb_id": "92099",
      "title": "Top Gun",
      "otitle": "",
      "original": false,
      "serie": false,
      "season": "0",
      "episode": "0",
      "episodetitle": "",
      "oepisodetitle": "",
      "year": "1986",
      "directors": "Tony Scott",
      "actors": "Tom Cruise, Kelly McGillis, Val Kilmer, Anthony Edwards, Tom Skerritt, Michael Ironside, John Stockwell, Barry Tubb, Rick Rossovich, Tim Robbins, Meg Ryan",
      "companies": "",
      "countries": "",
      "genres": "Romantic Movies, Adrenalingeladen, Military Movies, Action Movies",
      "channel": "",
      "banners": "http://www.vodster.de/db/w780/k20j3PMQSelVQ6M4dQoHuvtvPF5.jpg",
      "posters": "http://www.vodster.de/db/w500/iatApkVK8y980tLUlA7C5dg2tc3.jpg, http://www.vodster.de/db/w500/fmXOY1bdRJ9CmzroeaTXRyr6qyz.jpg, http://www.vodster.de/db/w500/copFj5cwnHPpytEDl7ZHxJdCxOF.jpg, http://www.vodster.de/db/w500/oGbxR8TI5QpjEfi6Gykz35X0l9n.jpg, http://www.vodster.de/db/w500/25EVOYgxHQQB1qoYjq2FcO8s6Pq.jpg",
      "pid": "nf",
      "provider": "Netflix",
      "url": "https://www.netflix.com/de/title/1056189",
      "seasonurl": "",
      "episodeurl": "",
      "language": "Deutsch",
      "subtitles": "Deutsch\nEnglisch\nFranzösisch\nRussisch\nTürkisch\nUkrainisch",
      "audio": "Dolby Digital 5.1",
      "runtime": "109",
      "fsk": "16",
    },
    {
        "id": "6835273",
        "tmdb": "1624",
        "imdb_id": "119528",
        "title": "Der Dummschwätzer",
        "otitle": "Liar Liar",
        "original": false,
        "serie": false,
        "season": "0",
        "episode": "0",
        "episodetitle": "",
        "oepisodetitle": "",
        "year": "1997",
        "directors": "Tom Shadyac",
        "actors": "Jim Carrey, Maura Tierney, Justin Cooper, Cary Elwes, Anne Haney, Jennifer Tilly, Amanda Donohoe, Jason Bernard, Swoosie Kurtz, Mitchell Ryan",
        "companies": "",
        "countries": "",
        "genres": "Comedies, Herzergreifend, Ulkig, Courtroom Movies",
        "channel": "",
        "banners": "http://www.vodster.de/db/w780/o8YhSfSEEJFyiwiBBQYbG6vGU6T.jpg",
        "posters": "http://www.vodster.de/db/w500/xP6haAyqCUryg6gbJ05Lzs5t5Ea.jpg, http://www.vodster.de/db/w500/foqDlrAbNmKFI3J7yqCZ4GzSvVI.jpg, http://www.vodster.de/db/w500/mTMOn9ZJMWZ7r5lRd1xzTxck1Py.jpg, http://www.vodster.de/db/w500/rHlfcY20LKrCx2ONNRwQEsKhDJc.jpg, http://www.vodster.de/db/w500/2Pzk04Ke34OyDZFlew2PXj994Sn.jpg",
        "pid": "nf",
        "provider": "Netflix",
        "url": "https://www.netflix.com/de/title/1152469",
        "seasonurl": "",
        "episodeurl": "",
        "language": "Deutsch",
        "subtitles": "Deutsch\nEnglisch\nFranzösisch\nRussisch\nTürkisch\nUkrainisch",
        "audio": "Dolby Digital 5.1",
        "runtime": "86",
        "fsk": "6",
    }
  ]


  private DUMMY_SERIES_OFFERS: Offer[] = [
    {
      "id": "8596867866",
      "tvdb": "73244",
      "imdb_id": "386676",
      "imdb_episode_id": "1248740",
      "title": "Das Büro",
      "otitle": "The Office (U.S.)",
      "original": false,
      "serie": true,
      "season": "5",
      "episode": "17",
      "episodetitle": "Die Vortragsreihe: Teil 2",
      "oepisodetitle": "Lecture Circuit: Part 2",
      "year": "2008",
      "directors": "Greg Daniels, Ricky Gervais, Stephen Merchant",
      "actors": "Steve Carell, John Krasinski, Jenna Fischer, Rainn Wilson, B.J. Novak, Ed Helms, Brian Baumgartner, David Denman, Creed Bratton, Kate Flannery, Mindy Kaling, Angela Kinsey, Paul Lieberstein, Oscar Nuñez, Phyllis Smith",
      "companies": "",
      "countries": "",
      "genres": "TV Comedies, Sitcoms, US TV Shows",
      "channel": "",
      "banners": "http://www.vodster.de/db/fanart/original/73244-27.jpg, http://www.vodster.de/db/fanart/original/73244-8.jpg, http://www.vodster.de/db/fanart/original/73244-10.jpg, http://www.vodster.de/db/series/73244/backgrounds/5e8f48feddd65.jpg, http://www.vodster.de/db/fanart/original/73244-7.jpg",
      "pid": "nf",
      "provider": "Netflix",
      "url": "https://www.netflix.com/de/title/70136120",
      "seasonurl": "https://www.netflix.com/watch/70095172",
      "episodeurl": "https://www.netflix.com/watch/70126237",
      "language": "Italienisch",
      "subtitles": "Deutsch\nEnglisch\nFranzösisch\nHolländisch\nRussisch\nTürkisch",
      "audio": "Dolby Pro Logic",
      "runtime": "21",
      "fsk": "12",
    },
    {
        "id": "8596867868",
        "tvdb": "73244",
        "imdb_id": "386676",
        "imdb_episode_id": "1248740",
        "title": "Das Büro",
        "otitle": "The Office (U.S.)",
        "original": false,
        "serie": true,
        "season": "5",
        "episode": "17",
        "episodetitle": "Die Vortragsreihe: Teil 2",
        "oepisodetitle": "Lecture Circuit: Part 2",
        "year": "2008",
        "directors": "Greg Daniels, Ricky Gervais, Stephen Merchant",
        "actors": "Steve Carell, John Krasinski, Jenna Fischer, Rainn Wilson, B.J. Novak, Ed Helms, Brian Baumgartner, David Denman, Creed Bratton, Kate Flannery, Mindy Kaling, Angela Kinsey, Paul Lieberstein, Oscar Nuñez, Phyllis Smith",
        "companies": "",
        "countries": "",
        "genres": "TV Comedies, Sitcoms, US TV Shows",
        "channel": "",
        "banners": "http://www.vodster.de/db/fanart/original/73244-27.jpg, http://www.vodster.de/db/fanart/original/73244-8.jpg, http://www.vodster.de/db/fanart/original/73244-10.jpg, http://www.vodster.de/db/series/73244/backgrounds/5e8f48feddd65.jpg, http://www.vodster.de/db/fanart/original/73244-7.jpg",
        "pid": "nf",
        "provider": "Netflix",
        "url": "https://www.netflix.com/de/title/70136120",
        "seasonurl": "https://www.netflix.com/watch/70095172",
        "episodeurl": "https://www.netflix.com/watch/70126237",
        "language": "Türkisch",
        "subtitles": "Deutsch\nEnglisch\nFranzösisch\nHolländisch\nRussisch\nTürkisch",
        "audio": "Dolby Pro Logic",
        "runtime": "21",
        "fsk": "12",
    }
  ];
}


interface GiphyResponse {
  data: [
    {
      id: string;
    }
  ]
}
