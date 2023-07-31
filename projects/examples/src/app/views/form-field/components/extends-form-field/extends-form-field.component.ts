import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';

import { KC_FORM_FIELD, KcFormField } from '@k5cjs/form-field';

@Component({
  selector: 'app-extends-form-field',
  templateUrl: './extends-form-field.component.html',
  styleUrls: ['./extends-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: KC_FORM_FIELD, useExisting: forwardRef(() => ExtendsFormFieldComponent) }],
})
export class ExtendsFormFieldComponent extends KcFormField {}
