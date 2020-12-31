import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassengerListPage } from './passenger-list.page';

const routes: Routes = [
  {
    path: '',
    component: PassengerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassengerListPageRoutingModule {}
