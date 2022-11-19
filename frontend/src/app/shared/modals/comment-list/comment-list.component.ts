import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Offer } from 'src/app/models/offer.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  @Input() offer: Offer;
  comments = ["Awesome", "Noice"]

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, "cancel", "create-koi-modal");
  }

}
