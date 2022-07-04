import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleWithoutFormControlComponent } from './simple-without-form-control.component';

describe('SimpleWithoutFormControlComponent', () => {
  let component: SimpleWithoutFormControlComponent;
  let fixture: ComponentFixture<SimpleWithoutFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleWithoutFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleWithoutFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
