import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { KcCalEvent } from '../../types';

@Injectable()
export class KcCal {
  readonly changes: Observable<KcCalEvent>;

  private _changes: BehaviorSubject<KcCalEvent>;

  constructor() {
    const date = new Date();
    const startMonth = new Date(date.getFullYear(), date.getMonth());

    this._changes = new BehaviorSubject<KcCalEvent>({
      month: startMonth,
      type: null,
    });

    this.changes = this._changes.asObservable();
  }

  get month(): Date {
    const { month } = this._changes.value;
    return month;
  }

  next(type: KcCalEvent['type'] = null): void {
    const { month } = this._changes.value;

    this._changes.next({
      month: new Date(month.getFullYear(), month.getMonth() + 1),
      type,
    });
  }

  prev(type: KcCalEvent['type'] = null): void {
    const { month } = this._changes.value;

    this._changes.next({
      month: new Date(month.getFullYear(), month.getMonth() - 1),
      type,
    });
  }

  goMonth(date: Date, type: KcCalEvent['type'] = null): void {
    const { month } = this._changes.value;

    if (month.getMonth() !== date.getMonth() || month.getFullYear() !== date.getFullYear())
      this._changes.next({
        month: new Date(date.getFullYear(), date.getMonth()),
        type,
      });
  }

  goYear(date: Date, type: KcCalEvent['type'] = null): void {
    const { month } = this._changes.value;

    if (month.getFullYear() !== date.getFullYear())
      this._changes.next({
        month: new Date(date.getFullYear(), month.getMonth()),
        type,
      });
  }
}
