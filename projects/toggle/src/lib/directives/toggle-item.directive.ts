import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcToggleItemContext } from '../types';

@Directive({
  selector: '[kcToggleItem], [toggleItem]',
  exportAs: 'toggleItem',
})
export class KcToggleItemDirective<T> {
  constructor(public templateRef: TemplateRef<KcToggleItemContext<T>>, public viewContainerRef: ViewContainerRef) {}
}
