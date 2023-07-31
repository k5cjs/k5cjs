import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class KcCal {
  readonly monthChanges: Observable<Date>;

  private _month: BehaviorSubject<Date>;

  constructor() {
    const date = new Date();
    const startMonth = new Date(date.getFullYear(), date.getMonth());

    this._month = new BehaviorSubject(startMonth);

    this.monthChanges = this._month.asObservable();
  }

  get month(): Date {
    return this._month.value;
  }

  next(): void {
    this._month.next(new Date(this._month.value.getFullYear(), this._month.value.getMonth() + 1));
  }

  prev(): void {
    this._month.next(new Date(this._month.value.getFullYear(), this._month.value.getMonth() - 1));
  }

  goMonth(date: Date): void {
    const prev = this._month.value;

    if (prev.getMonth() !== date.getMonth() || prev.getFullYear() !== date.getFullYear())
      this._month.next(new Date(date.getFullYear(), date.getMonth()));
  }

  goYear(date: Date): void {
    const prev = this._month.value;

    if (prev.getFullYear() !== date.getFullYear()) {
      this._month.next(new Date(date.getFullYear(), prev.getMonth()));
    }
  }
}
