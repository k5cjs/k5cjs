import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionToggleComponent } from './option-toggle.component';

describe('OptionToggleComponent', () => {
  let component: OptionToggleComponent;
  let fixture: ComponentFixture<OptionToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
