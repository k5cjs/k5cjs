import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { KcOption } from '../../types';

type Context<K, V> = { $implicit: KcOption<K, V>[] };

@Directive({ selector: '[kcOptions]' })
export class KcOptionsDirective<K, V> {
  @Input('kcOptionsType') public type!: KcOption<K, V>;

  constructor(
    private _template: TemplateRef<Context<K, V>>,
    private _viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
  ) {}

  static ngTemplateContextGuard<K, V>(_dir: KcOptionsDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }

  render(options: KcOption<K, V>[]): void {
    this._viewContainer.clear();
    this._viewContainer.createEmbeddedView(this._template, { $implicit: options });
    this._cdr.detectChanges();
  }
}
