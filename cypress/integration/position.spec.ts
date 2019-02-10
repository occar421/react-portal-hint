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

class TestHandler {
  private $body: JQuery<HTMLElement | Text | Comment>;

  public start() {
    cy.visit(generateStoryUrl("Default", "place"));
    cy.get("#storybook-preview-iframe").then($iframe => {
      this.$body = $iframe.contents().find("body");
      if (!this.$body) {
        throw new Error(
          "Failed to start due to iframe in Storybook not found."
        );
      }
    });
  }

  public selectPlaceOption(place: string) {
    cy.contains("Knobs").click();
    cy.get(`[value="Left > Top > Right (custom fallback)"]`)
      .parent()
      .select(place);
  }

  public dragAndDragTargetTo(x: number, y: number) {
    cy.wrap(this.$body)
      .contains("Move")
      .trigger("mousedown", "center")
      .trigger("mousemove", { clientX: x, clientY: y })
      .trigger("mouseup", { force: true });

    cy.wait(100); // considering animation delay
  }

  public toggleHint() {
    cy.wrap(this.$body)
      .contains("Toggle")
      .click();
  }

  public collectElements(): Cypress.Chainable<{
    target: HTMLElement;
    hint: HTMLElement;
  }> {
    return cy
      .wrap(this.$body)
      .find(`[data-testid="target"]`)
      .then($target => {
        return cy
          .wrap(this.$body)
          .find(`.react-portal-hint__body`)
          .then($hint => ({
            target: $target.get(0),
            hint: $hint.get(0)
          }));
      });
  }
}

context("Position", () => {
  const handler = new TestHandler();

  beforeEach(() => {
    handler.start();
  });

  it("top", () => {
    handler.selectPlaceOption("Top");

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetTop = target.getBoundingClientRect().top;
      const hintBottom = hint.getBoundingClientRect().bottom;

      expect(hintBottom).to.be.lessThan(targetTop);
    });
  });

  it("right", () => {
    handler.selectPlaceOption("Right");

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetRight = target.getBoundingClientRect().right;
      const hintLeft = hint.getBoundingClientRect().left;

      expect(hintLeft).to.be.greaterThan(targetRight);
    });
  });

  it("bottom", () => {
    handler.selectPlaceOption("Bottom");

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetBottom = target.getBoundingClientRect().bottom;
      const hintTop = hint.getBoundingClientRect().top;

      expect(hintTop).to.be.greaterThan(targetBottom);
    });
  });

  it("left", () => {
    handler.selectPlaceOption("Left");

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetLeft = target.getBoundingClientRect().left;
      const hintRight = hint.getBoundingClientRect().right;

      expect(hintRight).to.be.lessThan(targetLeft);
    });
  });

  it("column", () => {
    handler.selectPlaceOption("Column");

    handler.dragAndDragTargetTo(250, 250);

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetTop = target.getBoundingClientRect().top;
      const hintBottom = hint.getBoundingClientRect().bottom;

      // if enough space exists, hint is above the target
      expect(hintBottom).to.be.lessThan(targetTop);

      handler.dragAndDragTargetTo(250, 50);

      // tslint:disable-next-line:no-shadowed-variable
      handler.collectElements().then(({ target, hint }) => {
        const targetBottom = target.getBoundingClientRect().bottom;
        const hintTop = hint.getBoundingClientRect().top;

        // if no space, hint is below the target
        expect(hintTop).to.be.greaterThan(targetBottom);
      });
    });
  });

  it("row", () => {
    handler.selectPlaceOption("Row");

    handler.dragAndDragTargetTo(250, 250);

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetLeft = target.getBoundingClientRect().left;
      const hintRight = hint.getBoundingClientRect().right;

      // if enough space exists, hint is on left of the target
      expect(hintRight).to.be.lessThan(targetLeft);

      handler.dragAndDragTargetTo(50, 250);

      // tslint:disable-next-line:no-shadowed-variable
      handler.collectElements().then(({ target, hint }) => {
        const targetRight = target.getBoundingClientRect().right;
        const hintLeft = hint.getBoundingClientRect().left;

        // if no space, hint is on right of the target
        expect(hintLeft).to.be.greaterThan(targetRight);
      });
    });
  });

  it("start", () => {
    handler.selectPlaceOption("Start");

    handler.dragAndDragTargetTo(250, 250);

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetTop = target.getBoundingClientRect().top;
      const hintBottom = hint.getBoundingClientRect().bottom;

      // if enough space exists, hint is above the target
      expect(hintBottom).to.be.lessThan(targetTop);

      handler.dragAndDragTargetTo(250, 50);

      // tslint:disable-next-line:no-shadowed-variable
      handler.collectElements().then(({ target, hint }) => {
        const targetLeft = target.getBoundingClientRect().left;
        const hintRight = hint.getBoundingClientRect().right;

        // if no space, hint is on left of the target
        expect(hintRight).to.be.lessThan(targetLeft);
      });
    });
  });

  it("end", () => {
    handler.selectPlaceOption("End");

    handler.dragAndDragTargetTo(250, 250);

    handler.toggleHint();

    handler.collectElements().then(({ target, hint }) => {
      const targetBottom = target.getBoundingClientRect().bottom;
      const hintTop = hint.getBoundingClientRect().top;

      // if enough space exists, hint is below the target
      expect(hintTop).to.be.greaterThan(targetBottom);

      handler.dragAndDragTargetTo(250, 350);

      // tslint:disable-next-line:no-shadowed-variable
      handler.collectElements().then(({ target, hint }) => {
        const targetRight = target.getBoundingClientRect().right;
        const hintLeft = hint.getBoundingClientRect().left;

        // if no space, hint is on right of the target
        expect(hintLeft).to.be.greaterThan(targetRight);
      });
    });
  });
});
