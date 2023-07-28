import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendsComponent } from './extends.component';

describe('ExtendsComponent', () => {
  let component: ExtendsComponent;
  let fixture: ComponentFixture<ExtendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
