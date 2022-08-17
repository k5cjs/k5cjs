import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  DesignedComponent,
  GroupBooleanComponent,
  GroupBooleanToggleComponent,
  GroupMultipleComponent,
  GroupSearchComponent,
  SimpleModalComponent,
  SimpleMultipleComponent,
  SimpleMultipleDeselectAllComponent,
  SimpleMultipleSelectAllComponent,
  SimpleMultipleSubmitComponent,
  SimpleMultipleToggleComponent,
  SimpleSearchComponent,
  SimpleWithoutFormControlComponent,
  SimpleWrappedComponent,
} from './components';
import { SelectComponent } from './select.component';

const routes: Routes = [
  {
    path: '',
    component: SelectComponent,
    children: [
      {
        path: 'simple-multiple',
        component: SimpleMultipleComponent,
      },
      {
        path: 'simple-multiple-select-all',
        component: SimpleMultipleSelectAllComponent,
      },
      {
        path: 'simple-multiple-deselect-all',
        component: SimpleMultipleDeselectAllComponent,
      },
      {
        path: 'simple-multiple-toggle',
        component: SimpleMultipleToggleComponent,
      },
      {
        path: 'simple-multiple-submit',
        component: SimpleMultipleSubmitComponent,
      },
      {
        path: 'simple-modal',
        component: SimpleModalComponent,
      },
      {
        path: 'simple-search',
        component: SimpleSearchComponent,
      },
      {
        path: 'simple-wrapped',
        component: SimpleWrappedComponent,
      },
      {
        path: 'simple-without-form-control',
        component: SimpleWithoutFormControlComponent,
      },
      {
        path: 'group-search',
        component: GroupSearchComponent,
      },
      {
        path: 'group-multiple',
        component: GroupMultipleComponent,
      },
      {
        path: 'group-boolean',
        component: GroupBooleanComponent,
      },
      {
        path: 'group-boolean-toggle',
        component: GroupBooleanToggleComponent,
      },
      {
        path: 'designed',
        component: DesignedComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectRoutingModule {}
