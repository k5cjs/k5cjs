import { MountConfig } from 'cypress/angular';

import { SelectSimpleComponent } from './select-simple.component';
import { SelectSimpleModule } from './select-simple.module';

describe('SelectSimpleComponent', () => {
  const config: MountConfig<SelectSimpleComponent> = {
    imports: [SelectSimpleModule],
  };

  it('mounts', () => {
    void cy.mount(SelectSimpleComponent, config).then((wrapper) => {
      cy.wrap(wrapper.component.control).as('instance');
    });

    cy.get('kc-select').click();
    cy.get('kc-option').eq(0).click();

    // cy.get('@instance').its('value').should('eq', 'null');

    cy.get('body').click();

    cy.get('@instance').its('value').should('eq', 'Location 1');
  });
});
