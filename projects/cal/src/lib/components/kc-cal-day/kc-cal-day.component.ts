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

import { KcCalSelector } from '../../services';
import { KC_CAL_SELECTOR } from '../../tokens';

@Component({
  selector: 'kc-cal-day',
  templateUrl: './kc-cal-day.component.html',
  styleUrls: ['./kc-cal-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalDayComponent<T extends KcCalSelector = KcCalSelector> implements OnDestroy {
  @Input()
  set day(value: Date | null) {
    if (value) this._day = this._removeTime(value);
    else this._day = null;
  }
  get day(): Date | null {
    return this._day;
  }
  private _day!: Date | null;

  private _destroy: Subject<void>;

  constructor(@Inject(KC_CAL_SELECTOR) protected _selector: T, private _cdr: ChangeDetectorRef) {
    this._destroy = new Subject();

    this._selector.changed.pipe(takeUntil(this._destroy)).subscribe(() => this._cdr.markForCheck());
  }

  @HostBinding('class.kc-cal-day') class = true;
  @HostBinding('class.kc-cal-day--empty') get empty(): boolean {
    return !this.day;
  }

  @HostBinding('class.kc-cal-day--selected')
  get selected(): boolean {
    return this.day ? this._selector.isSelected(this.day) : false;
  }

  @HostBinding('class.kc-cal-day--disabled')
  get disabled(): boolean {
    if (!this.day) return false;

    const current = this._removeTime(new Date());

    return this.day.getTime() > current.getTime();
  }

  @HostBinding('class.kc-cal-day--start')
  get start(): boolean {
    if (!this.day || !this._selector.from || !this._selector.to) return false;

    return this._isDateEqual(this.day, this._selector.from);
  }

  @HostBinding('class.kc-cal-day--end')
  get end(): boolean {
    if (!this.day || !this._selector.from || !this._selector.to) return false;

    return this._isDateEqual(this.day, this._selector.to);
  }

  @HostBinding('class.kc-cal-day--rounded')
  get rounded(): boolean {
    if (!this.day) return false;

    if (this._selector.from && !this._selector.to) return this._isDateEqual(this.day, this._selector.from);

    if (this._selector.to && !this._selector.from) return this._isDateEqual(this.day, this._selector.to);

    if (!this._selector.to || !this._selector.from) return false;

    return this._isDateEqual(this._selector.from, this._selector.to);
  }

  @HostBinding('class.kc-cal-day--current')
  get current(): boolean {
    if (!this.day) return false;

    return this._isDateEqual(this.day, this._removeTime(new Date()));
  }

  @HostListener('click')
  select(): void {
    if (!this.day || this.disabled) return;

    this._selector.select(this.day);
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
}
