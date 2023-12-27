import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';

import { KcCalDayDirective } from '../../directives';
import { KcCalDayData, KcCalWeekData } from '../../types';
import { KcCalDayComponent } from '../kc-cal-day/kc-cal-day.component';

@Component({
  selector: 'kc-cal-week',
  templateUrl: './kc-cal-week.component.html',
  styleUrls: ['./kc-cal-week.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcCalWeekComponent implements OnInit {
  @Input() week!: KcCalWeekData;

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  @ContentChild(KcCalDayDirective, { static: true }) day?: KcCalDayDirective;

  ngOnInit(): void {
    this._renderDays(this.week);
  }

  private _renderDays(week: KcCalWeekData): void {
    week.days.forEach((day) => this.container.insert(this._createViewRef(day)));
  }

  private _createViewRef(day: KcCalDayData): ViewRef {
    if (this.day) return this.day.template.createEmbeddedView({ $implicit: day });

    const dayComponentRef = this.container.createComponent(KcCalDayComponent);
    dayComponentRef.setInput('day', day.date);
    dayComponentRef.setInput('month', day.month);
    return dayComponentRef.hostView;
  }
}
