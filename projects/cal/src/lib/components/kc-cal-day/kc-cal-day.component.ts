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
import { KcCalDayData } from '../../types';

@Component({
  selector: 'kc-cal-day',
  templateUrl: './kc-cal-day.component.html',
  styleUrls: ['./kc-cal-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalDayComponent<T extends KcCalSelector = KcCalSelector> implements OnDestroy {
  @Input() day!: KcCalDayData | null;

  private _destroy: Subject<void>;

  constructor(@Inject(KC_CAL_SELECTOR) protected _selector: T, private _cdr: ChangeDetectorRef) {
    this._destroy = new Subject();

    this._selector.changed.pipe(takeUntil(this._destroy)).subscribe(() => this._cdr.markForCheck());
  }

  @HostBinding('class.kd-cal-day') class = true;
  @HostBinding('class.kd-cal-day--empty') get empty(): boolean {
    return !this.day;
  }

  @HostBinding('class.kd-cal-day--selected')
  get selected(): boolean {
    return this.day ? this._selector.isSelected(this.day.date) : false;
  }

  @HostBinding('class.kd-cal-day--disabled')
  get disabled(): boolean {
    if (!this.day) return false;

    return this.day.date > new Date();
  }

  @HostBinding('class.kd-cal-day--start')
  get start(): boolean {
    if (!this.day || !this._selector.from || !this._selector.to) return false;

    return this.day.date.getTime() === this._startDay(this._selector.from).getTime();
  }

  @HostBinding('class.kd-cal-day--end')
  get end(): boolean {
    if (!this.day || !this._selector.from || !this._selector.to) return false;

    return this.day.date.getTime() === this._selector.to.getTime();
  }

  @HostBinding('class.kd-cal-day--rounded')
  get rounded(): boolean {
    if (!this.day) return false;

    if (this._selector.from && !this._selector.to) return this.day.date.getTime() === this._selector.from.getTime();

    if (this._selector.to && !this._selector.from) return this.day.date.getTime() === this._selector.to.getTime();

    return this._selector.from?.getTime() === this._selector.to?.getTime();
  }

  @HostListener('click')
  select(): void {
    if (!this.day || this.disabled) return;

    this._selector.select(this.day.date);
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }

  private _startDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
