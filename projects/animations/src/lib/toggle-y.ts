import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

import { stateChangeEnter, stateChangeLeave, stateChanged } from './state-change-fn';

/**
 *
 * element need to be a block element
 */
export const toggleY = (time = 100) =>
  trigger('toggleY', [
    state('void, false', style({ overflowY: 'hidden', height: 0, opacity: 0 })),
    state('*, true', style({ overflowY: '*', height: '*', opacity: '*' })),

    transition(
      stateChangeEnter,
      [
        style({ overflowY: 'hidden', height: 0, opacity: 0 }),
        animate(`{{ time }}ms`, style({ opacity: 1, height: '*' })),
      ],
      { params: { time } },
    ),
    transition(
      stateChangeLeave,
      [
        //
        style({ overflowY: 'hidden' }),
        animate(`{{ time }}ms`, style({ opacity: 0, height: 0 })),
      ],
      { params: { time } },
    ),
    transition(
      stateChanged,
      [
        style({ overflowY: 'hidden', height: '{{ height }}px' }),
        group([
          //
          query('@*', animateChild(), { optional: true }),
          animate(`{{ time }}ms`, style({ height: '*' })),
        ]),
      ],
      {
        params: { time, height: 0 },
      },
    ),
  ]);
