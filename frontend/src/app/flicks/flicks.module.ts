import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlicksPageRoutingModule } from './flicks-routing.module';

import { FlicksPage } from './flicks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlicksPageRoutingModule
  ],
  declarations: [FlicksPage]
})
export class FlicksPageModule {}
