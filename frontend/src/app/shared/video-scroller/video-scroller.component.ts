import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
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
    private offersService: OffersService,
    private renderer: Renderer2
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
      this.nextReview()
    }, 5000)
  }

  nextReview() {
    if (this.reviewIndex < this.review.length - 1) {
      this.flipper.nativeElement.innerHTML = ""
      let newChild = this.renderer.createElement('p')
      newChild.classList.add('flipper')
      newChild.innerHTML = this.review[++this.reviewIndex]
      this.renderer.appendChild(this.flipper.nativeElement, newChild)
    } else {
      clearInterval(this.interval)
    }
  }

  public scrollIntoView(i: number) {
    let element = document.getElementById('offer-' + i)!
    element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
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

  getProviderIcon(offer: Offer) {
    if (offer.pid === "nf") {
      return "assets/providers/netflix.png";
    } else {
      return "https://ionicframework.com/docs/img/demos/avatar.svg";
    }
  }
}
