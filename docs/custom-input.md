# Custom Input

## Typescript

Below is an example of a custom input component in TypeScript. The component extends the `WrappedFormControl` class and utilizes the `provideValueAccessor` function to provide the ControlValueAccessor interface.

The `WrappedFormControl` class is used to provide the [`ControlValueAccessor`](https://angular.io/api/forms/ControlValueAccessor) interface to the component and to provide the `FormControl` instance to the component.

```ts
import { Component, Input } from '@angular/core';

import { WrappedFormControl, provideValueAccessor } from '@k5cjs/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [provideValueAccessor(CustomInputComponent)],
})
export class CustomInputComponent extends WrappedFormControl {
  @Input() name: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() label: string | undefined;
  @Input() type: 'text' | 'email' | 'password' = 'text';
}

```

The HTML template for the custom input component is as follows:

```html
<kc-form-field class="field">
  <!-- <form-label *ngIf="label" [value]="label" label></form-label> -->

  <ng-container ngProjectAs="[before]">
    <ng-content select="[before]"></ng-content>
  </ng-container>

  <kc-form-field-placeholder *ngIf="placeholder" [value]="placeholder"></kc-form-field-placeholder>

  <input ngDefaultControl kc-input [name]="name" tabindex="0" placeholder="" />

  <ng-container ngProjectAs="[after]">
    <ng-content select="[after]"></ng-content>
  </ng-container>
</kc-form-field>
```

Here are the styles for the custom input component in both Tailwind and regular SCSS:

::: code-group

```scss [Scss Tailwind]
.field {
  @apply w-full
    m-0
    py-2
    px-1;
}

input {
  @apply w-full
    m-0
    p-0
    border-none
    box-border
    bg-transparent
    outline-none
    placeholder-slate-400
    truncate;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    @apply [background:transparent]
      bg-[#fff]
      shadow-inner
      shadow-transparent
      transition-colors
      duration-[5000s];
  }

  /**
   * for removing the highlight on iOS
   */
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    /**
     * for removing opacity on disabled inputs in Safari
     */
    @apply opacity-100;
  }
}
```

```scss [Scss]
.field {
  width: 100%;
  margin: 0;
  padding: 0.5rem 0.25rem;
}

input {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border-style: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: transparent;
  outline: 0;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 6%);
    background: transparent;
    background-color: #fff;
    transition-duration: 5000s;
    transition-property: background-color, border-color, color, fill, stroke;
  }

  /**
   * for removing the highlight on iOS
   */
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    /**
     * for removing opacity on disabled inputs in Safari
     */
    opacity: 1;
  }
}
```

:::


<iframe
  width="100%"
  height="315"
  frameBorder="0"
  src="/k5cjs/examples/input/"
></iframe>
