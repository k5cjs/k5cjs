import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { KcCalWeekData } from '../../types';

@Component({
  selector: 'kc-cal-week',
  templateUrl: './kc-cal-week.component.html',
  styleUrls: ['./kc-cal-week.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalWeekComponent {
  @Input() week!: KcCalWeekData;
}
