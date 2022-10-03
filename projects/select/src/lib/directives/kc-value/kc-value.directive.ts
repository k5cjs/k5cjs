import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[kcValue]' })
export class KcValueDirective {
  constructor(private _template: TemplateRef<unknown>, private _cdr: ChangeDetectorRef) {}

  render(viewContainer: ViewContainerRef): void {
    viewContainer.createEmbeddedView(this._template);

    this._cdr.detectChanges();
  }

  clear(viewContainer: ViewContainerRef): void {
    viewContainer.clear();

    this._cdr.detectChanges();
  }
}
