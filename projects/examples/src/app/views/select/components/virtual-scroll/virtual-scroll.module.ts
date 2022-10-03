import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { KcSelectModule } from '@k5cjs/select';

import { OptionComponent, OptionsComponent } from './components';
import { VirtualScrollRoutingModule } from './virtual-scroll-routing.module';
import { VirtualScrollComponent } from './virtual-scroll.component';

@NgModule({
  declarations: [VirtualScrollComponent, OptionsComponent, OptionComponent],
  imports: [CommonModule, VirtualScrollRoutingModule, ScrollingModule, KcSelectModule, ReactiveFormsModule],
})
export class VirtualScrollModule {}
