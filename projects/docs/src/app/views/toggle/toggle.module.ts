import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { KcToggleModule } from '@k5cjs/toggle';

import { ToggleGroupRoutingModule } from './toggle-routing.module';
import { ToggleComponent } from './toggle.component';

@NgModule({
  declarations: [ToggleComponent],
  imports: [CommonModule, ToggleGroupRoutingModule, KcToggleModule, ReactiveFormsModule],
})
export class ToggleGroupModule {}
