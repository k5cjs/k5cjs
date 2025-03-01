import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { KcDropdownModule } from '@k5cjs/dropdown';

import { DropdownRoutingModule } from './dropdown-routing.module';
import { DropdownComponent } from './dropdown.component';

@NgModule({
  declarations: [DropdownComponent],
  imports: [CommonModule, DropdownRoutingModule, KcDropdownModule],
})
export class DropdownModule {}
