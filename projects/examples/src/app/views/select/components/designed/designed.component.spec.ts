import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignedComponent } from './designed.component';

describe('DesignedComponent', () => {
  let component: DesignedComponent;
  let fixture: ComponentFixture<DesignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
