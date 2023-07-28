import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KcFormField } from '@k5cjs/form-field';

@Component({
  selector: 'app-extends-form-field',
  templateUrl: './extends-form-field.component.html',
  styleUrls: ['./extends-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtendsFormFieldComponent extends KcFormField {}
