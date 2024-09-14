import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcGridService } from '../../services';
import { Cell } from '../../types';

type Context = { $implicit: Cell & { grid: KcGridService } };

@Directive({
  selector: '[kcGrid]',
})
export class GridDirective {
  constructor(public template: TemplateRef<Context>, public viewContainer: ViewContainerRef) {}

  render(context: Cell & { grid: KcGridService }): EmbeddedViewRef<Context> {
    return this.viewContainer.createEmbeddedView<Context>(this.template, { $implicit: { ...context } });
  }
}
