import {
  MonoTypeOperatorFunction,
  Observable,
  debounce,
  delayWhen,
  distinctUntilChanged,
  map,
  timeInterval,
  timer,
} from 'rxjs';

export const delayAnimation = <T extends boolean>(
  cycleTime: number = 300,
  skipTime: number = 100,
): MonoTypeOperatorFunction<T> => {
  return (animationState: Observable<T>): Observable<T> =>
    animationState.pipe(
      // remove duplicate events that come one after the other
      distinctUntilChanged(),

      // get time from event intervals
      timeInterval(),
      /**
       * add delay when loading time is greater than 100 and less than 300
       */
      delayWhen(({ value, interval }) => {
        /**
         * check if this step stops the animation
         */
        if (!value) {
          if (
            /**
             * interval is duration from last event to current event
             * if interval is greater than the skip time, then the animation is going to be started
             */
            interval > skipTime &&
            /**
             * check if the interval is less than the cycle time
             * if interval is lower than the cycle time, then the animation is going to continue
             */
            interval < cycleTime
          ) {
            /**
             * interval is duration from last event to current event
             * to calculate duration of the animation,
             * we need to subtract the skip time from the interval
             * because we use in debounce operator to delay the animation
             */
            const starting = interval - skipTime;
            /**
             * cycle time is the total duration of the animation
             */
            const toCompleteCycleTime = cycleTime - starting;

            return timer(toCompleteCycleTime);
          }
        }

        return timer(0);
      }),
      /**
       * get only loading state
       */
      map(({ value }) => value),
      /**
       * debounce prevent emit one event after the other
       */
      debounce((value) => {
        /**
         * skip starting animation if next emitted value interval is less than skip time
         * example:
         * skipTime = 100ms
         * true ---- 80ms ----> false
         * 80ms < skipTime --> debounce will prevent to emit true event
         */
        if (value) return timer(skipTime);
        else return timer(0);
      }),
    );
};
