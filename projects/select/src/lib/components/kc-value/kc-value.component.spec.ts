import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcValueComponent } from './kc-value.component';

describe('KCValueComponent', () => {
  let component: KcValueComponent;
  let fixture: ComponentFixture<KcValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcValueComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
