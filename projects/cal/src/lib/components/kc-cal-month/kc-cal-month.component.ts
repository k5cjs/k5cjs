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
       * max weeks in one months
       */
      { length: 6 },
      () => ({
        days: Array.from(
          /**
           * number of days in one week
           */
          { length: 7 },
          () => null,
        ),
      }),
    );
  }

  ngOnInit(): void {
    this._fillWeeks(this.month);
    this._renderWeeks();
  }

  private _fillWeeks(date: Date): void {
    const dateStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const dateEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    /**
     * we have to skip the cells that are empty
     * dayStart = 2;
     * daysLength = 31;
     *
     *  0  1  2  3  4  5  6
     *
     *       01 02 03 04 05
     * 06 07 08 09 10 11 12
     * 13 14 15 16 17 18 19
     * 20 21 22 23 24 25 26
     * 27 28 29 30 31
     *
     */
    const localeDayStart = getLocaleFirstDayOfWeek(this._locale);
    const dayStart = dateStart.getDay();
    const daysLength = dateEnd.getDate();

    for (let i = 0; i < daysLength; i++) {
      /**
       * skip empty cell
       * dayStart = 2
       * localeDayStart = 1
       * i = 0
       * currentCell = 2 - 1 -> 01 date
       */

      /**
       *  if dayStart is 0, then we have to skip 6 cells
       *  dayStart - localeDayStart < 1
       *  0 - 1 < 1
       *  -1
       *  6 + 0
       */
      const diffToStart = dayStart - localeDayStart;
      const currentCell = (diffToStart < 0 ? 6 : diffToStart) + i;

      const y = Math.trunc(currentCell / 7);
      const x = currentCell % 7;

      this._weeks[y].days[x] = {
        date: new Date(
          date.getFullYear(),
          date.getMonth(),
          /**
           * `i` starts at zero, but the date starts at 1
           */
          i + 1,
        ),
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
