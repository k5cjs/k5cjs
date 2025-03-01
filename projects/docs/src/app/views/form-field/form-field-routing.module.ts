import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExtendsComponent } from './components';
import { FormFieldComponent } from './form-field.component';

const routes: Routes = [
  {
    path: '',
    component: FormFieldComponent,
  },
  {
    path: 'extends',
    component: ExtendsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormFieldRoutingModule {}
