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
      this.offersService.getMovies().then((movies) => {
        this.offers = movies;
      });
    } else {
      this.offersService.getSeries().then((series) => {
        this.offers = series;
      });
    }
  }

  public share() {
    navigator.share({ url: 'https://quickflick-e3121.web.app' })
  }

  loadNextOffers() {
    if (this.type === "movie") {
      this.offersService.getMovies().then((movies) => {
        this.offers.push(...movies);
      });

    } else {
      this.offersService.getSeries().then((series) => {
        this.offers.push(...series);
      });
    }
  }
}
