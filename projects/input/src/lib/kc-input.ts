import { Directive, HostBinding, Input } from '@angular/core';

import { KcControl, kcControlValueAccessor } from '@k5cjs/control';

type InputType = 'text' | 'number' | 'password';

@Directive({
  selector: 'input[kc-input]',
  standalone: true,
  providers: [kcControlValueAccessor(KcInput), { provide: KcControl, useExisting: KcInput }],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class KcInput<T extends string | number> extends KcControl<T> {
  @Input()
  @HostBinding('type')
  type: InputType = 'text';
}
