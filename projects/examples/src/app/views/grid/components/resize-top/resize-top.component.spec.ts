import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeTopComponent } from './resize-top.component';

describe('ResizeTopComponent', () => {
  let component: ResizeTopComponent;
  let fixture: ComponentFixture<ResizeTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeTopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
