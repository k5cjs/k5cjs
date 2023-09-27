import { TestBed } from '@angular/core/testing';

import { Selector } from '../../types';
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

  it('should toggle selector after select (normal flow)', () => {
    service.select(new Date('08/10/2023'));
    service.select(new Date('09/10/2023'));
    expect(service['_selector']).toEqual(Selector.From);
    service.select(new Date('09/05/2023'));
    //from < to (should toggle)
    expect(service['_selector']).toEqual(Selector.To);
  });

  it('should keep selector after selecting intersected range', () => {
    service.select(new Date('08/10/2023'));
    service.select(new Date('09/10/2023'));
    expect(service['_selector']).toEqual(Selector.From);
    service.select(new Date('09/15/2023'));
    //from > to (should keep)
    expect(service['_selector']).toEqual(Selector.From);
  });
});
