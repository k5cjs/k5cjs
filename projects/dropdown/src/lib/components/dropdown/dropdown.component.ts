import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'kc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcDropdownComponent {}
