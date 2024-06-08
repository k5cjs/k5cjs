import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { Cell } from './cell.type';
import { Grid } from './grid';

type Context = { $implicit: Cell & { grid: Grid } };

@Directive({
  selector: '[libGrid]',
})
export class GridDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(context: Omit<Cell, 'id'> & { grid: Grid }): EmbeddedViewRef<Context> {
    const id = Symbol('id');

    return this.viewContainer.createEmbeddedView<Context>(this.template, { $implicit: { id, ...context } });
  }
}
