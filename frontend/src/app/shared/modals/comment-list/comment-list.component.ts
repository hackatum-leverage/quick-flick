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
    name: "Snaregian",
    review: "My new favorite movie, soo good!!"
  }, {
    name: "Leofwine_draca",
    review: "Watched this movie with my friends. Sounded all quiet impressed."
  }, {
    name: "Hitchcoc",
    review: "I liked it, with a pretty nice setting"
  }, {
    name: "TheConnoisseurReviews",
    review: "Fantastic effects with great actors."
  }, {
    name: "copyright908",
    review: "Looooved it! 100% recommendation"
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
