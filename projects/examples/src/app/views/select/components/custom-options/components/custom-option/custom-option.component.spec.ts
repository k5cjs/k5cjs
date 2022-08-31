import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOptionComponent } from './custom-option.component';

describe('CustomOptionComponent', () => {
  let component: CustomOptionComponent;
  let fixture: ComponentFixture<CustomOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
