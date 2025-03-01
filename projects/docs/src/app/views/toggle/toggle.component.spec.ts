import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { KcToggleModule } from 'projects/toggle/src/public-api';

import { ToggleGroupRoutingModule } from './toggle-routing.module';
import { ToggleComponent } from './toggle.component';

describe('ToggleGroupComponent', () => {
  let component: ToggleComponent;
  let fixture: ComponentFixture<ToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ToggleGroupRoutingModule, KcToggleModule, ReactiveFormsModule],
      declarations: [ToggleComponent],
    });
    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
