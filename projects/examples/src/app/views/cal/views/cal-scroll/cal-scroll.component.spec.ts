import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalScrollComponent } from './cal-scroll.component';

describe('CalScrollComponent', () => {
  let component: CalScrollComponent;
  let fixture: ComponentFixture<CalScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalScrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
