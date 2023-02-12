import { ChangeDetectorRef, Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcOption } from '../../types';

type Context<V, K, L> = { $implicit: KcOption<V, K, L>[] };

@Directive({ selector: '[kcOptions]' })
export class KcOptionsDirective<V, K, L> {
  @Input('kcOptionsType') public type!: KcOption<V, K, L>;

  private _embeddedViewRef: EmbeddedViewRef<Context<V, K, L>> | undefined;

  constructor(
    private _template: TemplateRef<Context<V, K, L>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<V, K, L>(
    _dir: KcOptionsDirective<V, K, L>,
    _ctx: Context<V, K, L>,
  ): _ctx is Context<V, K, L> {
    return true;
  }

  render(options: KcOption<V, K, L>[]): void {
    if (this._embeddedViewRef) this._embeddedViewRef.context.$implicit = options;
    else this._embeddedViewRef = this._viewContainer.createEmbeddedView(this._template, { $implicit: options });

    this._cdr.detectChanges();
  }

  clear(): void {
    this._embeddedViewRef = undefined;
    this._viewContainer.clear();

    this._cdr.detectChanges();
  }
}
