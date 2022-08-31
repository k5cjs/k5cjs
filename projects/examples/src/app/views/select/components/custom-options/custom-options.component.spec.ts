import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOptionsComponent } from './custom-options.component';

describe('CustomOptionsComponent', () => {
  let component: CustomOptionsComponent;
  let fixture: ComponentFixture<CustomOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
