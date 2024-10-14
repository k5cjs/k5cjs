import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcGridItem } from '../../types';

type Context = { $implicit: KcGridItem; id: symbol };

@Directive({
  selector: '[kcGrid]',
})
export class GridDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(id: symbol, context: KcGridItem): EmbeddedViewRef<Context> {
    const embedded = this.viewContainer.createEmbeddedView<Context>(this.template, {
      $implicit: {
        ...context,
        // tmpRow: context.row,
        // set row(value) {
        //   console.trace('set row', value, id.toString());
        //   this.tmpRow = value;
        // },
        // get row() {
        //   console.log('get row', context.row, id.toString());
        //   return this.tmpRow;
        // },
        // set rows(value) {
        //   console.trace('set', value, id.toString());
        // },
        // get rows() {
        //   console.log('get', context.rows, id.toString());
        //   return context.rows;
        // },
      },
      id,
    });

    return embedded;
  }
}
