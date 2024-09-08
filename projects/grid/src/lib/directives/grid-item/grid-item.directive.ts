import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { Cell } from '../../types';

type Context<T = void> = { $implicit: Cell<T> };

@Directive({
  selector: '[kcGridItem]',
})
export class GridItemDirective<T> {
  @Input('kcGridItemType') public type!: T;

  constructor(public template: TemplateRef<Context<T>>, public viewContainer: ViewContainerRef) {}

  render(context: Cell<T>): EmbeddedViewRef<Context<T>> {
    return this.viewContainer.createEmbeddedView<Context<T>>(this.template, { $implicit: { ...context } });
  }

  static ngTemplateContextGuard<T>(_dir: GridItemDirective<T>, _ctx: Context<T>): _ctx is Context<T> {
    return true;
  }
}
