import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReviewComment } from 'src/app/models/comment.model';
import { Offer } from 'src/app/models/offer.model';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  @Input() offer: Offer;
  comments: ReviewComment[] = []

  public isLoading = true

  public mockComments: ReviewComment[] = [{
    name: "Stacy Green",
    review: "My new favorite movie, soo good!!"
  }, {
    name: "Norbert Scott",
    review: "Was funny and entertaining"
  }, {
    name: "Rafaela Smith",
    review: "I liked it, but it was a bit boring"
  }, {
    name: "Olivia Albert",
    review: "Great movie to watch with friends :)"
  }, {
    name: "Liam Miller",
    review: "Would watch it again!"
  }]

  constructor(
    private modalCtrl: ModalController,
    private offersService: OffersService
  ) { }

  ngOnInit() {
    this.offersService.getComments(this.offer).then((comments) => {
      this.comments = comments;
      if (this.comments.length == 0) {
        this.comments = this.mockComments
      }
      this.isLoading = false
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, "cancel", "comment-list-modal");
  }

  public getAvatar(name: string): string {
    let encodedName = encodeURIComponent(name)
    return `https://avatars.dicebear.com/api/open-peeps/${encodedName}.svg`
  }

}
