import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { CustomInputComponent } from './components';
import { InputRoutingModule } from './input-routing.module';
import { InputComponent } from './input.component';

@NgModule({
  declarations: [InputComponent, CustomInputComponent],
  imports: [CommonModule, InputRoutingModule, FormsModule, ReactiveFormsModule, KcFormField, KcInput],
})
export class InputModule {}
