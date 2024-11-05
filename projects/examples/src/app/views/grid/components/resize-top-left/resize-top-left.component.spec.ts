import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeTopLeftComponent } from './resize-top-left.component';

describe('ResizeTopLeftComponent', () => {
  let component: ResizeTopLeftComponent;
  let fixture: ComponentFixture<ResizeTopLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeTopLeftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeTopLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
