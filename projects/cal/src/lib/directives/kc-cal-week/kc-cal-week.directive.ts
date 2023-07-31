import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

export interface CalWeekDef<T> {
  template: TemplateRef<T>;
  viewRef: ViewContainerRef;
}

@Directive({ selector: '[kc-cal-week]' })
export class KcCalWeekDirective<T = unknown> implements CalWeekDef<T> {
  constructor(public viewRef: ViewContainerRef, public template: TemplateRef<T>) {}
}
