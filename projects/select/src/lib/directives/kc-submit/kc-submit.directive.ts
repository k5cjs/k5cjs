import { Directive, HostListener, Inject } from '@angular/core';

import { KC_SELECT } from '../../tokens';
import { KcSelect } from '../../types';

@Directive({
  selector: '[kcSubmit]',
})
export class KcSubmitDirective {
  constructor(@Inject(KC_SELECT) private _kcSelect: KcSelect) {}

  @HostListener('click')
  click() {
    this._kcSelect.submit();
  }
}
