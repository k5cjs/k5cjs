import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalTwoSidesComponent } from './cal-two-sides.component';

const routes: Routes = [
  {
    path: '',
    component: CalTwoSidesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalTwoSidesRoutingModule {}
