import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { Offer } from 'src/app/models/offer.model';
import { OffersService } from 'src/app/services/offers.service';
import { CommentListComponent } from '../modals/comment-list/comment-list.component';

@Component({
  selector: 'app-video-scroller',
  templateUrl: './video-scroller.component.html',
  styleUrls: ['./video-scroller.component.scss'],
})
export class VideoScrollerComponent implements OnInit {
  @Input() type: "movie" | "series" = "movie";

  offers: Offer[] = [];
  comments = ["Super fun movie", "Sucks"];

  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private offersService: OffersService,
    private http: HttpClient,
    private modalCtrl: ModalController
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
}
