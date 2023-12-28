import { Injectable } from '@angular/core';
import {
  Observable,
  Subject,
  animationFrameScheduler,
  filter,
  interval,
  map,
  merge,
  of,
  pairwise,
  scan,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
  timeInterval,
  timer,
} from 'rxjs';

import { FakeProgressBarEvent, FakeProgressBarEventType, FakeProgressBarInit } from './fake-progress-bar.type';

@Injectable({ providedIn: 'root' })
export class K5cFakeProgressBarService {
  progress: Observable<number>;

  private _trigger: Subject<FakeProgressBarEvent>;
  private _progress: number;

  constructor() {
    this._trigger = new Subject();
    this._progress = 0;

    const initEvent: FakeProgressBarInit = { type: FakeProgressBarEventType.Init };

    let progress = 0;

    this.progress = this._trigger.asObservable().pipe(
      // stop the animation when all progress events have been completed
      filter((event) => {
        if (event.type === FakeProgressBarEventType.End) return !this._progress;

        return true;
      }),
      startWith(initEvent),
      pairwise(),
      timeInterval(),
      map(({ value: [prev, value], interval }) => {
        if (
          prev.type === FakeProgressBarEventType.Start &&
          value.type === FakeProgressBarEventType.Start &&
          prev.time > interval
        ) {
          const remaining = prev.time - interval;

          const time = remaining > value.time ? remaining : value.time;

          return { ...value, time, progress };
        }

        return { ...value, bp: progress };
      }),
      switchMap((event) => {
        if (event.type === FakeProgressBarEventType.Start)
          return interval(1, animationFrameScheduler).pipe(
            timeInterval(),
            map(({ interval }) => interval),
            // accumulate the current value of the progress
            scan((acc, curr) => acc + curr, 0),
            map((pastTime) => {
              // The starting position of the progress on x-coordinate
              const start = event.progress || 0;
              // The progress has to move 95 to the right
              const end = 95 - start;
              // The duration of the animation
              const duration = event.time;

              // The easing function https://www.desmos.com/calculator/taremnrd9c
              // t = pastTime, b = start, c = end, d = duration
              progress = end * (-Math.pow(2, (-10 * pastTime) / duration) + 1) + start;

              return progress;
            }),
            // stop the animation when the duration has passed
            takeUntil(timer(event.time)),
          );

        // when navigation has completed, set progress to 100%
        return merge(
          //
          of(100),
          timer(50),
        ).pipe(
          //
          tap({ complete: () => (progress = 0) }),
        );
      }),
      shareReplay(),
    );
  }

  start(time = 3000): void {
    this._progress += 1;
    this._trigger.next({ type: FakeProgressBarEventType.Start, time });
  }

  end(): void {
    if (this._progress > 0) this._progress -= 1;
    this._trigger.next({ type: FakeProgressBarEventType.End });
  }
}
