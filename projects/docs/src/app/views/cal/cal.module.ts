import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import fr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';

import { KcCalModule } from '@k5cjs/cal';

registerLocaleData(en);
registerLocaleData(fr);

import { CalRoutingModule } from './cal-routing.module';
import { CalComponent } from './cal.component';

@NgModule({
  declarations: [CalComponent],
  imports: [CommonModule, CalRoutingModule, KcCalModule],
})
export class CalModule {}
