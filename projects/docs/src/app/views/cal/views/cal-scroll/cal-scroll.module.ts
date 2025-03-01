import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcCalModule } from '@k5cjs/cal';

import { CalScrollRoutingModule } from './cal-scroll-routing.module';
import { CalScrollComponent } from './cal-scroll.component';
import { CalComponent } from './components';
import { MonthComponent } from './components/month/month.component';

@NgModule({
  declarations: [CalScrollComponent, CalComponent, MonthComponent],
  imports: [
    CommonModule,
    CalScrollRoutingModule,
    KcCalModule,
    ScrollingModule,
    PortalModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CalScrollModule {}
