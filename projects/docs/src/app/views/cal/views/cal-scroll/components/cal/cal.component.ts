import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { KC_CAL_SELECTOR, KcCalComponent, KcCalEvent, KcCalSelector } from '@k5cjs/cal';

@Component({
  selector: 'app-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: KC_CAL_SELECTOR,
      useClass: KcCalSelector,
    },
  ],
})
export class CalComponent extends KcCalComponent {
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport!: CdkVirtualScrollViewport;

  months: Date[];

  private _firstRender = true;

  constructor() {
    super();

    const startDate = new Date(0);
    const currentDate = new Date();

    const months = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + currentDate.getMonth();

    this.months = [];

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    for (let i = 0; i <= months; i++) {
      this.months.unshift(new Date(year, month));

      month--;

      if (month < 0) {
        year--;
        month = 11;
      }
    }
  }

  indexChanged(): void {
    if (!this._firstRender) return;

    this.viewport.scrollTo({ bottom: 0, behavior: 'instant' as ScrollBehavior });
    this._firstRender = false;
  }

  protected override _renderMonths({ month }: KcCalEvent): void {
    const startMonth = new Date(0);
    const allMonths = (month.getFullYear() - startMonth.getFullYear()) * 12 + month.getMonth();

    const height = 216;
    const viewportSize = this.viewport.getViewportSize();
    const margin = (viewportSize - height) / 2;

    this.viewport.scrollToOffset(allMonths * height - margin, 'smooth');
  }
}
