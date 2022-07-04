import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcGroup, KcOption } from '../../types';

type Context<K, V> = { $implicit: KcGroup<K, V> };

@Directive({
  selector: '[kcGroup]',
})
export class KcGroupDirective<K, V> {
  constructor(
    private _template: TemplateRef<Context<K, V>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<K, V>(_dir: KcGroupDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }

  render(options: KcOption<K, V>[] | KcOption<K, V>[][] | KcGroup<K, V>) {
    this._viewContainer.clear();
    this._viewContainer.createEmbeddedView(this._template, { $implicit: options });
    this._cdr.detectChanges();
  }
}
