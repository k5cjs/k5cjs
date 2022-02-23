import { Observable, ReplaySubject } from 'rxjs';

import { delayFirst } from './delay-first.helper';

describe('SelectionModel', () => {
  let state: ReplaySubject<boolean>;
  let loading: Observable<boolean>;

  beforeEach(() => {
    state = new ReplaySubject<boolean>();
    loading = state.asObservable();
  });

  it('check default value', (done) => {
    const time = performance.now();
    let i = 0;

    loading.pipe(delayFirst()).subscribe((value) => {
      i += 1;

      if (i === 1) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(290);
        expect(duration).toBeLessThan(310);
        expect(value).toBeTrue();
      } else if (i === 2) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(290);
        expect(duration).toBeLessThan(310);
        expect(value).toBeFalse();
        done();
      }
    });

    setTimeout(() => state.next(true), 0);
    setTimeout(() => state.next(false), 100);
  });

  it('check value', (done) => {
    const time = performance.now();
    let i = 0;

    loading.pipe(delayFirst(1000)).subscribe((value) => {
      i += 1;

      if (i === 1) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(990);
        expect(duration).toBeLessThan(1010);
        expect(value).toBeTrue();
      } else if (i === 2) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(990);
        expect(duration).toBeLessThan(1010);
        expect(value).toBeFalse();
        done();
      }
    });

    setTimeout(() => state.next(true), 0);
    setTimeout(() => state.next(false), 100);
  });

  it('check next event after delay', (done) => {
    const time = performance.now();
    let i = 0;

    loading.pipe(delayFirst(1000)).subscribe((value) => {
      i += 1;

      if (i === 1) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(990);
        expect(duration).toBeLessThan(1010);
        expect(value).toBeTrue();
      } else if (i === 2) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(1190);
        expect(duration).toBeLessThan(1210);
        expect(value).toBeFalse();
        done();
      }
    });

    setTimeout(() => state.next(true), 0);
    setTimeout(() => state.next(false), 1200);
  });
});
