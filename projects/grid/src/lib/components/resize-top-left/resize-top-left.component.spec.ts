import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeTopLeftComponent } from './resize-top-left.component';

describe('ResizeTopLeftComponent', () => {
  let component: ResizeTopLeftComponent;
  let fixture: ComponentFixture<ResizeTopLeftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizeTopLeftComponent],
    });
    fixture = TestBed.createComponent(ResizeTopLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
