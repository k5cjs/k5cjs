import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

import { stateChangeEnter, stateChangeLeave } from './state-change-fn';

/**
 *
 * element need to be a block element
 */
export const toggleO = (time = 100, delay = 0, animation = '@*') =>
  trigger('toggleO', [
    state('void, false', style({ opacity: 0 })),
    state('*, true', style({ opacity: '*' })),

    transition(
      stateChangeEnter,
      [
        //
        style({ opacity: 0 }),
        group([
          //
          animate(`{{ time }}ms {{ delay }}ms`, style({ opacity: '*' })),
          query(animation, animateChild(), { optional: true }),
        ]),
      ],
      {
        params: { time, delay },
      },
    ),
    transition(
      stateChangeLeave,
      [
        //
        style({ opacity: '*' }),
        group([
          //
          animate(`{{ time }}ms {{ delay }}ms`, style({ opacity: 0 })),
          query(animation, animateChild(), { optional: true }),
        ]),
      ],
      { params: { time, delay } },
    ),
  ]);
