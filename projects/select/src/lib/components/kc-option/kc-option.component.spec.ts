import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcOptionComponent } from './kc-option.component';

describe('OptionComponent', () => {
  let component: KcOptionComponent;
  let fixture: ComponentFixture<KcOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KcOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
