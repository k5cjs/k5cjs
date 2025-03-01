import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcSelectModule } from '@k5cjs/select';

import { SelectSimpleComponent } from './select-simple.component';

@NgModule({
  declarations: [SelectSimpleComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, KcSelectModule],
})
export class SelectSimpleModule {}
