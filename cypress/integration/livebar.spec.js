describe('Livebar', function () {
  before(() => {
    cy.server();

    // Stub the request to ping endpoint this test request is not logged.
    cy.route({
      method: 'POST',
      url: '/livebar/ping',
      response: [],
    });

    cy.visit('/');
  });

  it('displays livebar', () => {
    cy.get('.livebar_container').should('be.visible');
  });

  it('shows watch live message', () => {
    cy.get('.livebar_container').should('contain', 'Watch Live in');
  });

  it('displays in sidebar', () => {
    cy.get('#layout').select('sidebar');
    cy.get('.livebar_container').should('have.class', 'livebar-sidebar');
  });
  
  it('displays in header', () => {
    cy.get('#layout').select('header');
    cy.get('.livebar_container').should('have.class', 'livebar-header');
  });
  
  it('links to web address', () => {
    cy.get('a.livebar-button').should('have.attr', 'target', '_blank');
  });
  
  it('can add another service', () => {
    cy.get('#add_service').click();
    cy.get('#code').contains('data-service-2-day-of-week="0"');
    cy.get('#code').contains('data-service-2-hours="9"');
    cy.get('#code').contains('data-service-2-minutes="0"');
    cy.get('#code').contains('data-service-2-duration-minutes="40"');
  });
  
  it('livebar can be dismissed', () => {
    cy.get('#dismissable').select('yes');
    cy.get('.livebar-close').should('be.visible');
  });
});
