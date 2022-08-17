import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBooleanComponent } from './group-boolean.component';

describe('GroupBooleanComponent', () => {
  let component: GroupBooleanComponent;
  let fixture: ComponentFixture<GroupBooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupBooleanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
