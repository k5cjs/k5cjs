import { animateChild, query, transition, trigger } from '@angular/animations';

export const ngIf = (animation = '@*') =>
  trigger('ngIf', [transition(':enter, :leave', [query(animation, animateChild(), { optional: true })])]);
