import { ModalController } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Offer } from 'src/app/models/offer.model';
import { OffersService } from 'src/app/services/offers.service';
import { CommentListComponent } from '../modals/comment-list/comment-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-scroller',
  templateUrl: './video-scroller.component.html',
  styleUrls: ['./video-scroller.component.scss'],
})
export class VideoScrollerComponent implements OnInit, AfterViewInit {
  @Input() type: "movie" | "series" = "movie";

  offers: Offer[] = [];
  comments = ["Super fun movie", "Sucks"];

  @ViewChild('flipper') flipper: ElementRef

  public review: string[] = [
    'Lorem ipsum solor et dilor',
    'liked it very much',
    'Shit was bussin'
  ]
  public reviewIndex = 0
  private interval: any = null
  public animateFlipper = false

  public startX?: number
  public startY?: number
  public endX?: number
  public endY?: number


  constructor(
    private offersService: OffersService,
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private router: Router
  ) { }

  public touchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX
    this.startY = event.touches[0].clientY
  }

  public touchMove(event: TouchEvent) {
    this.endX = event.touches[0].clientX
    this.endY = event.touches[0].clientY
  }

  public touchEnd(event: TouchEvent) {
    let threshold = 100
    if (Math.abs(this.startX! - this.endX!) > threshold && Math.abs(this.startY! - this.endY!) <= threshold) {
      if (this.startX! - this.endX! > 0) {
        console.log("left")
        this.router.navigate(['/movies'])
      } else {
        console.log("right")
        this.router.navigate(['/series'])
      }
    }
  }

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

  private scrollIntoView(i: number) {
    let element = document.getElementById('offer-' + i)!
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  public rememberWatched(i: number, id: string) {
    let watchedMedia: string[] = []
    if (localStorage.getItem('watchedMedia')) {
      watchedMedia = JSON.parse(localStorage.getItem('watchedMedia')!)
    }
    if (!watchedMedia.includes(id)) {
      watchedMedia.push(id)
      this.scrollIntoView(i + 1)
    } else {
      watchedMedia.splice(watchedMedia.indexOf(id), 1)
    }
    localStorage.setItem('watchedMedia', JSON.stringify(watchedMedia))
  }

  public hasWatched(id: string): boolean {
    if (localStorage.getItem('watchedMedia')) {
      let watchedMedia: string[] = JSON.parse(localStorage.getItem('watchedMedia')!)
      return watchedMedia.includes(id)
    }
    return false
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

  openCommentModal(offer: Offer) {
    this.modalCtrl
      .create({
        component: CommentListComponent,
        id: "comment-list-modal",
        componentProps: {
          offer: offer
        },
        cssClass: "comment-list-modal"
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  getProviderIcon(offer: Offer) {
    if (offer.pid === "nf") {
      return "assets/providers/netflix.png";
    } else {
      return "https://ionicframework.com/docs/img/demos/avatar.svg";
    }
  }
}
