import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[kcPlaceHolder]' })
export class KcPlaceHolderDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
