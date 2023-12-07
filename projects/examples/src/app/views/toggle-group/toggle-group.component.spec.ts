import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { KcToggleGroupModule } from 'projects/toggle-group/src/public-api';

import { ToggleGroupRoutingModule } from './toggle-group-routing.module';
import { ToggleGroupComponent } from './toggle-group.component';

describe('ToggleGroupComponent', () => {
  let component: ToggleGroupComponent;
  let fixture: ComponentFixture<ToggleGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ToggleGroupRoutingModule, KcToggleGroupModule, ReactiveFormsModule],
      declarations: [ToggleGroupComponent],
    });
    fixture = TestBed.createComponent(ToggleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
