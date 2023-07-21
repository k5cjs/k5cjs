import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[kc-dropdown]',
})
export class KcDropdownOptionsDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
