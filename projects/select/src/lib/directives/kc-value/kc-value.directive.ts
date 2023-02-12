import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[kcValue]' })
export class KcValueDirective {
  constructor(public template: TemplateRef<unknown>, private _cdr: ChangeDetectorRef) {}

  render(viewContainer: ViewContainerRef): void {
    viewContainer.createEmbeddedView(this.template);

    this._cdr.detectChanges();
  }

  clear(viewContainer: ViewContainerRef): void {
    viewContainer.clear();

    this._cdr.detectChanges();
  }
}
