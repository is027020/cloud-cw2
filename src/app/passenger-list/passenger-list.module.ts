import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassengerListPageRoutingModule } from './passenger-list-routing.module';

import { PassengerListPage } from './passenger-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassengerListPageRoutingModule
  ],
  declarations: [PassengerListPage]
})
export class PassengerListPageModule {}
