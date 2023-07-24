import { Directive, TemplateRef } from '@angular/core';

export interface CalDayDef<T> {
  template: TemplateRef<T>;
}

@Directive({ selector: '[kc-cal-day]' })
export class KcCalDayDirective<T = unknown> implements CalDayDef<T> {
  constructor(public template: TemplateRef<T>) {}
}
