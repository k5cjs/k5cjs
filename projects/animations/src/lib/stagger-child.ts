import { animateChild, query, stagger, transition, trigger } from '@angular/animations';

export const staggerChild = (time = 150) =>
  trigger('staggerChild', [
    transition(
      //
      '* <=> *',
      // issue: https://github.com/angular/angular/pull/47233
      // [query('@*', [stagger(`{{ time }}ms`, [animateChild()])], { optional: true })],
      [query('@*', [stagger(`${time}ms`, [animateChild()])], { optional: true })],
      { params: { time } },
    ),
  ]);
