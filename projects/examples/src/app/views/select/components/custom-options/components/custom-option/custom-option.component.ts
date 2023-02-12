import { Component } from '@angular/core';

import { KcOptionComponent, provideKcOption } from '@k5cjs/select';

@Component({
  selector: 'app-custom-option',
  templateUrl: './custom-option.component.html',
  styleUrls: ['./custom-option.component.scss'],
  providers: [provideKcOption(CustomOptionComponent)],
})
export class CustomOptionComponent<V, K, L> extends KcOptionComponent<V, K, L> {}
