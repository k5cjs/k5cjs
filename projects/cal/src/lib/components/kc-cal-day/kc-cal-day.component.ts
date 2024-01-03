import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { KcCal, KcCalSelector } from '../../services';
import { KC_CAL_SELECTOR } from '../../tokens';

@Component({
  selector: 'kc-cal-day',
  templateUrl: './kc-cal-day.component.html',
  styleUrls: ['./kc-cal-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalDayComponent<T extends KcCalSelector = KcCalSelector> implements OnDestroy {
  @Input()
  set day(value: Date) {
    this._day = this._removeTime(value);
  }
  get day(): Date {
    return this._day;
  }
  private _day!: Date;

  @Input()
  set month(value: Date) {
    this._month = this._removeTime(value);
  }
  get month(): Date {
    return this._month;
  }
  private _month!: Date;

  private _destroy: Subject<void>;

  private _isHovered = false;

  constructor(@Inject(KC_CAL_SELECTOR) protected _selector: T, private _cdr: ChangeDetectorRef, private _kcCal: KcCal) {
    this._destroy = new Subject();

    this._selector.changed.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._cdr.markForCheck();
    });

    this._selector.hoveredChanged.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._cdr.markForCheck();
    });
  }

  @HostBinding('class.kc-cal-day') class = true;

  @HostBinding('class.kc-cal-day--selected')
  get selected(): boolean {
    return this._selector.isSelected(this.day);
  }

  @HostBinding('class.kc-cal-day--disabled')
  get disabled(): boolean {
    const current = this._removeTime(new Date());

    return this.day.getTime() > current.getTime();
  }

  @HostBinding('class.kc-cal-day--other')
  get other(): boolean {
    return this.day.getMonth() !== this.month.getMonth();
  }

  @HostBinding('class.kc-cal-day--selected-other')
  get selectedOther(): boolean {
    return this.selected && this.other;
  }

  @HostBinding('class.kc-cal-day--start')
  get start(): boolean {
    const { from, to, hovered } = this._selector;

    const leftMost = this._findLeftMostDay([from, to, hovered]);

    if (!leftMost) return false;

    return this._isDateEqual(this.day, leftMost);
  }

  @HostBinding('class.kc-cal-day--end')
  get end(): boolean {
    const { from, to, hovered } = this._selector;

    const rightMost = this._findRightMostDay([from, to, hovered]);

    if (!rightMost) return false;

    return this._isDateEqual(this.day, rightMost);
  }

  @HostBinding('class.kc-cal-day--rounded')
  get rounded(): boolean {
    return this.end && this.start;
  }

  @HostBinding('class.kc-cal-day--current')
  get current(): boolean {
    return this._isDateEqual(this.day, this._removeTime(new Date()));
  }

  @HostBinding('class.kc-cal-day--hovered')
  get hovered(): boolean {
    if (this.selected || this.disabled || !this._selector.hovered) return false;

    const { from, to, hovered } = this._selector;

    // when ranges are not set, hover based on internal state
    if (!from && !to) return this._isHovered;

    // when 'to' is not set, hover when is between from & hovered dates
    if (!!from && !to)
      return this._isDateBetween(this.day, from, hovered) || this._isDateBetween(this.day, hovered, from);

    // when 'from' is not set, hover when is between to & hovered dates
    if (!from && !!to) return this._isDateBetween(this.day, to, hovered) || this._isDateBetween(this.day, hovered, to);

    // hover when is between either from/to & hovered dates
    return (
      (!!from && this._isDateBetween(this.day, from, hovered)) || (!!to && this._isDateBetween(this.day, hovered, to))
    );
  }

  @HostBinding('class.kc-cal-day--hovered-other')
  get hoveredOther(): boolean {
    return this.hovered && this.other;
  }

  @HostListener('click')
  select(): void {
    if (this.disabled || this.other) return;

    this._selector.select(this.day);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this._isHovered = true;
    this._selector.changeHovered(this.day);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this._isHovered = false;
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }

  private _isDateEqual(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
  }

  private _removeTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  private _isDateBetween(checkDate: Date, startDate: Date, endDate: Date): boolean {
    return checkDate >= startDate && checkDate <= endDate;
  }

  private _findLeftMostDay(dates: (Date | null)[]): Date | null {
    const validDates = dates.filter((date): date is Date => !!date);

    if (validDates.length === 0) {
      return null;
    }

    return validDates.reduce((leftmostDate, date) => (date < leftmostDate ? date : leftmostDate), validDates[0]);
  }

  private _findRightMostDay(dates: (Date | null)[]): Date | null {
    const validDates = dates.filter((date): date is Date => !!date);

    if (validDates.length === 0) {
      return null;
    }

    return validDates.reduce((rightMostDate, date) => (date > rightMostDate ? date : rightMostDate), validDates[0]);
  }
}
