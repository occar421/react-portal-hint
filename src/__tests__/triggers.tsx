/* tslint:disable:no-implicit-dependencies no-submodule-imports */
import "jest-dom/extend-expect";
import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";
import Hint from "../index";

afterEach(cleanup);

describe("triggers", () => {
  it("shows tooltip only on mouse hovering", async () => {
    const { getByText, queryByText } = render(
      <Hint
        content="This is tooltip."
        usesTransition={true}
        events={["mouse-hover"]}
      >
        Content
      </Hint>
    );

    fireEvent.mouseEnter(getByText("Content"));

    expect(getByText("This is tooltip.")).toBeDefined();

    fireEvent.mouseLeave(getByText("Content"));
    await fireEvent.transitionEnd(getByText("This is tooltip."));

    expect(queryByText("This is tooltip.")).toBeNull();
  });

  it("toggles showing tooltip with click", async () => {
    const { getByText, queryByText } = render(
      <Hint content="This is tooltip." usesTransition={true} events={["click"]}>
        Content
      </Hint>
    );

    fireEvent.click(getByText("Content"));

    expect(getByText("This is tooltip.")).toBeDefined();

    fireEvent.click(getByText("Content"));
    await fireEvent.transitionEnd(getByText("This is tooltip."));

    expect(queryByText("This is tooltip.")).toBeNull();
  });

  it("toggles showing tooltip with double-click", async () => {
    const { getByText, queryByText } = render(
      <Hint
        content="This is tooltip."
        usesTransition={true}
        events={["double-click"]}
      >
        Content
      </Hint>
    );

    fireEvent.doubleClick(getByText("Content"));

    expect(getByText("This is tooltip.")).toBeDefined();

    fireEvent.doubleClick(getByText("Content"));
    await fireEvent.transitionEnd(getByText("This is tooltip."));

    expect(queryByText("This is tooltip.")).toBeNull();
  });

  it("shows tooltip only on focus", async () => {
    const { getByText, queryByText } = render(
      <Hint content="This is tooltip." usesTransition={true} events={["focus"]}>
        Content
      </Hint>
    );

    fireEvent.focus(getByText("Content"));

    expect(getByText("This is tooltip.")).toBeDefined();

    fireEvent.blur(getByText("Content"));
    await fireEvent.transitionEnd(getByText("This is tooltip."));

    expect(queryByText("This is tooltip.")).toBeNull();
  });
});
