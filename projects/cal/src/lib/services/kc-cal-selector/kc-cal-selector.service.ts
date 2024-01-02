import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { KcCalBaseRange, KcCalBaseSelector, Selector } from '../../types';
import { KcCal } from '../kc-cal/kc-cal.service';

@Injectable()
export class KcCalSelector implements KcCalBaseSelector<KcCalBaseRange> {
  protected _selector: Selector;
  protected _from: Date | null;
  protected _to: Date | null;
  protected _range: Subject<KcCalBaseRange>;
  protected _rangeSelector: BehaviorSubject<Selector>;
  protected _hovered: Date | null;

  constructor(protected _kcCal: KcCal) {
    this._selector = Selector.From;
    this._from = null;
    this._to = null;
    this._range = new Subject();
    this._rangeSelector = new BehaviorSubject<Selector>(this._selector);
    this._hovered = null;
  }

  get from(): Date | null {
    return this._from;
  }

  get to(): Date | null {
    return this._to;
  }

  get state(): Selector {
    return this._selector;
  }

  get changed(): Observable<KcCalBaseRange> {
    return this._range.asObservable();
  }

  get stateChanged(): Observable<Selector> {
    return this._rangeSelector.asObservable();
  }

  get hovered(): Date | null {
    return this._hovered;
  }

  select(
    date: Date | null,
    options?: {
      emitEvent?: boolean;
      toggleState?: boolean;
      goMonth?: boolean;
    },
  ): void {
    if (this._selector === Selector.To) this._selectTo(date);
    else this._selectFrom(date);

    if (options?.emitEvent !== false) this._changeRange();

    if (options?.toggleState !== false) this.toggleState(options);
    /**
     * change month if toggleState is false
     * because if toggleState is true then goMonth it will be changed in toggleState
     */ else if (date && options?.goMonth) this._kcCal.goMonth(date);
  }

  isSelected(date: Date): boolean {
    // when state is from and you don't have any selected date
    if (!!this.from && this._startDay(this.from).getTime() === date.getTime()) return true;
    // when state is to and you don't have any selected date
    if (!!this.to && this._startDay(this.to).getTime() === date.getTime()) return true;

    return (
      !!this.from &&
      !!this.to &&
      date.getTime() >= this._startDay(this.from).getTime() &&
      date.getTime() <= this._startDay(this.to).getTime()
    );
  }

  toggleState(options?: { goMonth?: boolean }): Selector {
    /**
     * XOR
     * 0^1=1
     * 1^1=0
     */
    this._selector ^= Selector.To;
    this._rangeSelector.next(this._selector);

    if (options?.goMonth)
      if (this._selector === Selector.From && this.from) this._kcCal.goMonth(this.from, 'from');
      else if (this._selector === Selector.To && this.to) this._kcCal.goMonth(this.to, 'to');

    return this._selector;
  }

  changeFromState(options?: { goMonth?: boolean }): void {
    this._selector = Selector.From;
    this._rangeSelector.next(this._selector);

    if (options?.goMonth && this.from) this._kcCal.goMonth(this.from, 'from');
  }

  changeToState(options?: { goMonth?: boolean }): void {
    this._selector = Selector.To;
    this._rangeSelector.next(this._selector);

    if (options?.goMonth && this.to) this._kcCal.goMonth(this.to, 'to');
  }

  changeHovered(date: Date) {
    this._hovered = date;
  }

  protected _selectFrom(from: Date | null, options?: { goMonth?: boolean }): void {
    this._from = from;

    if (from && options?.goMonth) this._kcCal.goMonth(from, 'from');
  }

  protected _selectTo(to: Date | null, options?: { goMonth?: boolean }): void {
    this._to = to;

    if (to && options?.goMonth) this._kcCal.goMonth(to, 'to');
  }

  protected _changeRange(): void {
    if (this.from && this.to && this.from.getTime() > this.to.getTime()) {
      [this._from, this._to] = [this._to, this._from];
      this._selector ^= Selector.To;
    }

    this._range.next({
      from: this.from,
      to: this.to,
    });
  }

  private _startDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
