import { Provider, Type, forwardRef } from '@angular/core';

import { KcOptionComponent } from '../components/kc-option/kc-option.component';

export function provideKcOption<T extends KcOptionComponent<unknown, unknown, unknown>>(type: Type<T>): Provider {
  return {
    provide: KcOptionComponent,
    useExisting: forwardRef(() => type),
  };
}
