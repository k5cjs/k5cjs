import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';

import { KcInternalDropdownComponent } from '../internal-dropdown/internal-dropdown.component';

@Component({
  selector: 'kc-dropdown-options',
  templateUrl: './dropdown-options.component.html',
  styleUrls: ['./dropdown-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcDropdownOptionsComponent {
  constructor(private _test: KcInternalDropdownComponent) {}
  @HostListener('click')
  onClick(): void {
    this._test.close();
  }
}
