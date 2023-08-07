import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalScrollComponent } from './cal-scroll.component';

const routes: Routes = [
  {
    path: '',
    component: CalScrollComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalScrollRoutingModule {}
