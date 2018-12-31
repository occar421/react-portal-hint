/* tslint:disable:jsx-no-lambda */
import { storiesOf } from "@storybook/react";
import * as React from "react";
import Hint from "../src/index";

import "../src/default.css";

const buttonStyle: React.CSSProperties = {
  width: "100%"
};

storiesOf("Default", module)
  .add("for button", () => (
    <div
      style={{
        display: "grid",
        gridGap: "5px",
        gridTemplateColumns: "repeat(4, 70px)",
        padding: "50px"
      }}
    >
      <Hint content="This is tooltip." place="top">
        <button style={buttonStyle}>Top</button>
      </Hint>
      <Hint content="This is tooltip." place="bottom">
        <button style={buttonStyle}>Bottom</button>
      </Hint>
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
