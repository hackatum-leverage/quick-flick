import { Component, Input, OnInit } from '@angular/core';
import { Offer } from 'src/app/models/offer.model';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-video-scroller',
  templateUrl: './video-scroller.component.html',
  styleUrls: ['./video-scroller.component.scss'],
})
export class VideoScrollerComponent implements OnInit {
  @Input() type: "movie" | "series" = "movie";

  suggestions = [
    {
      title: 'The Best of 2019',
    }, {
      title: 'The Best of 2020',
    }, {
      title: 'The Best of 2021',
    }
  ]

  offers: Offer[] = [];

  constructor(
    private offersService: OffersService
  ) { }

  ngOnInit() {
    if (this.type === "movie") {
      this.offers = this.offersService.getMovies();
    } else {
      this.offers = this.offersService.getSeries();
    }
  }

}
