import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { KcToggleGroupModule } from 'projects/toggle-group/src/public-api';

import { ToggleGroupRoutingModule } from './toggle-group-routing.module';
import { ToggleGroupComponent } from './toggle-group.component';

@NgModule({
  declarations: [ToggleGroupComponent],
  imports: [CommonModule, ToggleGroupRoutingModule, KcToggleGroupModule, ReactiveFormsModule],
})
export class ToggleGroupModule {}
