import { getLocaleFirstDayOfWeek } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, Optional } from '@angular/core';

@Component({
  selector: 'kc-cal-days',
  templateUrl: './kc-cal-days.component.html',
  styleUrls: ['./kc-cal-days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalDaysComponent {
  days: Date[];

  constructor(
    @Optional()
    @Inject(LOCALE_ID)
    private _locale: string = 'en-US',
  ) {
    this.days = [];
    const localeStartDay: number = getLocaleFirstDayOfWeek(this._locale);

    for (let i = localeStartDay; i < 7 + localeStartDay; i++) this.days.push(new Date(0, 0, i));
  }
}
