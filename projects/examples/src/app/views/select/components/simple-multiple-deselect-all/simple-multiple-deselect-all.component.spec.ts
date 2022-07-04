import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMultipleDeselectAllComponent } from './simple-multiple-deselect-all.component';

describe('SimpleMultipleDeselectAllComponent', () => {
  let component: SimpleMultipleDeselectAllComponent;
  let fixture: ComponentFixture<SimpleMultipleDeselectAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMultipleDeselectAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMultipleDeselectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
