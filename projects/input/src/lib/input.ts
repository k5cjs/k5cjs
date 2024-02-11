import { Directive, HostBinding, Input } from '@angular/core';

import { KcControl, kcControlProviders } from '@k5cjs/control';

import { InputType } from './input.type';

@Directive({
  selector: 'input[kcInput], input[kc-input]',
  standalone: true,
  providers: kcControlProviders(KcInput),
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class KcInput<T extends string | number> extends KcControl<T> {
  @Input()
  @HostBinding('type')
  type: InputType = 'text';
}
