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
import { findLeftMostDay, findRightMostDay, isDateBetween, isDateEqual, removeTime } from '../../utils';

@Component({
  selector: 'kc-cal-day',
  templateUrl: './kc-cal-day.component.html',
  styleUrls: ['./kc-cal-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalDayComponent<T extends KcCalSelector = KcCalSelector> implements OnDestroy {
  @Input()
  set day(value: Date) {
    this._day = removeTime(value);
  }
  get day(): Date {
    return this._day;
  }
  private _day!: Date;

  @Input()
  set month(value: Date) {
    this._month = removeTime(value);
  }
  get month(): Date {
    return this._month;
  }
  private _month!: Date;

  protected _isHovered = false;

  private _destroy: Subject<void>;

  constructor(
    @Inject(KC_CAL_SELECTOR) protected _selector: T,
    protected _cdr: ChangeDetectorRef,
    protected _kcCal: KcCal,
  ) {
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
    const current = removeTime(new Date());

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

    const leftMost = findLeftMostDay([from, to, hovered]);

    if (!leftMost) return false;

    return isDateEqual(this.day, leftMost);
  }

  @HostBinding('class.kc-cal-day--end')
  get end(): boolean {
    const { from, to, hovered } = this._selector;

    const rightMost = findRightMostDay([from, to, hovered]);

    if (!rightMost) return false;

    return isDateEqual(this.day, rightMost);
  }

  @HostBinding('class.kc-cal-day--rounded')
  get rounded(): boolean {
    return this.end && this.start;
  }

  @HostBinding('class.kc-cal-day--current')
  get current(): boolean {
    return isDateEqual(this.day, removeTime(new Date()));
  }

  @HostBinding('class.kc-cal-day--hovered')
  get hovered(): boolean {
    if (this.selected || this.disabled || !this._selector.hovered) return false;

    const { from, to, hovered } = this._selector;

    // when ranges are not set, hover based on internal state
    if (!from && !to) return this._isHovered;

    // when 'to' is not set, hover when is between from & hovered dates
    if (!!from && !to) return isDateBetween(this.day, from, hovered) || isDateBetween(this.day, hovered, from);

    // when 'from' is not set, hover when is between to & hovered dates
    if (!from && !!to) return isDateBetween(this.day, to, hovered) || isDateBetween(this.day, hovered, to);

    // hover when is between either from/to & hovered dates
    return (!!from && isDateBetween(this.day, from, hovered)) || (!!to && isDateBetween(this.day, hovered, to));
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
}
