import { Component, InjectionToken, Injector, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';

import { TEST_INJECTOR } from '../../tokens';
import { TestInjectorChildComponent } from '../test-injector-child/test-injector-child.component';

@Component({
  selector: 'app-test-injector',
  templateUrl: './test-injector.component.html',
  styleUrl: './test-injector.component.scss',
})
export class TestInjectorComponent implements OnInit {
  @ViewChild('container', { static: true, read: ViewContainerRef }) container!: ViewContainerRef;

  testInjector = inject(TEST_INJECTOR);
  private injector = inject(Injector);

  constructor() {
    if (!this.testInjector || this.testInjector !== 'test-injector') {
      throw new Error('TestInjectorComponent requires TEST_INJECTOR');
    }
  }
  ngOnInit(): void {
    this.container.createComponent(TestInjectorChildComponent, { injector: this.injector });
  }
}
