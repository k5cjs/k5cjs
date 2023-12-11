import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcToggleItemContext } from '../types';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[toggleItem]',
  exportAs: 'toggleItem',
})
export class KcToggleItemDirective<T> {
  constructor(public templateRef: TemplateRef<KcToggleItemContext<T>>, public viewContainerRef: ViewContainerRef) {}
}
