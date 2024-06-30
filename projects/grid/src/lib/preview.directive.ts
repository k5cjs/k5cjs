import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { Cell } from './cell.type';

type Context = { $implicit: Cell };

@Directive({
  selector: '[libPreview]',
})
export class PreviewDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(context: Cell): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView(this.template, { $implicit: { ...context } });
  }
}
