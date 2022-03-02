/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideValueAccessor } from './provide-value-accessor';

@Component({
  selector: 'lib-input',
  template: `
    <input [(ngModel)]="value" />
    <span>{{ value }}</span>
  `,
  providers: [provideValueAccessor(InputComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class InputComponent implements ControlValueAccessor {
  set value(val: unknown) {
    this._value = val;
  }
  get value(): unknown {
    return this._value;
  }
  private _value!: unknown;

  onChange = () => {};
  onTouch = () => {};

  writeValue(obj: unknown): void {
    this._value = obj;
  }
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => {}): void {
    this.onTouch = fn;
  }
}

describe('WrappedFormControl', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [FormsModule, ReactiveFormsModule],
    })
      .overrideComponent(InputComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('write value', () => {
    component.writeValue('test');

    expect(component.value).toEqual('test');
  });
});
