import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcFormField } from '@k5cjs/form-field';
import { KcSelectModule } from '@k5cjs/select';

import { FormFieldRoutingModule } from './form-field-routing.module';
import { FormFieldComponent } from './form-field.component';

@NgModule({
  declarations: [FormFieldComponent],
  imports: [CommonModule, FormFieldRoutingModule, KcSelectModule, ReactiveFormsModule, FormsModule, KcFormField],
})
export class FormFieldModule {}
