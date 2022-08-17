import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBooleanToggleComponent } from './group-boolean-toggle.component';

describe('GroupBooleanToggleComponent', () => {
  let component: GroupBooleanToggleComponent;
  let fixture: ComponentFixture<GroupBooleanToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupBooleanToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBooleanToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
