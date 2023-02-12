import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { KcGroupComponent, KcOptionComponent, KcOptionsComponent, KcValueComponent } from './components';
import {
  KcClearDirective,
  KcCloseDirective,
  KcDeselectAllDirective,
  KcGroupDirective,
  KcOptionDirective,
  KcOptionsDirective,
  KcOriginDirective,
  KcSelectAllDirective,
  KcSubmitDirective,
  KcToggleDirective,
  KcValueDirective,
} from './directives';
import { KcSelectComponent } from './kc-select.component';

const components = [KcSelectComponent, KcValueComponent, KcGroupComponent, KcOptionsComponent, KcOptionComponent];

const directives = [
  KcValueDirective,
  KcGroupDirective,
  KcOptionsDirective,
  KcOptionDirective,
  KcCloseDirective,
  KcSelectAllDirective,
  KcDeselectAllDirective,
  KcToggleDirective,
  KcClearDirective,
  KcSubmitDirective,
  KcOriginDirective,
];

@NgModule({
  declarations: [...components, ...directives],
  imports: [CommonModule, OverlayModule],
  exports: [...components, ...directives],
})
export class KcSelectModule {}
