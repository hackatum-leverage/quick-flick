import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('flipper') flipper: ElementRef

  public review: string[] = [
    'Lorem ipsum solor et dilor',
    'liked it very much',
    'Shit was bussin'
  ]
  public reviewIndex = 0
  private interval: any = null
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
    this.interval = setInterval(() => {
      this.flipper.nativeElement.classList.add('animate')
      this.nextReview()
      setTimeout(() => {
        this.flipper.nativeElement.classList.remove('animate')
      }, 2000)
    }, 3000)
  }

  nextReview() {
    if (this.reviewIndex < this.review.length - 1) {
      this.reviewIndex++
    } else {
      clearInterval(this.interval)
    }
  }

  public share(url: string) {
    navigator.share({ url: url })
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
