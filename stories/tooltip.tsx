/* tslint:disable:jsx-no-lambda */
import { storiesOf } from "@storybook/react";
import * as React from "react";
import Hint from "../src";

storiesOf("Default", module)
  .add("for button", () => (
    <div style={{ padding: "100px" }}>
      <Hint content="This is tooltip.">
        <button>Target</button>
      </Hint>
      <Hint content="This is tooltip.">
        <button>Target</button>
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
