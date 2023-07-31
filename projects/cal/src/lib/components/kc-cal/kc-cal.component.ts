import { getLocaleFirstDayOfWeek } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  LOCALE_ID,
  OnDestroy,
  Optional,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

import { KcCalDayDirective, KcCalMonthDirective, KcCalWeekDirective, KcCalWeekOutletDirective } from '../../directives';
import { KcCal } from '../../services';
import { KC_CAL_SELECTOR } from '../../tokens';
import { KcCalBaseSelector, KcCalData, KcCalWeekData } from '../../types';
import { KcCalDayComponent } from '../kc-cal-day/kc-cal-day.component';
import { KcCalWeekComponent } from '../kc-cal-week/kc-cal-week.component';

@Component({
  selector: 'kc-cal',
  templateUrl: './kc-cal.component.html',
  styleUrls: ['./kc-cal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalComponent implements AfterContentInit, OnDestroy {
  @ViewChild('outlet', { static: true, read: ViewContainerRef }) private _outlet!: ViewContainerRef;

  @ContentChild(KcCalMonthDirective, { static: true }) monthRef?: KcCalMonthDirective;
  @ContentChild(KcCalWeekDirective, { static: true }) week?: KcCalWeekDirective;
  @ContentChild(KcCalDayDirective, { static: true }) day?: KcCalDayDirective;

  cal: KcCalData;

  private _destroy: Subject<void>;

  constructor(
    public kcCal: KcCal,
    private _viewContainerRef: ViewContainerRef,
    @Optional()
    @Inject(LOCALE_ID)
    private _locale: string = 'en-US',
    @Inject(KC_CAL_SELECTOR) private kc: KcCalBaseSelector<unknown>,
  ) {
    this.cal = {
      weeks: Array.from(
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
      ),
    };

    this._destroy = new Subject();
  }

  ngAfterContentInit(): void {
    this.kcCal.monthChanges
      .pipe(
        takeUntil(this._destroy),
        distinctUntilChanged(
          (prev, current) =>
            /**
             * check if is the same month
             * if is the same month skip to render one more time for this month
             */
            prev.getFullYear() === current.getFullYear() && prev.getMonth() === current.getMonth(),
        ),
      )
      .subscribe((date) => {
        this._clearWeeks();
        this._fillWeeks(date);
        this._clearOutlet();
        this._renderWeeks();
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
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

      this.cal.weeks[y].days[x] = {
        date: new Date(
          date.getFullYear(),
          date.getMonth(),
          /**
           * `i` starts at zero, but the date starts at 1
           */
          i + 1,
        ),
        selected: false,
      };
    }
  }

  private _clearWeeks(): void {
    this.cal.weeks.forEach((week) => (week.days = week.days.map(() => null)));
  }

  private _renderWeeks(): void {
    this.cal.weeks.forEach((week) => {
      let weekViewRef: ViewRef;

      if (this.week) {
        weekViewRef = this.week.template.createEmbeddedView({ $implicit: week });
      } else {
        const dayComponentRef = this._viewContainerRef.createComponent(KcCalWeekComponent);
        dayComponentRef.instance.week = week;
        weekViewRef = dayComponentRef.hostView;
      }

      this._outlet.insert(weekViewRef);

      this._renderDays(week);
    });
  }

  private _renderDays(week: KcCalWeekData): void {
    week.days.forEach((day) => {
      let dayViewRef: ViewRef;

      if (this.day) {
        dayViewRef = this.day.template.createEmbeddedView({ $implicit: day });
      } else {
        const dayComponentRef = this._viewContainerRef.createComponent(KcCalDayComponent);
        dayComponentRef.instance.day = day;
        dayViewRef = dayComponentRef.hostView;
      }

      KcCalWeekOutletDirective.mostRecentCellOutlet?._viewContainer.insert(dayViewRef);
    });
  }

  private _clearOutlet(): void {
    this._outlet.clear();
  }
}
