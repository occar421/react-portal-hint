/// <reference types="cypress" />
/* tslint:disable:no-implicit-dependencies */
import * as Chai from "chai";

declare const expect: Chai.ExpectStatic;

function generateStoryUrl(
  kind: string,
  story: string,
  baseUrl: string = Cypress.env("BASE_URL")
) {
  return `${baseUrl}/?selectedKind=${encodeURIComponent(
    kind
  )}&selectedStory=${encodeURIComponent(story)}`;
}

context("Position", () => {
  it("top", () => {
    cy.visit(generateStoryUrl("Default", "place"));

    cy.get("#storybook-preview-iframe").then($iframe => {
      const $body = $iframe.contents().find("body");

      cy.wrap($body)
        .contains("Toggle")
        .click();

      cy.wrap($body)
        .find(`[data-testid="target"]`)
        .then($target => {
          const targetRect = $target.get(0).getBoundingClientRect();

          cy.wrap($body)
            .find(".react-portal-hint__body")
            .then($hint => {
              const hintRect = $hint.get(0).getBoundingClientRect();

              expect(hintRect.bottom).to.be.lessThan(targetRect.top);
            });
        });
    });
  });
});
