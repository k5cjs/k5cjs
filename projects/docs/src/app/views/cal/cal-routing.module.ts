import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalComponent } from './cal.component';

const routes: Routes = [
  {
    path: '',
    component: CalComponent,
  },
  {
    path: 'scroll',
    loadChildren: () => import('./views/cal-scroll'),
  },
  {
    path: 'two-sides',
    loadChildren: () => import('./views/cal-two-sides'),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalRoutingModule {}
