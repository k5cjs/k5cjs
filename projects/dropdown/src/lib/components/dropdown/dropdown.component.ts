import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'kc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcDropdownComponent {
  // prettier-ignore
  @Input()
  get preventClose(): boolean { return this._preventClose; }
  // prettier-ignore
  set preventClose(value: boolean | string) { this._preventClose = coerceBooleanProperty(value); }
  private _preventClose = true;
}
