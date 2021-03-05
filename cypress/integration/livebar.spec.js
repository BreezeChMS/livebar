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

  it('renders livebar', function () {
    cy.get('.livebar_container').should('be.visible');
  });

  it('shows watch live message', function () {
    cy.get('.livebar_container').should('contain', 'Watch Live in');
  });

  it('shows watch live message', function () {
    cy.get('.livebar_container').should('contain', 'Watch Live in');
  });
});
