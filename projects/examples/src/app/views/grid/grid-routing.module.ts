import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaginationComponent, SimpleComponent, SimpleScrollXyComponent } from './components';
import { GridComponent } from './grid.component';

const routes: Routes = [
  {
    path: '',
    component: GridComponent,
    children: [
      {
        path: '',
        component: SimpleComponent,
      },
      {
        path: 'scroll-xy',
        component: SimpleScrollXyComponent,
      },
      {
        path: 'pagination',
        component: PaginationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GridRoutingModule {}
