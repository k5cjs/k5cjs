import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcOptionsComponent } from './kc-options.component';

describe('DialogOptionsComponent', () => {
  let component: KcOptionsComponent;
  let fixture: ComponentFixture<KcOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KcOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
