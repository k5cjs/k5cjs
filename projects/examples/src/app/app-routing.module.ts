import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    path: 'form-field',
    loadChildren: () => import('./views/form-field'),
  },
  {
    path: 'toggle-group',
    loadChildren: () => import('./views/toggle-group'),
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
