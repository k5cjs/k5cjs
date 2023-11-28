import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToggleGroupComponent } from './toggle-group.component';

const routes: Routes = [
  {
    path: '',
    component: ToggleGroupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToggleGroupRoutingModule {}
