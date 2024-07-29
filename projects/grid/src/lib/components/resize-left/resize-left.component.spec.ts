import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeTopComponent } from './resize-top.component';

describe('ResizeComponent', () => {
  let component: ResizeTopComponent;
  let fixture: ComponentFixture<ResizeTopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizeTopComponent],
    });
    fixture = TestBed.createComponent(ResizeTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
