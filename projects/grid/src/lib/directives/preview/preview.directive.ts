import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { GridEventType, KcGridItem } from '../../types';

type Context = { $implicit: KcGridItem; id: symbol; event: GridEventType };

@Directive({
  selector: '[kcGridPreview]',
})
export class PreviewDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(id: symbol, item: KcGridItem, event: GridEventType): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView(this.template, { $implicit: { ...item }, id, event });
  }
}
