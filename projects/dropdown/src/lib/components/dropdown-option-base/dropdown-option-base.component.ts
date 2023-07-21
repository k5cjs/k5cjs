import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';

import { KcInternalDropdownComponent } from '../internal-dropdown/internal-dropdown.component';

@Component({
  selector: 'kc-dropdown-option-base',
  templateUrl: './dropdown-option-base.component.html',
  styleUrls: ['./dropdown-option-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcDropdownOptionBaseComponent {
  constructor(private _test: KcInternalDropdownComponent) {}
  @HostListener('click')
  onClick(): void {
    this._test.open();
  }
}
