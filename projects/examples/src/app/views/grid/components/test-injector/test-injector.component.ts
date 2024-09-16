import { Component, inject } from '@angular/core';

import { TEST_INJECTOR } from '../../tokens';

@Component({
  selector: 'app-test-injector',
  templateUrl: './test-injector.component.html',
  styleUrl: './test-injector.component.scss',
})
export class TestInjectorComponent {
  testInjector = inject(TEST_INJECTOR);

  constructor() {
    if (!this.testInjector || this.testInjector !== 'test-injector') {
      throw new Error('TestInjectorComponent requires TEST_INJECTOR');
    }
  }
}
