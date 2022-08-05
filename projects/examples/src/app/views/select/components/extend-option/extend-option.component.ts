import { Component } from '@angular/core';

import { KcOptionComponent, provideKcOption } from '@k5cjs/select';

@Component({
  selector: 'app-extend-option',
  templateUrl: './extend-option.component.html',
  styleUrls: ['./extend-option.component.scss'],
  providers: [provideKcOption(ExtendOptionComponent)],
})
export class ExtendOptionComponent extends KcOptionComponent<unknown, unknown> {
  override click(): void {
    console.log('override click');
  }
}
