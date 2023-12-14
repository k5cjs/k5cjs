import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcError, KcErrors } from '@k5cjs/form-error';
import { KcFormField } from '@k5cjs/form-field';
import { KcScrollError } from '@k5cjs/forms';
import { KcInput } from '@k5cjs/input';

import { ExtendsComponent, ExtendsFormFieldComponent } from './components';
import { InputComponent } from './components/input/input.component';
import { FormFieldRoutingModule } from './form-field-routing.module';
import { FormFieldComponent } from './form-field.component';

@NgModule({
  declarations: [FormFieldComponent, ExtendsComponent, ExtendsFormFieldComponent, InputComponent],
  imports: [
    CommonModule,
    FormFieldRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    KcFormField,
    KcInput,
    KcError,
    KcErrors,
    KcScrollError,
  ],
})
export class FormFieldModule {}
