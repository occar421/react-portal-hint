/* tslint:disable:no-implicit-dependencies no-submodule-imports */
import "jest-dom/extend-expect";
import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";
import Hint from "../index";

afterEach(cleanup);

const SubFunctionComponent = ({ children }) => (
  <div className="foo">{children}</div>
);

class SubClassComponent extends React.Component {
  public render() {
    return <div className="foo">{this.props.children}</div>;
  }
}

const SubForwardRefComponent: any = React.forwardRef(
  ({ children }, ref: any) => (
    <div id="a" ref={ref}>
      {children}
    </div>
  )
);

describe("children", () => {
  it("accepts plain text", () => {
    const { getByText } = render(
      <Hint content="This is tooltip." events={["click"]}>
        Content
      </Hint>
    );

    expect(getByText("Content")).toBeDefined();

    fireEvent.click(getByText("Content"));

    expect(getByText("This is tooltip.")).toBeDefined();
  });

  it("accepts single div element", () => {
    const { getByText } = render(
      <Hint content="This is tooltip." events={["click"]}>
        <div>Content</div>
      </Hint>
    );

    expect(getByText("Content")).toBeDefined();

    fireEvent.click(getByText("Content"));

    expect(getByText("This is tooltip.")).toBeDefined();
  });

  it("denies single React Function Component", () => {
    expect(() =>
      render(
        <Hint content="This is tooltip." events={["click"]}>
          <SubFunctionComponent>Content</SubFunctionComponent>
        </Hint>
      )
    ).toThrow(/not supported/);
  });

  it("denies on single React Class Component", () => {
    expect(() =>
      render(
        <Hint content="This is tooltip." events={["click"]}>
          <SubClassComponent>Content</SubClassComponent>
        </Hint>
      )
    ).toThrow(/not supported/);
  });

  it("denies multiple div element", () => {
    expect(() =>
      render(
        <Hint content="This is tooltip." events={["click"]}>
          <div>Content1</div>
          <div>Content2</div>
        </Hint>
      )
    ).toThrow(/not supported/);
  });

  it("denies fragment", () => {
    expect(() =>
      render(
        <Hint content="This is tooltip." events={["click"]}>
          <>
            <div>Content1</div>
            <div>Content2</div>
          </>
        </Hint>
      )
    ).toThrow(/not supported/);
  });

  it("does nothing with empty children", () => {
    const { queryByText } = render(
      <Hint content="This is tooltip." events={["click"]} />
    );

    expect(queryByText("This is tooltip.")).toBeNull();
  });

  it("does nothing with null child", () => {
    const { queryByText } = render(
      <Hint content="This is tooltip." events={["click"]}>
        {null}
      </Hint>
    );

    expect(queryByText("This is tooltip.")).toBeNull();
  });

  it("denies forwardRef Component", () => {
    expect(() =>
      render(
        <Hint content="This is tooltip." events={["click"]}>
          <SubForwardRefComponent>Content</SubForwardRefComponent>
        </Hint>
      )
    ).toThrow(/not supported/);
  });
});
