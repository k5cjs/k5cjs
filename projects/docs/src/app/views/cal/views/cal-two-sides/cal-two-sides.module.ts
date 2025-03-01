import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcCalModule } from '@k5cjs/cal';

import { CalTwoSidesRoutingModule } from './cal-two-sides-routing.module';
import { CalTwoSidesComponent } from './cal-two-sides.component';
import { CalComponent } from './components';

@NgModule({
  declarations: [CalTwoSidesComponent, CalComponent],
  imports: [CommonModule, CalTwoSidesRoutingModule, KcCalModule, FormsModule, ReactiveFormsModule, PortalModule],
})
export class CalTwoSidesModule {}
