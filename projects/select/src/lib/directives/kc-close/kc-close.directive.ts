import { Directive, HostListener, Inject } from '@angular/core';

import { KC_SELECT } from '../../tokens';
import { KcSelect } from '../../types';

@Directive({
  selector: '[kcClose]',
})
export class KcCloseDirective {
  constructor(@Inject(KC_SELECT) private _kcSelect: KcSelect) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    this._kcSelect.close(event);
  }
}
