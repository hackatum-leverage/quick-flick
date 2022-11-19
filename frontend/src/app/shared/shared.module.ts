import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoScrollerComponent } from './video-scroller/video-scroller.component';



@NgModule({
  declarations: [
    VideoScrollerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VideoScrollerComponent
  ]
})
export class SharedModule { }
