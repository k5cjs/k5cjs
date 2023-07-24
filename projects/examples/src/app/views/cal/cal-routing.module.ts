import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalComponent } from './cal.component';

const routes: Routes = [
  {
    path: '',
    component: CalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalRoutingModule {}
