/* tslint:disable:jsx-no-lambda */
import { select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import Hint from "../src/index";

import "../src/default.css";
import { Place } from "../src/models";

const buttonStyle: React.CSSProperties = {
  width: "100%"
};

// Hint.setBaseElement("#root"); if you need

const knobOptions: { [s: string]: Place } = {
  Top: "top",
  Right: "right",
  Bottom: "bottom",
  Left: "left"
};

storiesOf("Default", module)
  .addDecorator(withKnobs)
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
  ))
  .add("following animation", () => {
    if (!document.getElementById("#following-animation")) {
      const style = document.createElement("style");
      // language=CSS
      style.appendChild(
        document.createTextNode(`
@keyframes contraction-target {
    0% {
        width: 50px;
        height: 50px;
    }
    25% {
        width: 50px;
        height: 100px;
    }
    50% {
        width: 100px;
        height: 100px;
    }
    75% {
        width: 100px;
        height: 50px;
    }
    100% {
        width: 50px;
        height: 50px;
    }
}
@keyframes contraction-content {
    0% {
        width: 100px;
        height: 20px;
    }
    25% {
        width: 100px;
        height: 30px;
    }
    50% {
        width: 110px;
        height: 30px;
    }
    75% {
        width: 110px;
        height: 20px;
    }
    100% {
        width: 100px;
        height: 20px;
    }
}
.react-portal-hint__body {
    display: flex;
    justify-content: center;
    align-items: center;
    animation: contraction-content 1s linear 0s infinite;
}
      `)
      );
      style.setAttribute("id", "following-animation");
      document.getElementsByTagName("head")[0].appendChild(style);
    }

    return (
      <div style={{ padding: "100px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px"
          }}
        >
          <Hint
            content="This is tooltip."
            place={select("place", knobOptions, "top")}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "turquoise",
                animation: "contraction-target 3s linear 0s infinite"
              }}
            >
              🤓
            </div>
          </Hint>
        </div>
      </div>
    );
  })
  .add("events", () => {
    const ref = React.createRef<Hint>();
    return (
      <>
        <div style={{ padding: "20px" }}>
          <Hint content="Tooltip">
            <button>Mouse Hover (default)</button>
          </Hint>
          <Hint content="Tooltip" events={["click"]}>
            <button>Click Toggle</button>
          </Hint>
          <Hint content="Tooltip" events={["mouse-hover", "click"]}>
            <button>Mouse Hover & Click Toggle</button>
          </Hint>
        </div>
        <div style={{ padding: "20px" }}>
          <Hint content="Tooltip" events={["double-click"]}>
            <button>Double-Click Toggle</button>
          </Hint>
          <Hint content="Tooltip" events={["focus"]}>
            <button>Focus</button>
          </Hint>
        </div>
        <div style={{ padding: "20px" }}>
          <Hint content="Tooltip" events={[]} ref={ref}>
            <button>Manual Timing</button>
          </Hint>
          &nbsp;
          <button
            onClick={() => {
              ref.current!.show();
            }}
          >
            Show
          </button>
          <button
            onClick={() => {
              ref.current!.hide();
            }}
          >
            Hide
          </button>
        </div>
      </>
    );
  });
