import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Offer } from 'src/app/models/offer.model';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-video-scroller',
  templateUrl: './video-scroller.component.html',
  styleUrls: ['./video-scroller.component.scss'],
})
export class VideoScrollerComponent implements OnInit, AfterViewInit {
  @Input() type: "movie" | "series" = "movie";

  offers: Offer[] = [];

  public review: string[] = [
    'Lorem ipsum solor et dilor',
    'liked it very much',
    'Shit was bussin'
  ]
  public reviewIndex = 0
  private timeout: any = null
  public animateFlipper = false

  constructor(
    private offersService: OffersService
  ) { }

  ngOnInit() {
    if (this.type === "movie") {
      this.offersService.getMovies().then((movies) => {
        this.offers = movies
      })
    } else {
      this.offersService.getSeries().then((series) => {
        this.offers = series
      })
    }
  }

  ngAfterViewInit() {
    this.timeout = setInterval(() => {
      this.nextReview()
    }, 3000)
  }

  nextReview() {
    this.animateFlipper = false
    if (this.reviewIndex < this.review.length - 1) {
      this.reviewIndex++
      this.animateFlipper = true
    } else {
      this.timeout.invalidate()
    }
  }

  public share(url: string) {
    navigator.share({url: url})
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
