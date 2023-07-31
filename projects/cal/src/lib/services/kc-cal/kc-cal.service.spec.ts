import { TestBed } from '@angular/core/testing';

import { KcCalModule } from '../../cal.module';

import { KcCal } from './kc-cal.service';

describe('KcCal', () => {
  let service: KcCal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KcCalModule],
    });
    service = TestBed.inject(KcCal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
