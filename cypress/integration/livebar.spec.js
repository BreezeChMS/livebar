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
    cy.get('a.livebar-button').should('have.attr', 'target', '_blank')
  });
});
