import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveComponent } from './move.component';

describe('MoveComponent', () => {
  let component: MoveComponent;
  let fixture: ComponentFixture<MoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
