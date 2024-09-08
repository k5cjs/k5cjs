import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeBottomLeftComponent } from './resize-bottom-left.component';

describe('ResizeComponent', () => {
  let component: ResizeBottomLeftComponent;
  let fixture: ComponentFixture<ResizeBottomLeftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizeBottomLeftComponent],
    });
    fixture = TestBed.createComponent(ResizeBottomLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
