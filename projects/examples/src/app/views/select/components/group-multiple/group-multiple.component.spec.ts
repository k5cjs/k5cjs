import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMultipleComponent } from './group-multiple.component';

describe('GroupMultipleComponent', () => {
  let component: GroupMultipleComponent;
  let fixture: ComponentFixture<GroupMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
