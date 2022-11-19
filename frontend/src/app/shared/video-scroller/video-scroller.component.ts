import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from 'src/app/models/offer.model';
import { OffersService } from 'src/app/services/offers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-scroller',
  templateUrl: './video-scroller.component.html',
  styleUrls: ['./video-scroller.component.scss'],
})
export class VideoScrollerComponent implements OnInit {
  @Input() type: "movie" | "series" = "movie";

  offers: Offer[] = [];

  @ViewChild('iframe') iframe: ElementRef

  constructor(
    private offersService: OffersService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (this.type === "movie") {
      this.offers = this.offersService.getMovies();
    } else {
      this.offers = this.offersService.getSeries();
    }
  }

  public share() {
    navigator.share({ url: 'https://quickflick-e3121.web.app' })
  }

  loadNextOffers() {
    setTimeout(() => {
      console.log('Load new data...');
      if (this.type === "movie") {
        this.offers.push(...this.offersService.getMovies());
      } else {
        this.offers.push(...this.offersService.getSeries());
      }
    }, 500);
  }

  public getGif() {
    // console.log(title)
    // return 'https://i.giphy.com/GULjPncSkMTSHEiWcW.gif'
    // console.log("event")
    console.log("lol")
    // return this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=${environment.giphyAPIKey}&q=wolf+of+wallstreet?limit=1`).toPromise().then((data) => {
    //   let res = data as GiphyResponse
    //   let imageSrc = `https://i.giphy.com/${res.data[0].id}.gif`
    //   return imageSrc
    // })
  }

  public lol() {
    console.log("lol")
  }
}

interface GiphyResponse {
  data: [
    {
      id: string;
    }
  ]
}