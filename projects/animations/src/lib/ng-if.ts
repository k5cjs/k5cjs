import { animateChild, query, transition, trigger } from '@angular/animations';

export const ngIf = () =>
  trigger('ngIf', [transition(':enter, :leave', [query('@*', animateChild(), { optional: true })])]);
