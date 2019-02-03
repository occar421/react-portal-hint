context("Position", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/querying");
  });

  it("cy.get() - query DOM elements", () => {
    cy.get("#query-btn").should("contain", "Button");

    cy.get(".query-btn").should("contain", "Button");

    cy.get("#querying .well>button:first").should("contain", "Button");
    //              ↲
    // Use CSS selectors just like jQuery

    cy.get('[data-test-id="test-example"]').should("have.class", "example");
  });
});
