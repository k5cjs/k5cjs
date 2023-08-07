import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { KcCal } from '@k5cjs/cal';

@Component({
  selector: 'app-cal-scroll',
  templateUrl: './cal-scroll.component.html',
  styleUrls: ['./cal-scroll.component.scss'],
  providers: [KcCal],
})
export class CalScrollComponent {
  control: FormControl<Date> = new FormControl<Date>(new Date(), { nonNullable: true });

  options = [
    new Date(0),
    new Date(2020, 0, 1),
    new Date(2020, 1, 1),
    new Date(2020, 2, 1),
    new Date(2020, 3, 1),
    new Date(2020, 4, 1),
    new Date(),
  ];

  constructor(public cal: KcCal) {
    this.control.valueChanges.subscribe((value) => {
      this.cal.goMonth(new Date(value));
    });
  }
}
