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

function selectPlace(place: string) {
  cy.contains("Knobs").click();
  cy.get(`[value="Left > Top > Right (custom fallback)"]`)
    .parent()
    .select(place);
}

function showHintAndCollectElement() {
  return cy.get("#storybook-preview-iframe").then($iframe => {
    const $body = $iframe.contents().find("body");

    cy.wrap($body)
      .contains("Toggle")
      .click();

    return cy
      .wrap($body)
      .find(`[data-testid="target"]`)
      .then($target => {
        const target = $target.get(0);

        return cy
          .wrap($body)
          .find(".react-portal-hint__body")
          .then($hint => {
            const hint = $hint.get(0);

            return { target, hint };
          });
      });
  });
}

context("Position", () => {
  beforeEach(() => {
    cy.visit(generateStoryUrl("Default", "place"));
  });

  it("top", () => {
    selectPlace("Top");

    showHintAndCollectElement().then(({ target, hint }) => {
      const targetTop = target.getBoundingClientRect().top;
      const hintBottom = hint.getBoundingClientRect().bottom;

      expect(hintBottom).to.be.lessThan(targetTop);
    });
  });

  it("right", () => {
    selectPlace("Right");

    showHintAndCollectElement().then(({ target, hint }) => {
      const targetRight = target.getBoundingClientRect().right;
      const hintLeft = hint.getBoundingClientRect().left;

      expect(hintLeft).to.be.greaterThan(targetRight);
    });
  });

  it("bottom", () => {
    selectPlace("Bottom");

    showHintAndCollectElement().then(({ target, hint }) => {
      const targetBottom = target.getBoundingClientRect().bottom;
      const hintTop = hint.getBoundingClientRect().top;

      expect(hintTop).to.be.greaterThan(targetBottom);
    });
  });

  it("left", () => {
    selectPlace("Left");

    showHintAndCollectElement().then(({ target, hint }) => {
      const targetLeft = target.getBoundingClientRect().left;
      const hintRight = hint.getBoundingClientRect().right;

      expect(hintRight).to.be.lessThan(targetLeft);
    });
  });
});
