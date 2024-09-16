import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { GridEvent, KcGridItem } from '../../types';

type Context = { $implicit: KcGridItem; id: symbol; event: GridEvent };

@Directive({
  selector: '[kcGridPreview]',
})
export class PreviewDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(id: symbol, item: KcGridItem, event: GridEvent): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView(this.template, { $implicit: { ...item }, id, event });
  }
}
