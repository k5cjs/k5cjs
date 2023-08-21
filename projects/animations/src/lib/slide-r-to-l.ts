import { animate, state, style, transition, trigger } from '@angular/animations';

import { stateChangeEnter, stateChangeLeave } from './state-change-fn';

export const slideRToL = (time: number = 100) =>
  trigger('slideRToL', [
    state('void, false', style({ opacity: 0 })),
    state('*, true', style({ opacity: '*' })),

    transition(
      stateChangeEnter,
      [
        //
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate(`{{ time }}ms`, style({ opacity: '*', transform: '*' })),
      ],
      { params: { time } },
    ),
    transition(
      stateChangeLeave,
      [
        //
        style({ opacity: '*', transform: '*' }),
        animate(`{{ time }}ms`, style({ opacity: 0, transform: 'translateX(100%)' })),
      ],
      { params: { time } },
    ),
  ]);
