import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { GridEventType, KcGridItem } from '../../types';

type Context = { $implicit: KcGridItem; id: symbol; event: GridEventType };

@Directive({
  selector: '[kcGridPreview]',
})
export class PreviewDirective {
  private _evr?: EmbeddedViewRef<Context>;

  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(id: symbol, item: KcGridItem, event: GridEventType): void {
    if (this._evr) return this._rerender(id, item, event);

    this._evr = this.viewContainer.createEmbeddedView(this.template, { $implicit: { ...item }, id, event });
  }

  destroy(): void {
    this._evr?.destroy();
    this._evr = undefined;
  }

  private _rerender(id: symbol, { col, row, cols, rows }: KcGridItem, event: GridEventType): void {
    this._evr!.context.id = id;
    this._evr!.context.event = event;

    this._evr!.context.$implicit = {
      ...this._evr!.context.$implicit,
      col,
      row,
      cols,
      rows,
    };

    this._evr!.detectChanges();
  }
}
