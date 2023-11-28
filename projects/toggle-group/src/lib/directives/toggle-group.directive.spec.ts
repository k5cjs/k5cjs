import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { KcToggleGroupModule } from '../toggle-group.module';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [KcToggleGroupModule, ReactiveFormsModule],
      teardown: {
        destroyAfterEach: true,
      },
    });

    const fixture = TestBed.createComponent(DummyComponent);
    directive = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should write value on writeValue', () => {
    const selectSpy = spyOn(directive.toggleGroup, 'select');

    directive.toggleGroup.writeValue('a');

    expect(selectSpy).toHaveBeenCalledWith('a', false);
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

    directive.toggleGroup.select('a');

    expect(onChange).toHaveBeenCalledWith('a');
    expect(onTouched).toHaveBeenCalled();
  });
});
