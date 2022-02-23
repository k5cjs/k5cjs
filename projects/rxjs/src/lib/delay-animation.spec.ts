import { Observable, ReplaySubject } from 'rxjs';

import { delayAnimation } from './delay-animation.helper';

describe('SelectionModel', () => {
  let state: ReplaySubject<boolean>;
  let loading: Observable<boolean>;

  beforeEach(() => {
    state = new ReplaySubject<boolean>();
    loading = state.asObservable();
  });

  it('check default values for delayAnimation and loading duration is less that 100ms', (done) => {
    state.next(true);

    const time = performance.now();

    loading.pipe(delayAnimation()).subscribe((value) => {
      const currentTime = performance.now();
      const duration = currentTime - time;

      expect(duration).toBeGreaterThan(80);
      expect(duration).toBeLessThan(100);
      expect(value).toBeFalse();
      done();
    });

    setTimeout(() => state.next(true), 50);
    setTimeout(() => state.next(false), 90);
  });

  it('check default values for delayAnimation and loading duration is greater that 100ms', (done) => {
    state.next(true);

    let time = performance.now();
    let i = 0;

    loading.pipe(delayAnimation()).subscribe((value) => {
      i += 1;

      if (i === 1) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(90);
        expect(duration).toBeLessThan(110);
        expect(value).toBeTrue();

        time = currentTime;
      } else if (i === 2) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(290);
        expect(duration).toBeLessThan(310);
        expect(value).toBeFalse();
        done();
      }
    });

    setTimeout(() => state.next(true), 50);
    setTimeout(() => state.next(false), 120);
  });

  it('check when default value is true and the loading time is less than 100 ms', (done) => {
    state.next(true);

    const time = performance.now();

    loading.pipe(delayAnimation(2000, 100)).subscribe((value) => {
      const currentTime = performance.now();
      const duration = currentTime - time;

      expect(duration).toBeGreaterThanOrEqual(50);
      expect(duration).toBeLessThan(100);
      expect(value).toBeFalse();
      done();
    });

    setTimeout(() => state.next(true), 30);
    setTimeout(() => state.next(false), 50);
  });

  it('check when default value is false and the loading time is less than 100 ms', (done) => {
    state.next(false);

    const time = performance.now();
    let i = 0;

    loading.pipe(delayAnimation(2000, 100)).subscribe((value) => {
      i += 1;

      if (i === 1) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeLessThan(10);
        expect(value).toBeFalse();
      } else if (i === 2) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThan(50);
        expect(duration).toBeLessThan(100);
        expect(value).toBeFalse();

        done();
      }
    });

    setTimeout(() => state.next(true), 30);
    setTimeout(() => state.next(false), 50);
  });

  it('check when default value is void and the loading time is less than 100 ms', (done) => {
    const time = performance.now();

    loading.pipe(delayAnimation(2000, 100)).subscribe((value) => {
      const currentTime = performance.now();
      const duration = currentTime - time;

      expect(duration).toBeGreaterThan(50);
      expect(duration).toBeLessThan(100);
      expect(value).toBeFalse();
      done();
    });

    setTimeout(() => state.next(true), 30);
    setTimeout(() => state.next(false), 50);
  });

  it('check when default value is false and the loading time is greater than 100 ms', (done) => {
    state.next(false);

    let time = performance.now();
    let i = 0;

    loading.pipe(delayAnimation(2000, 100)).subscribe((value) => {
      i += 1;

      if (i === 1) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeLessThanOrEqual(10);
        expect(value).toBeFalse();
        time = currentTime;
      } else if (i === 2) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThanOrEqual(50);
        expect(value).toBeTrue();
        time = currentTime;
      } else if (i === 3) {
        const currentTime = performance.now();
        const duration = currentTime - time;

        expect(duration).toBeGreaterThanOrEqual(1990);
        expect(value).toBeFalse();

        done();
      }
    });

    setTimeout(() => state.next(true), 50);
    setTimeout(() => state.next(false), 250);
  }, 3000);
});
