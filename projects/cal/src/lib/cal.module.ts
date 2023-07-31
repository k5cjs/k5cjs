import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { KcCalComponent, KcCalDayComponent, KcCalDaysNameComponent, KcCalWeekComponent } from './components';
import { ControlLeftComponent } from './components/control-left/control-left.component';
import { ControlRightComponent } from './components/control-right/control-right.component';
import { KcCalDayDirective, KcCalMonthDirective, KcCalWeekDirective, KcCalWeekOutletDirective } from './directives';
import { KcCal, KcCalSelector } from './services';
import { KC_CAL_SELECTOR } from './tokens';

const components = [KcCalComponent, KcCalDayComponent, KcCalWeekComponent];
const internalComponents = [KcCalDaysNameComponent];

const directives = [KcCalWeekDirective, KcCalDayDirective, KcCalMonthDirective];
const internalDirectives = [KcCalWeekOutletDirective];

@NgModule({
  declarations: [
    ...internalComponents,
    ...internalDirectives,
    ...components,
    ...directives,
    ControlLeftComponent,
    ControlRightComponent,
  ],
  imports: [CommonModule, PortalModule],
  exports: [...components, ...directives],
  providers: [
    {
      provide: KC_CAL_SELECTOR,
      useClass: KcCalSelector,
    },
    KcCal,
  ],
})
export class KcCalModule {}
