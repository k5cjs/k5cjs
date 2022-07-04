import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleWrappedComponent } from './simple-wrapped.component';

describe('SimpleWrappedComponent', () => {
  let component: SimpleWrappedComponent;
  let fixture: ComponentFixture<SimpleWrappedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleWrappedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleWrappedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
