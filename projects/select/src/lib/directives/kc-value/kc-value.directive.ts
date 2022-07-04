import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[kcValue]' })
export class KcValueDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
