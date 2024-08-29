import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { KcToggleModule } from '../toggle.module';

import { KcToggleGroupDirective } from './toggle-group.directive';

@Component({
  template: `
    <div toggleGroup #group="toggleGroup" [formControl]="control" [options]="options">
      <button
        (click)="group.select(value.value)"
        *toggleItem="let value; selected as selected"
        [value]="value"
        [class.selected]="selected"
      >
        {{ value.label }}
      </button>
    </div>
  `,
})
class DummyComponent {
  @ViewChild(KcToggleGroupDirective) toggleGroup!: KcToggleGroupDirective<string>;

  control = new FormControl('a');

  options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];
}

describe('KcToggleGroupDirective', () => {
  let directive: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [KcToggleModule, ReactiveFormsModule],
      teardown: {
        destroyAfterEach: true,
      },
    });

    fixture = TestBed.createComponent(DummyComponent);
    directive = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set a single value', () => {
    const _values = spyOn(directive.toggleGroup['_values'], 'set');
    const value = 'test-value';
    directive.toggleGroup.writeValue(value);

    expect(_values).toHaveBeenCalledWith([[value, value]]);
  });

  it('should set multiple values when the `multiple` input is true', () => {
    const _values = spyOn(directive.toggleGroup['_values'], 'set');
    directive.toggleGroup.multiple = true;
    const values = ['test-value1', 'test-value2'];
    directive.toggleGroup.writeValue(values);

    expect(_values).toHaveBeenCalledWith(values.map((value) => [value, value]));
  });

  it('should throw an error when setting multiple values when the `multiple` input is false', () => {
    const _values = spyOn(directive.toggleGroup['_values'], 'set');
    const values = ['test-value1', 'test-value2'];
    expect(() => directive.toggleGroup.writeValue(values)).toThrowError(
      'Cannot set multiple values to a single toggle group.',
    );
    expect(_values).not.toHaveBeenCalled();
  });

  it('should register onChange on registerOnChange', () => {
    const onChange = jasmine.createSpy();

    directive.toggleGroup.registerOnChange(onChange);

    expect(directive.toggleGroup['_onChange']).toBe(onChange);
  });

  it('should register onTouched on registerOnTouched', () => {
    const onTouched = jasmine.createSpy();

    directive.toggleGroup.registerOnTouched(onTouched);

    expect(directive.toggleGroup['_onTouch']).toBe(onTouched);
  });

  it('should select value, emit, and call onChange/onTouched', () => {
    const onChange = jasmine.createSpy();
    directive.toggleGroup['_onChange'] = onChange;

    const onTouched = jasmine.createSpy();
    directive.toggleGroup['_onTouch'] = onTouched;

    directive.toggleGroup.select('b');

    expect(onChange).toHaveBeenCalledWith('b');
    expect(onTouched).toHaveBeenCalled();
  });

  it('cannot unselect value that is selected in single toggle', () => {
    directive.toggleGroup.multiple = false;
    directive.toggleGroup.allowClear = false;
    const onChange = jasmine.createSpy();
    directive.toggleGroup['_onChange'] = onChange;

    const onTouched = jasmine.createSpy();
    directive.toggleGroup['_onTouch'] = onTouched;

    directive.toggleGroup.select('b');

    expect(onChange).toHaveBeenCalledWith('b');
    expect(onTouched).toHaveBeenCalled();

    const _values = spyOn(directive.toggleGroup['_values'], 'set');

    directive.toggleGroup.select('b');

    expect(_values).not.toHaveBeenCalled();
  });

  it('can unselect value that is selected in single toggle', () => {
    directive.toggleGroup.multiple = false;
    directive.toggleGroup.allowClear = true;
    const onChange = jasmine.createSpy();
    directive.toggleGroup['_onChange'] = onChange;

    const onTouched = jasmine.createSpy();
    directive.toggleGroup['_onTouch'] = onTouched;

    directive.toggleGroup.select('b');

    expect(onChange).toHaveBeenCalledWith('b');
    expect(onTouched).toHaveBeenCalled();

    const _values = spyOn(directive.toggleGroup['_values'], 'set');

    directive.toggleGroup.select('b');

    expect(_values).toHaveBeenCalled();
  });

  it('should toggle value when is multiple when is allow clear', () => {
    directive.toggleGroup.multiple = true;
    directive.toggleGroup.allowClear = true;
    const onChange = jasmine.createSpy();
    directive.toggleGroup['_onChange'] = onChange;

    const onTouched = jasmine.createSpy();
    directive.toggleGroup['_onTouch'] = onTouched;

    directive.toggleGroup.select('b');

    expect(onChange).toHaveBeenCalledWith('b');
    expect(onTouched).toHaveBeenCalled();

    const _values = spyOn(directive.toggleGroup['_values'], 'toggle');

    directive.toggleGroup.select('b');

    expect(_values).toHaveBeenCalled();
  });
});
