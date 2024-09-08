import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcGrid } from '../../helpers';
import { Cell } from '../../types';

type Context = { $implicit: Cell & { grid: KcGrid } };

@Directive({
  selector: '[kcGrid]',
})
export class GridDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(context: Cell & { grid: KcGrid }): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView<Context>(this.template, { $implicit: { ...context } });
  }
}
