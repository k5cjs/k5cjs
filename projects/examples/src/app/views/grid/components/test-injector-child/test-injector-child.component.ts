import { Component, inject } from '@angular/core';

import { TEST_INJECTOR } from '../../tokens';

@Component({
  selector: 'app-test-injector-child',
  templateUrl: './test-injector-child.component.html',
  styleUrl: './test-injector-child.component.scss',
})
export class TestInjectorChildComponent {
  testInjector = inject(TEST_INJECTOR);

  constructor() {
    // eslint-disable-next-line no-console
    console.log(this.testInjector);
  }
}
