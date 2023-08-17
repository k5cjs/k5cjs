import { TestBed } from '@angular/core/testing';

import { KcCal } from '../kc-cal/kc-cal.service';

import { KcCalSelector } from './kc-cal-selector.service';

describe('KcCalSelector', () => {
  let service: KcCalSelector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KcCal, KcCalSelector],
    });
    service = TestBed.inject(KcCalSelector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
