import { Directive, Input, TemplateRef } from '@angular/core';

import { KcOption } from '../../types';

type Context<V, K, L> = { $implicit: KcOption<V, K, L> };

@Directive({ selector: '[kcOption]' })
export class KcOptionDirective<V, K, L> {
  @Input('kcOptionType') public type!: KcOption<V, K, L>;

  constructor(public template: TemplateRef<Context<V, K, L>>) {}

  static ngTemplateContextGuard<V, K, L>(
    _dir: KcOptionDirective<V, K, L>,
    _ctx: Context<V, K, L>,
  ): _ctx is Context<V, K, L> {
    return true;
  }
}
