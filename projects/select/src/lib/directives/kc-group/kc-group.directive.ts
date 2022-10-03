import { ChangeDetectorRef, Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcGroup } from '../../types';

type Context<K, V> = { $implicit: KcGroup<K, V> };

@Directive({
  selector: '[kcGroup]',
})
export class KcGroupDirective<K, V> {
  private _embeddedViewRef: EmbeddedViewRef<Context<K, V>> | undefined;

  constructor(
    private _template: TemplateRef<Context<K, V>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<K, V>(_dir: KcGroupDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }

  render(options: KcGroup<K, V>) {
    if (this._embeddedViewRef) this._embeddedViewRef.context.$implicit = options;
    else this._embeddedViewRef = this._viewContainer.createEmbeddedView(this._template, { $implicit: options });

    this._cdr.detectChanges();
  }

  clear() {
    this._embeddedViewRef = undefined;
    this._viewContainer.clear();

    this._cdr.detectChanges();
  }
}
