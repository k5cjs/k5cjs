import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';

import { KcInternalDropdownComponent } from '../internal-dropdown/internal-dropdown.component';

@Component({
  selector: 'kc-dropdown-options',
  templateUrl: './dropdown-options.component.html',
  styleUrls: ['./dropdown-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcDropdownOptionsComponent {
  @Input() preventClose!: boolean;

  constructor(private _internalDropdown: KcInternalDropdownComponent) {}
  @HostListener('click')
  onClick(): void {
    if (!this.preventClose) this._internalDropdown.close();
  }
}
