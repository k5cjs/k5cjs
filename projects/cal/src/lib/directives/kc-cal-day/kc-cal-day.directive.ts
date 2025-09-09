import { Directive, TemplateRef } from '@angular/core';

export interface CalDayDef<T> {
  template: TemplateRef<T>;
}

@Directive({
    selector: '[kcCalDay], [kc-cal-day]',
    standalone: false
})
export class KcCalDayDirective<T = unknown> implements CalDayDef<T> {
  constructor(public template: TemplateRef<T>) {}
}
