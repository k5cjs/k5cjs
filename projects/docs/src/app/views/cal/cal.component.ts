import { ChangeDetectionStrategy, Component, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en',
    },
  ],
})
export class CalComponent {}
