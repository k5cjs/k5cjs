import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

import { KcCalMonthDirective } from '../../directives';
import { KcCal, KcCalSelector } from '../../services';
import { KC_CAL_SELECTOR } from '../../tokens';
import { KcCalEvent } from '../../types';

@Component({
  selector: 'kc-cal',
  templateUrl: './kc-cal.component.html',
  styleUrls: ['./kc-cal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: KC_CAL_SELECTOR,
      useClass: KcCalSelector,
    },
    KcCal,
  ],
})
export class KcCalComponent implements AfterContentInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef, static: true }) protected _container!: ViewContainerRef;

  @ContentChild(KcCalMonthDirective, { static: true }) monthRef!: KcCalMonthDirective;

  public kcCal: KcCal;
  private _destroy: Subject<void>;

  constructor() {
    this.kcCal = inject(KcCal);
    this._destroy = new Subject();
  }

  ngAfterContentInit(): void {
    this.kcCal.changes
      .pipe(
        takeUntil(this._destroy),
        distinctUntilChanged(
          ({ month: prevMonth, type: prevType }, { month: currentMonth, type: currentType }) =>
            /**
             * check if is the same month
             * if is the same month skip to render one more time for this month
             */
            prevMonth.getFullYear() === currentMonth.getFullYear() &&
            prevMonth.getMonth() === currentMonth.getMonth() &&
            prevType === currentType,
        ),
      )
      .subscribe((event) => {
        this._renderMonths(event);
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _renderMonths({ month }: KcCalEvent): void {
    this._container.clear();

    const monthViewRef = this.monthRef.template.createEmbeddedView({ $implicit: month });
    this._container.insert(monthViewRef);
  }
}
