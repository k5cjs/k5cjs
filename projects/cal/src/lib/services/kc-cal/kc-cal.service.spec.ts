import { TestBed } from '@angular/core/testing';

import { KcCal } from './kc-cal.service';

describe('KcCal', () => {
  let service: KcCal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KcCal],
    });
    service = TestBed.inject(KcCal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
