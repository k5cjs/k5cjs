import { animate, state, style, transition, trigger } from '@angular/animations';

import { stateChangeEnter, stateChangeLeave } from './state-change-fn';

/**
 *
 * element need to be a block element
 */
export const toggleO = (time = 100) =>
  trigger('toggleO', [
    state('void, false', style({ opacity: 0 })),
    state('*, true', style({ opacity: '*' })),

    transition(
      stateChangeEnter,
      [
        //
        style({ opacity: 0 }),
        animate(`{{ time }}ms`, style({ opacity: '*' })),
      ],
      {
        params: { time },
      },
    ),
    transition(
      stateChangeLeave,
      [
        //
        style({ opacity: '*' }),
        animate(`{{ time }}ms`, style({ opacity: 0 })),
      ],
      { params: { time } },
    ),
  ]);
