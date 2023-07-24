import { TestBed } from '@angular/core/testing';

import { KcCalSelector } from './kc-cal-selector.service';

describe('KcCalSelector', () => {
  let service: KcCalSelector;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KcCalSelector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
