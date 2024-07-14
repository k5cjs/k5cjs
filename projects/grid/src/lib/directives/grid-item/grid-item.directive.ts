import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { Cell } from '../../types';

type Context = { $implicit: Cell };

@Directive({
  selector: '[gridItem]',
})
export class GridItemDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(context: Cell): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView<Context>(this.template, { $implicit: { ...context } });
  }
}
