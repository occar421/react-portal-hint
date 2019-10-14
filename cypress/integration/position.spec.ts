/// <reference types="cypress" />
/* tslint:disable:no-implicit-dependencies */
import * as Chai from "chai";
import "cypress-wait-until";

declare const expect: Chai.ExpectStatic;

function generateStoryUrl(
  kind: string,
  story: string,
  baseUrl: string = Cypress.env("BASE_URL")
): string {
  return `${baseUrl}/?selectedKind=${encodeURIComponent(
    kind
  )}&selectedStory=${encodeURIComponent(story)}`;
}

class TestHandler {
  private get $body() {
    return new Cypress.Promise((resolve: (arg: unknown) => void) => {
      cy.get("#storybook-preview-iframe").then($iframe => {
        const body = $iframe.contents().find("body");
        resolve(body);
      });
    });
  }

  public start(): void {
    cy.visit(generateStoryUrl("Default", "place"));

    // The playground height is too short by the pane.
    // This change the orientation of the pane and gain the playground height
    cy.get("button[title='Change orientation']").click();

    cy.contains("Smooth move").click();

    this.toggleHint();
  }

  public selectPlaceOption(place: string): void {
    cy.contains("Knobs").click();
    cy.get(`select[name="place"]`).select(place, { force: true });

    cy.waitUntil(() =>
      cy.get(`select[name="place"]`).then($select => $select.val() === place)
    );

    cy.wait(250);
  }

  public dragAndDragTargetTo(x: number, y: number): void {
    let prev: { x: number; y: number } | undefined = undefined;

    cy.wrap(this.$body)
      .find("div.handle")
      .then(($handle: JQuery<HTMLElement>) => {
        const position = $handle.position();
        const width = $handle.width() || 0;
        const height = $handle.height() || 0;

        prev = {
          x: position.left + width / 2,
          y: position.top + height / 2
        };
      });

    cy.wrap(this.$body)
      .contains("Move")
      .trigger("mousedown", "center")
      .trigger("mousemove", { clientX: x, clientY: y })
      .trigger("mouseup", { force: true });

    cy.waitUntil(() =>
      cy
        .wrap(this.$body)
        .find("div.handle")
        .then(($handle: JQuery<HTMLElement>) => {
          const position = $handle.position();
          const width = $handle.width() || 0;
          const height = $handle.height() || 0;

          const current = {
            x: position.left + width / 2,
            y: position.top + height / 2
          };

          return !(prev && prev.x === current.x && prev.y === current.y);
        })
    );

    cy.wait(250);
  }

  public toggleHint(): void {
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

    handler.collectElements().then(({ target, hint }) => {
      const targetTop = target.getBoundingClientRect().top;
      const hintBottom = hint.getBoundingClientRect().bottom;

      expect(hintBottom).to.be.lessThan(targetTop);
    });
  });

  it("right", () => {
    handler.selectPlaceOption("Right");

    handler.collectElements().then(({ target, hint }) => {
      const targetRight = target.getBoundingClientRect().right;
      const hintLeft = hint.getBoundingClientRect().left;

      expect(hintLeft).to.be.greaterThan(targetRight);
    });
  });

  it("bottom", () => {
    handler.selectPlaceOption("Bottom");

    handler.collectElements().then(({ target, hint }) => {
      const targetBottom = target.getBoundingClientRect().bottom;
      const hintTop = hint.getBoundingClientRect().top;

      expect(hintTop).to.be.greaterThan(targetBottom);
    });
  });

  it("left", () => {
    handler.selectPlaceOption("Left");

    handler.collectElements().then(({ target, hint }) => {
      const targetLeft = target.getBoundingClientRect().left;
      const hintRight = hint.getBoundingClientRect().right;

      expect(hintRight).to.be.lessThan(targetLeft);
    });
  });

  it("column", () => {
    handler.selectPlaceOption("Column");

    handler.dragAndDragTargetTo(250, 250);

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

    handler.collectElements().then(({ target, hint }) => {
      const targetBottom = target.getBoundingClientRect().bottom;
      const hintTop = hint.getBoundingClientRect().top;

      // if enough space exists, hint is below the target
      expect(hintTop).to.be.greaterThan(targetBottom);

      handler.dragAndDragTargetTo(250, 500);

      // tslint:disable-next-line:no-shadowed-variable
      handler.collectElements().then(({ target, hint }) => {
        const targetRight = target.getBoundingClientRect().right;
        const hintLeft = hint.getBoundingClientRect().left;

        // if no space, hint is on right of the target
        expect(hintLeft).to.be.greaterThan(targetRight);
      });
    });
  });

  it("custom (left -> top -> right)", () => {
    handler.selectPlaceOption("Left > Top > Right (custom fallback)");

    handler.dragAndDragTargetTo(250, 250);

    handler.collectElements().then(({ target, hint }) => {
      const targetLeft = target.getBoundingClientRect().left;
      const hintRight = hint.getBoundingClientRect().right;

      // o left
      expect(hintRight).to.be.lessThan(targetLeft);

      handler.dragAndDragTargetTo(150, 250);

      // tslint:disable-next-line:no-shadowed-variable
      handler.collectElements().then(({ target, hint }) => {
        const targetTop = target.getBoundingClientRect().top;
        const hintBottom = hint.getBoundingClientRect().bottom;

        // x left(no left space) -> o top
        expect(hintBottom).to.be.lessThan(targetTop);

        handler.dragAndDragTargetTo(50, 250);

        // tslint:disable-next-line:no-shadowed-variable
        handler.collectElements().then(({ target, hint }) => {
          const targetRight = target.getBoundingClientRect().right;
          const hintLeft = hint.getBoundingClientRect().left;

          // x left(no left space) -> x top (no left space) -> o bottom
          expect(hintLeft).to.be.greaterThan(targetRight);

          handler.dragAndDragTargetTo(150, 50);

          // tslint:disable:no-shadowed-variable
          handler.collectElements().then(({ target, hint }) => {
            const targetRight = target.getBoundingClientRect().right;
            const hintLeft = hint.getBoundingClientRect().left;
            // tslint:enable:no-shadowed-variable

            // x left(no left space) -> x top (no top space) -> o bottom
            expect(hintLeft).to.be.greaterThan(targetRight);
          });
        });
      });
    });
  });
});
