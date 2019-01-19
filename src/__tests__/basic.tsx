/* tslint:disable:no-implicit-dependencies no-submodule-imports */
import "jest-dom/extend-expect";
import * as React from "react";
import { cleanup, render } from "react-testing-library";
import Hint from "../index";

afterEach(cleanup);

describe("render", () => {
  it("displays inner content", () => {
    const { getByText } = render(
      <Hint content="This is tooltip.">Content</Hint>
    );

    expect(getByText("Content")).toBeDefined();
  });
});
