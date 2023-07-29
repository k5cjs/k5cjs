import { animateChild, query, stagger, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KcFormField } from '@k5cjs/form-field';

export const sgr = trigger('stagger', [
  transition('* => *', [
    query(
      '@toggleY',
      [
        //
        // style({ opacity: 0 }),
        stagger(1000, [
          //
          // animate('0.5s', style({ opacity: 1 })),
          animateChild(),
        ]),
      ],
      {
        optional: true,
      },
    ),
  ]),
]);

@Component({
  selector: 'app-extends-form-field',
  templateUrl: './extends-form-field.component.html',
  styleUrls: ['./extends-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sgr],
})
export class ExtendsFormFieldComponent extends KcFormField {}
