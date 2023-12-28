import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { K5cFakeProgressBarService } from './fake-progress-bar.service';

describe('K5cFakeProgressBarService', () => {
  let service: K5cFakeProgressBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(K5cFakeProgressBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test time in one animation', fakeAsync(() => {
    let value = 0;
    service.progress.subscribe((progress) => (value = progress));

    service.start(300);

    tick(300);

    expect(value).toBeGreaterThan(94);
  }));

  it('test delay after end', fakeAsync(() => {
    let value = 0;
    service.progress.subscribe((progress) => (value = progress));

    service.start();

    tick(3000);

    expect(value).toBeGreaterThan(94);

    service.end();

    tick(49);

    expect(value).toEqual(100);

    tick(1);

    expect(value).toEqual(0);
  }));

  it('two overlapping events, the second having a longer duration', fakeAsync(() => {
    let value = 0;
    service.progress.subscribe((progress) => (value = progress));

    service.start(10000);

    tick(2000);

    service.start(15000);

    tick(15000);

    expect(value).toBeGreaterThan(94);
  }));

  it('two overlapping events, the first having a longer duration', fakeAsync(() => {
    let value = 0;
    service.progress.subscribe((progress) => (value = progress));

    service.start(10000);

    tick(2000);

    service.start(5000);

    tick(8000);

    expect(value).toBeGreaterThan(94);
  }));
});
