import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, HostListener, Inject, Input } from '@angular/core';

import { KC_SELECT } from '../../tokens';
import { KcSelect } from '../../types';

@Directive({
  selector: '[kcClose]',
})
export class KcCloseDirective {
  @Input({ transform: coerceBooleanProperty }) kcClose = true;

  constructor(@Inject(KC_SELECT) private _kcSelect: KcSelect) {}

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (this.kcClose) this._kcSelect.close(event);
  }
}
