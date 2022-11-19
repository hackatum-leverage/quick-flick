import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoScrollerComponent } from './video-scroller/video-scroller.component';
import { IonicModule } from '@ionic/angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommentListComponent } from './modals/comment-list/comment-list.component';


@NgModule({
  declarations: [
    VideoScrollerComponent,
    CommentListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    InfiniteScrollModule,
  ],
  exports: [
    VideoScrollerComponent,
    CommentListComponent
  ]
})
export class SharedModule { }
