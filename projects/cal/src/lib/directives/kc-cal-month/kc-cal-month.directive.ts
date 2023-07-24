import { Directive, TemplateRef } from '@angular/core';

export interface CalMonthDef<T> {
  template: TemplateRef<T>;
}

@Directive({ selector: '[kc-cal-month]' })
export class KcCalMonthDirective<T = unknown> implements CalMonthDef<T> {
  constructor(public template: TemplateRef<T>) {}
}
