/* tslint:disable:jsx-no-lambda max-classes-per-file */
import { boolean, select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
// @ts-ignore
import Draggable from "react-draggable";
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
  Left: "left",
  Column: "column",
  Row: "row",
  Start: "start",
  End: "end"
};

const stories = storiesOf("Default", module).addDecorator(withKnobs);

stories.add("for button", () => (
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
));

stories.add("for text", () => (
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

stories.add("following animation", () => (
  <div style={{ padding: "100px" }}>
    <style>{`
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
}`}</style>
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
));

stories.add("events", () => {
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

const refForPlace = React.createRef<Hint>();

stories.add(
  "place",
  () => (
    <Draggable handle={".handle"} defaultPosition={{ x: 150, y: 150 }}>
      <div
        style={{
          display: "inline-block"
        }}
      >
        <style>{`
html { background-color: lightgray; height: 100%; width: 100%; }
body { height: 100%; width: 100%; margin: 0; }
.react-portal-hint__body {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    height: 60px;
    width: 200px;
}
`}</style>

        <Hint
          ref={refForPlace}
          content="Tooltip"
          events={[]}
          place={select(
            "place",
            {
              ...knobOptions,
              "Left > Top > Right (custom fallback)": ["left", "top", "right"]
            },
            "top"
          )}
          targetMoves={boolean("Consider it moves", true)}
          rendersSmoothly={boolean("Smooth move", true)}
        >
          <div data-testid="target">
            <div
              style={{
                display: "flex",
                backgroundColor: "cadetblue",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                padding: "10px",
                justifyContent: "center"
              }}
              className="handle"
            >
              Move
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "lightcoral",
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
                padding: "10px",
                justifyContent: "center"
              }}
              onClick={() => {
                const inst = refForPlace.current!;
                inst.state.showsBody ? inst.hide() : inst.show();
              }}
            >
              Toggle
            </div>
          </div>
        </Hint>
      </div>
    </Draggable>
  ),
  { info: { propTablesExclude: [Draggable] } }
);

stories.add("with Flexbox", () => (
  <div>
    <h1 style={{ marginLeft: "30px", marginBottom: "0" }}>react-portal-hint</h1>
    <p style={{ marginLeft: "30px", marginRight: "30px", marginBottom: "0" }}>
      react-portal-hint doesn't wrap the HTML element. Thanks to the trick, the
      target element will follow the parent's flexbox option.
    </p>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingTop: "20px",
        paddingLeft: "20px",
        width: "800px"
      }}
    >
      {Array.from(Array(50)).map((_, i) => (
        <Hint content="This is tooltip." key={i}>
          <button style={{ width: "80px", margin: "10px" }}>
            {i % 5 === 0 ? (
              <>
                {i}
                <br />!
              </>
            ) : (
              i
            )}
          </button>
        </Hint>
      ))}
    </div>
    <h1 style={{ marginLeft: "30px", marginBottom: "0" }}>
      c.f. naive impl. (sizing simulation)
    </h1>
    <p style={{ marginLeft: "30px", marginRight: "30px", marginBottom: "0" }}>
      (The <em>wrapper</em> follows the parent flexbox option but the target{" "}
      <strong>doesn't</strong> follow.)
    </p>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingTop: "20px",
        paddingLeft: "20px",
        width: "800px"
      }}
    >
      {Array.from(Array(50)).map((_, i) => (
        <div {/* <Hint content="This is tooltip."> */ ...{}} key={i}>
          <button style={{ width: "80px", margin: "10px" }}>
            {i % 5 === 0 ? (
              <>
                {i}
                <br />!
              </>
            ) : (
              i
            )}
          </button>
        </div>
      ))}
    </div>
  </div>
));
