import { TestBed } from '@angular/core/testing';

import { KcCalModule } from '../../cal.module';

import { KcCalSelector } from './kc-cal-selector.service';

describe('KcCalSelector', () => {
  let service: KcCalSelector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KcCalModule],
      providers: [KcCalSelector],
    });
    service = TestBed.inject(KcCalSelector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
