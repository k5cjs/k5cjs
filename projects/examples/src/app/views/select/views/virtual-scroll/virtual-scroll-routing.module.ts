import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VirtualScrollComponent } from './virtual-scroll.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualScrollComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualScrollRoutingModule {}
