import { Component, ViewChild } from '@angular/core';

import { MountConfig } from 'cypress/angular';

import { KcInput } from './kc-input';

@Component({
  selector: 'kc-wrap',
  template: `
    <input type="text" kc-input />
  `,
})
class WrapComponent {
  @ViewChild(KcInput, { static: true }) input!: KcInput<string>;
}

describe('KcInput', () => {
  const config: MountConfig<WrapComponent> = {
    imports: [KcInput],
  };

  it('mounts', () => {
    void cy.mount(WrapComponent, config).then((wrapper) => {
      cy.wrap(wrapper.component.input).as('instance');
    });

    cy.get('input').click();

    cy.get('@instance').its('focused').should('eq', true);
  });
});
