import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoScrollerComponent } from './video-scroller/video-scroller.component';
import { IonicModule } from '@ionic/angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    VideoScrollerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    InfiniteScrollModule,
  ],
  exports: [
    VideoScrollerComponent
  ]
})
export class SharedModule { }
