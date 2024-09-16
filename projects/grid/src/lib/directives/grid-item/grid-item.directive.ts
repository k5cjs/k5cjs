import { Directive, EmbeddedViewRef, Injector, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

import { KcGridItem } from '../../types';
import { GRID_ITEM_ID } from '../../tokens';

type Context<T = void> = { $implicit: KcGridItem<T>; id: symbol };

@Directive({
  selector: '[kcGridItem]',
})
export class GridItemDirective<T = void> {
  @Input('kcGridItemType') public type!: T;

  public template = inject(TemplateRef<Context<T>>);
  public viewContainer = inject(ViewContainerRef);

  static ngTemplateContextGuard<T>(_dir: GridItemDirective<T>, _ctx: Context<T>): _ctx is Context<T> {
    return true;
  }
}
