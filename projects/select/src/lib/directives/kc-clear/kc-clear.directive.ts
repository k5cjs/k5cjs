import { Directive, HostListener, Inject } from '@angular/core';

import { KC_SELECT } from '../../tokens';
import { KcSelect } from '../../types';

@Directive({
    selector: '[kcClear]',
    standalone: false
})
export class KcClearDirective {
  constructor(@Inject(KC_SELECT) private _kcSelect: KcSelect) {}

  @HostListener('click') onClick() {
    this._kcSelect.clear();
  }
}
