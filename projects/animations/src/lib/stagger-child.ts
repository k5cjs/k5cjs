import { animateChild, query, stagger, transition, trigger } from '@angular/animations';

export const staggerChild = (time: number = 150) =>
  trigger('staggerChild', [
    transition(
      //
      '* <=> *',
      [query('@*', [stagger(`{{ time }}ms`, [animateChild()])], { optional: true })],
      { params: { time } },
    ),
  ]);
