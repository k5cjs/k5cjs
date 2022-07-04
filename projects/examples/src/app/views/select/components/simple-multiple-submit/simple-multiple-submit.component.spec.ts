import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMultipleSubmitComponent } from './simple-multiple-submit.component';

describe('SimpleMultipleSubmitComponent', () => {
  let component: SimpleMultipleSubmitComponent;
  let fixture: ComponentFixture<SimpleMultipleSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMultipleSubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMultipleSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
