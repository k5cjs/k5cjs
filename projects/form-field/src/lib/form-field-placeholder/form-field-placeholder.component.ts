import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'kc-form-field-placeholder',
  templateUrl: './form-field-placeholder.component.html',
  styleUrls: ['./form-field-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class KcFormFieldPlaceholder {
  @Input() value!: string;
}
