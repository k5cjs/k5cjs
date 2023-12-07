import { NgModule } from '@angular/core';

import { KcToggleGroupDirective, KcToggleItemDirective } from './directives';

const externalComponents = [KcToggleGroupDirective, KcToggleItemDirective];

@NgModule({
  declarations: [...externalComponents],
  imports: [],
  exports: [...externalComponents],
})
export class KcToggleGroupModule {}
