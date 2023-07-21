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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
