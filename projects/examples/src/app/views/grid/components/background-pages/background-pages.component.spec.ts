import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundPagesComponent } from './background-pages.component';

describe('BackgroundPagesComponent', () => {
  let component: BackgroundPagesComponent;
  let fixture: ComponentFixture<BackgroundPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackgroundPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
