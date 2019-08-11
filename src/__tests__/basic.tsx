/// <reference types="jest" />
/* tslint:disable:no-implicit-dependencies no-submodule-imports */
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { cleanup, render } from "@testing-library/react";
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
