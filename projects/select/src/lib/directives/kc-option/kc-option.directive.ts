import { Directive, Input, TemplateRef } from '@angular/core';

import { KcOption } from '../../types';

type Context<K, V> = { $implicit: KcOption<K, V> };

@Directive({ selector: '[kcOption]' })
export class KcOptionDirective<K, V> {
  @Input('kcOptionType') public type!: KcOption<K, V>;

  constructor(public template: TemplateRef<Context<K, V>>) {}

  static ngTemplateContextGuard<K, V>(_dir: KcOptionDirective<K, V>, _ctx: Context<K, V>): _ctx is Context<K, V> {
    return true;
  }
}
