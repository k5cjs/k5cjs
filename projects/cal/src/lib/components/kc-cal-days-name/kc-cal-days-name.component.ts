import { getLocaleFirstDayOfWeek } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, Optional } from '@angular/core';

@Component({
  selector: 'kc-cal-days-name',
  templateUrl: './kc-cal-days-name.component.html',
  styleUrls: ['./kc-cal-days-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalDaysNameComponent {
  days: Date[];

  constructor(
    @Optional()
    @Inject(LOCALE_ID)
    private _locale: string = 'en-US',
  ) {
    this.days = [];
    const localeStartDay = getLocaleFirstDayOfWeek(this._locale);

    for (let i = localeStartDay; i < 7 + localeStartDay; i++) {
      this.days.push(new Date(0, 0, i));
    }
  }
}
