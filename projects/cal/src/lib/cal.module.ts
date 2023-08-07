import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  ControlRightComponent,
  KcCalComponent,
  KcCalDayComponent,
  KcCalDaysComponent,
  KcCalMonthComponent,
  KcCalWeekComponent,
  KcControlLeftComponent,
} from './components';
import { KcCalDayDirective, KcCalMonthDirective, KcCalWeekDirective } from './directives';

const components = [KcCalComponent, KcCalMonthComponent, KcCalDayComponent, KcCalWeekComponent];
const internalComponents = [KcCalDaysComponent];

const directives = [KcCalWeekDirective, KcCalDayDirective, KcCalMonthDirective];

@NgModule({
  declarations: [...internalComponents, ...components, ...directives, KcControlLeftComponent, ControlRightComponent],
  imports: [NgIf, NgFor, AsyncPipe, DatePipe],
  exports: [...components, ...directives],
})
export class KcCalModule {}
