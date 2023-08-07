import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KcCalMonthComponent } from '@k5cjs/cal';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthComponent extends KcCalMonthComponent {}
