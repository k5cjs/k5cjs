import { animate, animateChild, query, stagger, state, style, transition, trigger } from '@angular/animations';

const enter = (fromState: string, toState: string) => {
  const fromStateString = String(fromState);
  const toStateString = String(toState);

  if (fromStateString === toStateString) return false;
  /**
   * this is use when user use animation [@modal]="true | false"
   */
  if (fromStateString === 'void' && toStateString === 'false') return false;

  return (
    /**
     * this is use when user use animation @modal
     */
    (fromStateString === 'void' && toStateString === 'null') ||
    /**
     * this is use when user use animation [@modal]="true | false"
     */
    (fromStateString === 'false' && toStateString === 'true')
  );
};

const leave = (fromState: string, toState: string) => {
  const fromStateString = String(fromState);
  const toStateString = String(toState);

  if (fromStateString === toStateString) return false;
  /**
   * this is use when user use boolean value
   */
  if (fromStateString === 'void' && toStateString === 'false') return false;

  return (
    /**
     * this is use when user use animation @modal
     */
    (fromStateString === 'null' && toStateString === 'void') ||
    /**
     * this is use when user use animation [@modal]="true | false"
     */
    (fromStateString === 'true' && toStateString === 'false')
  );
};

export const toggleY = trigger('toggleY', [
  state('void, false', style({ overflowY: 'hidden', height: 0, opacity: 0 })),
  state('*, true', style({ overflowY: '*', height: '*', opacity: '*' })),

  transition(enter, [animate('3s', style({ opacity: 1, height: '*' }))]),
  transition(leave, [animate('3s', style({ opacity: 0, height: 0 }))]),
]);

export const staggerChild = trigger('staggerChild', [
  // transition(staggerFn, [
  //   query('@*', [stagger('3s', animateChild())], { optional: true }),
  //   // query(':enter', [stagger('3s', animateChild())], { optional: true }),
  // ]),
  // transition(staggerFn, []),

  // transition(':enter, :leave', [query('@*', animateChild(), { optional: true })]),
  // transition(':enter, :leave', [query('@*', [], { optional: true })]),

  transition('* => *', [
    query(
      ':enter',
      [
        stagger(
          '.1s',
          [animate('0.5s', style({ opacity: 1 }))],
          // animateChild()
        ),
      ],
      { optional: true },
    ),
  ]),
]);

export const ngIf = trigger('ngIf', [transition(':enter, :leave', [query('@*', animateChild(), { optional: true })])]);

export const blockInitialRender = trigger('blockInitialRender', [transition(':enter, :leave', [])]);

export const sgr = trigger('stagger', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0 }), stagger(1000, [animate('0.5s', style({ opacity: 1 })), animateChild()])], {
      optional: true,
    }),
  ]),
]);
