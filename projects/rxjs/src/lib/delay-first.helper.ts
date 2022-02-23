import { MonoTypeOperatorFunction, concatMap, delay, of } from 'rxjs';

export const delayFirst = <T>(due: number | Date = 300): MonoTypeOperatorFunction<T> => {
  return concatMap((value, index) => {
    if (index) return of(value);
    /**
     * add delay when index is 0
     * to add delay to the first event
     */
    //
    else return of(value).pipe(delay(due));
  });
};
