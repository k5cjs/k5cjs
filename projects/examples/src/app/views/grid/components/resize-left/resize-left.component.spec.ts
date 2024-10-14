import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeLeftComponent } from './resize-left.component';

describe('ResizeLeftComponent', () => {
  let component: ResizeLeftComponent;
  let fixture: ComponentFixture<ResizeLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeLeftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
