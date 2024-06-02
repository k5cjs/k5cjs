import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

type Context = { $implicit: Record<PropertyKey, unknown> };

@Directive({
  selector: '[libGrid]',
})
export class GridDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(context: Record<PropertyKey, unknown>): EmbeddedViewRef<unknown> {
    return this.viewContainer.createEmbeddedView(this.template, { $implicit: context });
  }
}
