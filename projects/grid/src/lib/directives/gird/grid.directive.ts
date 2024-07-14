import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { Grid } from '../../helpers';
import { Cell } from '../../types';

type Context = { $implicit: Cell & { grid: Grid } };

@Directive({
  selector: '[libGrid]',
})
export class GridDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(context: Cell & { grid: Grid }): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView<Context>(this.template, { $implicit: { ...context } });
  }
}
