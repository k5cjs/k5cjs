import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeBottomComponent } from './resize-bottom.component';

describe('ResizeBottomComponent', () => {
  let component: ResizeBottomComponent;
  let fixture: ComponentFixture<ResizeBottomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizeBottomComponent],
    });
    fixture = TestBed.createComponent(ResizeBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
