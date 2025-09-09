import { Directive, TemplateRef } from '@angular/core';

export interface CalWeekDef<T> {
  template: TemplateRef<T>;
}

@Directive({
    selector: '[kcCalWeek], [kc-cal-week]',
    standalone: false
})
export class KcCalWeekDirective<T = unknown> implements CalWeekDef<T> {
  constructor(public template: TemplateRef<T>) {}
}
