import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcGridItem } from '../../types';

type Context = { $implicit: KcGridItem; id: symbol };

@Directive({
  selector: '[kcGrid]',
})
export class GridDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(id: symbol, context: KcGridItem): EmbeddedViewRef<Context> {
    const embedded = this.viewContainer.createEmbeddedView<Context>(this.template, { $implicit: { ...context }, id });

    return embedded;
  }
}
