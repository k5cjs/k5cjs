import { TestBed } from '@angular/core/testing';

import { SelectionModel } from './selection-model';

describe('SelectionModel', () => {
  let service: SelectionModel<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
