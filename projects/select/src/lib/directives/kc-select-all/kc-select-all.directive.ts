import { Directive, HostListener, Inject } from '@angular/core';

import { KC_SELECT } from '../../tokens';
import { KcSelect } from '../../types';

@Directive({
  selector: '[kcSelectAll]',
})
export class KcSelectAllDirective {
  constructor(@Inject(KC_SELECT) private _kcSelect: KcSelect) {}

  @HostListener('click')
  click() {
    this._kcSelect.selectAll();
  }
}
