import { ChangeDetectorRef, Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcOption } from '../../types';

type Context<K, V> = { $implicit: KcOption<K, V>[] };

@Directive({ selector: '[kcOptions]' })
export class KcOptionsDirective<K, V> {
  @Input('kcOptionsType') public type!: KcOption<K, V>;

  private _embeddedViewRef: EmbeddedViewRef<Context<K, V>> | undefined;

  constructor(
    private _template: TemplateRef<Context<K, V>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<K, V>(_dir: KcOptionsDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }

  render(options: KcOption<K, V>[]): void {
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
