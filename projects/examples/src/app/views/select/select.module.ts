import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcSelectModule } from '@k5cjs/select';

import {
  CustomPlaceHolderComponent,
  DefaultPlaceHolderComponent,
  DesignedComponent,
  ExtendOptionComponent,
  GroupBooleanComponent,
  GroupBooleanToggleComponent,
  GroupMultipleComponent,
  GroupSearchComponent,
  OptionComponent,
  OptionToggleComponent,
  OptionsComponent,
  SimpleModalComponent,
  SimpleMultipleComponent,
  SimpleMultipleDeselectAllComponent,
  SimpleMultipleSelectAllComponent,
  SimpleMultipleSubmitComponent,
  SimpleMultipleToggleComponent,
  SimpleSearchComponent,
  SimpleWithoutFormControlComponent,
  SimpleWrappedComponent,
  SimpleWrappedSharedComponent,
  ValueComponent,
} from './components';
import { SelectRoutingModule } from './select-routing.module';
import { SelectComponent } from './select.component';

@NgModule({
  declarations: [
    SelectComponent,
    SimpleMultipleComponent,
    SimpleModalComponent,
    DesignedComponent,
    ValueComponent,
    OptionsComponent,
    OptionComponent,
    SimpleSearchComponent,
    GroupSearchComponent,
    SimpleMultipleSelectAllComponent,
    SimpleMultipleDeselectAllComponent,
    SimpleMultipleToggleComponent,
    SimpleWrappedComponent,
    SimpleWrappedSharedComponent,
    SimpleWithoutFormControlComponent,
    SimpleMultipleSubmitComponent,
    GroupMultipleComponent,
    ExtendOptionComponent,
    GroupBooleanComponent,
    GroupBooleanToggleComponent,
    OptionToggleComponent,
    DefaultPlaceHolderComponent,
    CustomPlaceHolderComponent
  ],
  imports: [CommonModule, SelectRoutingModule, KcSelectModule, FormsModule, ReactiveFormsModule],
})
export class SelectModule {}
