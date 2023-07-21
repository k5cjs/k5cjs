import { NgModule } from '@angular/core';

import {
  KcDropdownComponent,
  KcDropdownOptionBaseComponent,
  KcDropdownOptionsComponent,
  KcInternalDropdownComponent,
} from './components';
import { KcDropdownOptionsDirective } from './directives';

const components = [KcDropdownComponent];

const internalComponents = [KcInternalDropdownComponent, KcDropdownOptionBaseComponent, KcDropdownOptionsComponent];

const directives = [KcDropdownOptionsDirective];

@NgModule({
  declarations: [...components, ...internalComponents, ...directives],
  imports: [],
  exports: [...components, ...directives],
})
export class KcDropdownModule {}
