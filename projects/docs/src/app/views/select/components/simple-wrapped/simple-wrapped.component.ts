import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { WrappedFormControl, provideValueAccessor } from '@k5cjs/forms';
import { KcOption, KcSelectComponent } from '@k5cjs/select';

@Component({
  selector: 'app-simple-wrapped-shared',
  template: `
    <kc-select [options]="options" multiple>
      <kc-value *kcValue></kc-value>
      <ng-container *kcValue>
        <div>test</div>
        <div #ref ngProjectAs="[value]" class="value">
          <ng-content select="[value]"></ng-content>
        </div>

        <button *ngIf="!ref.children.length" value>Default button</button>
      </ng-container>

      <div class="modal">
        <ng-content></ng-content>

        <div kcToggle>Toggle</div>
        <div kcClear>Clear</div>
        <div kcSelectAll>Select All</div>

        <div class="modal__options">
          <kc-options *kcOptions="let options" [options]="options">
            <kc-option *kcOption="let option" [option]="option"></kc-option>
          </kc-options>
        </div>

        <div kcSubmit>Submit</div>
      </div>
    </kc-select>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(SimpleWrappedSharedComponent)],
})
export class SimpleWrappedSharedComponent<T = unknown> extends WrappedFormControl {
  @Input() options!: KcOption<T, T>[];

  @ViewChild(KcSelectComponent, { static: true }) override valueAccessor!: ControlValueAccessor;
}

@Component({
  selector: 'app-simple-wrapped',
  template: `
    <pre>{{ control.value | json }}</pre>

    <app-simple-wrapped-shared [formControl]="control" [options]="options">
      <input [formControl]="search" kc-input type="text" />
    </app-simple-wrapped-shared>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleWrappedComponent {
  control: UntypedFormControl;
  search: UntypedFormControl;
  options: KcOption<string, string, string>[];

  constructor(private _fb: UntypedFormBuilder) {
    this.control = this._fb.control(['Location 2']);
    this.search = this._fb.control('');

    this.options = [
      {
        label: 'Location 1',
        value: 'Location 1',
      },
      {
        label: 'Location 2',
        value: 'Location 2',
      },
    ];
  }
}
