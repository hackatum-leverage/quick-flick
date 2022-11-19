import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoScrollerComponent } from './video-scroller/video-scroller.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    VideoScrollerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    VideoScrollerComponent
  ]
})
export class SharedModule { }
