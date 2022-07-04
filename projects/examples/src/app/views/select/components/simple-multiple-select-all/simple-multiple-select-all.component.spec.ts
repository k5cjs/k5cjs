import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMultipleSelectAllComponent } from './simple-multiple-select-all.component';

describe('SimpleMultipleSelectAllComponent', () => {
  let component: SimpleMultipleSelectAllComponent;
  let fixture: ComponentFixture<SimpleMultipleSelectAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMultipleSelectAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMultipleSelectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
