import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcError, KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { ExtendsComponent, ExtendsFormFieldComponent } from './components';
import { FormFieldRoutingModule } from './form-field-routing.module';
import { FormFieldComponent } from './form-field.component';

@NgModule({
  declarations: [FormFieldComponent, ExtendsComponent, ExtendsFormFieldComponent],
  imports: [CommonModule, FormFieldRoutingModule, FormsModule, ReactiveFormsModule, KcFormField, KcInput, KcError],
})
export class FormFieldModule {}
