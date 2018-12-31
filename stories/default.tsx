/* tslint:disable:jsx-no-lambda */
import { storiesOf } from "@storybook/react";
import * as React from "react";
import Hint from "../src/index";

import "../src/default.css";

const buttonStyle: React.CSSProperties = {
  width: "100%"
};

// Hint.setBaseElement("#root"); if you need

storiesOf("Default", module)
  .add("for button", () => (
    <div
      style={{
        display: "grid",
        gridGap: "5px",
        gridTemplateColumns: "repeat(3, 70px)",
        paddingTop: "50px",
        paddingLeft: "100px"
      }}
    >
      <div />
      <Hint content="This is tooltip." place="top">
        <button style={buttonStyle}>Top</button>
      </Hint>
      <div />
      <Hint content="This is tooltip." place="left">
        <button style={buttonStyle}>Left</button>
      </Hint>
      <div />
      <Hint content="This is tooltip." place="right">
        <button style={buttonStyle}>Right</button>
      </Hint>
      <div />
      <Hint content="This is tooltip." place="bottom">
        <button style={buttonStyle}>Bottom</button>
      </Hint>
      <div />
    </div>
  ))
  .add("for text", () => (
    <div style={{ padding: "100px" }}>
      <span>
        aaaa
        <Hint content="This is tooltip.">bbbb</Hint>
        cccc
        <Hint content="This is tooltip.">ffff</Hint>
        eeee
      </span>
    </div>
  ));
