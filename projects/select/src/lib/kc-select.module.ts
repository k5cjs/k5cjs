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
  KcPlaceHolderDirective,
  KcSelectAllDirective,
  KcSubmitDirective,
  KcToggleDirective,
  KcValueDirective
} from './directives';
import { KcSelectComponent } from './kc-select.component';

@NgModule({
  declarations: [
    KcSelectComponent,
    KcValueComponent,
    KcValueDirective,
    KcOptionComponent,
    KcOptionDirective,
    KcOptionsComponent,
    KcOptionsDirective,
    KcGroupDirective,
    KcGroupComponent,
    KcCloseDirective,
    KcSelectAllDirective,
    KcDeselectAllDirective,
    KcToggleDirective,
    KcClearDirective,
    KcSubmitDirective,
    KcPlaceHolderDirective
  ],
  imports: [CommonModule, OverlayModule],
  exports: [
    KcSelectComponent,
    KcValueComponent,
    KcValueDirective,
    KcOptionComponent,
    KcOptionDirective,
    KcOptionsComponent,
    KcOptionsDirective,
    KcGroupDirective,
    KcGroupComponent,
    KcCloseDirective,
    KcSelectAllDirective,
    KcDeselectAllDirective,
    KcToggleDirective,
    KcClearDirective,
    KcSubmitDirective,
    KcPlaceHolderDirective
  ],
})
export class KcSelectModule {}
