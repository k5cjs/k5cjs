import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { KC_CAL_SELECTOR, KcCal, KcCalComponent, KcCalEvent, KcCalSelector } from '@k5cjs/cal';

@Component({
  selector: 'app-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: KC_CAL_SELECTOR,
      useClass: KcCalSelector,
    },
    KcCal,
  ],
})
export class CalComponent extends KcCalComponent {
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

  date1 = new Date(2020, 0, 1);
  date2 = new Date(2020, 1, 1);

  constructor() {
    super();

    this.control.valueChanges.subscribe((value) => {
      this.kcCal.goMonth(new Date(value), 'input');
    });
  }

  protected override _renderMonths({ month }: KcCalEvent): void {
    this._container.clear();

    const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1);
    const ref2 = this.monthRef.template.createEmbeddedView({ $implicit: prevMonth });
    this._container.insert(ref2);

    const ref = this.monthRef.template.createEmbeddedView({ $implicit: month });
    this._container.insert(ref);
  }
}
