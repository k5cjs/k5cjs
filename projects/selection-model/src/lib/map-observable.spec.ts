import { TestBed } from '@angular/core/testing';

import { MapEmit } from './map-observable';

describe('MapEmit', () => {
  let service: MapEmit<unknown, unknown, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapEmit],
    });
    service = TestBed.inject<MapEmit<unknown, unknown, boolean>>(MapEmit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
