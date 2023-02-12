import { ChangeDetectorRef, Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcGroup } from '../../types';

type Context<V, K, L> = { $implicit: KcGroup<V, K, L> };

@Directive({
  selector: '[kcGroup]',
})
export class KcGroupDirective<V, K, L> {
  private _embeddedViewRef: EmbeddedViewRef<Context<V, K, L>> | undefined;

  constructor(
    private _template: TemplateRef<Context<V, K, L>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<V, K, L>(
    _dir: KcGroupDirective<V, K, L>,
    _ctx: Context<V, K, L>,
  ): _ctx is Context<V, K, L> {
    return true;
  }

  render(options: KcGroup<V, K, L>) {
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
