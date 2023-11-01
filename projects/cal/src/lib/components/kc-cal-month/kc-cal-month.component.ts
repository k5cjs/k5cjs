import { getLocaleFirstDayOfWeek } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';

import { KcCalWeekDirective } from '../../directives';
import { KcCalWeekData } from '../../types';
import { KcCalWeekComponent } from '../kc-cal-week/kc-cal-week.component';

@Component({
  selector: 'kc-cal-month',
  templateUrl: './kc-cal-month.component.html',
  styleUrls: ['./kc-cal-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalMonthComponent implements OnInit {
  @Input() month!: Date;

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  @ContentChild(KcCalWeekDirective, { static: true }) week?: KcCalWeekDirective;

  private _weeks: KcCalWeekData[];

  constructor(
    @Optional()
    @Inject(LOCALE_ID)
    private _locale: string = 'en-US',
  ) {
    this._weeks = Array.from(
      /**
       * max weeks in one month
       */
      { length: 6 },
      () => ({
        days: Array.from(
          /**
           * number of days in one week
           */
          { length: 7 },
        ),
      }),
    );
  }

  ngOnInit(): void {
    this._fillWeeks(this.month);
    this._renderWeeks();
  }

  private _fillWeeks(month: Date): void {
    const dateStart = new Date(month.getFullYear(), month.getMonth(), 1);

    const localeDayStart = getLocaleFirstDayOfWeek(this._locale);
    const dayStart = dateStart.getDay();
    const daysLength = 42;

    for (let i = 0; i < daysLength; i++) {
      /**
       * empty cells are filled with previous/next month days
       *
       *
       *  0  1  2  3  4  5  6
       *
       * 29 30 01 02 03 04 05
       * 06 07 08 09 10 11 12
       * 13 14 15 16 17 18 19
       * 20 21 22 23 24 25 26
       * 27 28 29 30 31 01 02
       *
       */

      const y = Math.trunc(i / 7);
      const x = i % 7;

      this._weeks[y].days[x] = {
        date: new Date(
          month.getFullYear(),
          month.getMonth(),

          /**
           * `i + 1` i starts at zero, but the date starts at 1
           *
           *  `- dayStart` shifts the calendar cells back to the correct day of the month
           *
           *  `- localeDayStart` is used to account for the locale-specific first day of the week
           *
           */
          i + 1 - dayStart - localeDayStart,
        ),
        month,
      };
    }
  }

  private _renderWeeks(): void {
    this._weeks.forEach((week) => this.container.insert(this._createViewRef(week)));
  }

  private _createViewRef(week: KcCalWeekData): ViewRef {
    if (this.week) return this.week.template.createEmbeddedView({ $implicit: week });

    const dayComponentRef = this.container.createComponent(KcCalWeekComponent);
    dayComponentRef.instance.week = week;
    return dayComponentRef.hostView;
  }
}
