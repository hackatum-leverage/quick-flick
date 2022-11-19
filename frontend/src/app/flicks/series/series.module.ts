import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeriesPageRoutingModule } from './series-routing.module';

import { SeriesPage } from './series.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeriesPageRoutingModule,
    SharedModule
  ],
  declarations: [SeriesPage]
})
export class SeriesPageModule {}
