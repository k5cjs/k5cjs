import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { KcInternalDropdownComponent } from '../internal-dropdown/internal-dropdown.component';

@Component({
  selector: 'kc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcDropdownComponent {
  @ViewChild(KcInternalDropdownComponent) internalDropdown!: KcInternalDropdownComponent;

  // prettier-ignore
  @Input()
  get preventClose(): boolean { return this._preventClose; }
  // prettier-ignore
  set preventClose(value: boolean | string) { this._preventClose = coerceBooleanProperty(value); }
  private _preventClose = true;

  @Output() dialogClosed = new EventEmitter<void>();

  emitClose(): void {
    this.dialogClosed.emit();
  }

  open(): void {
    this.internalDropdown.open();
  }

  close(): void {
    this.internalDropdown.close();
  }
}
