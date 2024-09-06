import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableVirtualScrollComponent } from './views/table-virtual-scroll/table-virtual-scroll.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./views/home').then((m) => m.HomeModule),
  },
  {
    path: 'select',
    loadChildren: () => import('./views/select').then((m) => m.SelectModule),
  },
  {
    path: 'input',
    loadChildren: () => import('./views/input').then((m) => m.InputModule),
  },
  {
    path: 'dropdown',
    loadChildren: () => import('./views/dropdown'),
  },
  {
    path: 'cal',
    loadChildren: () => import('./views/cal'),
  },
  {
    path: 'table-virtual-scroll',
    component: TableVirtualScrollComponent,
  },
  {
    path: 'form-field',
    loadChildren: () => import('./views/form-field'),
  },
  {
    path: 'toggle',
    loadChildren: () => import('./views/toggle'),
  },
  {
    path: 'fake-progress-bar',
    loadChildren: () => import('./views/fake-progress-bar'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
