import * as React from "react";
import * as ReactIs from "react-is";

const HintTarget = React.forwardRef<
  HTMLElement,
  { children: React.ReactNode } & Pick<
    React.DOMAttributes<HTMLElement>,
    | "onClick"
    | "onDoubleClick"
    | "onFocus"
    | "onBlur"
    | "onMouseEnter"
    | "onMouseLeave"
  >
>(({ children, ...events }, ref) => {
  if (typeof children === "undefined" || children === null) {
    return;
  }

  switch (ReactIs.typeOf(children)) {
    case ReactIs.Fragment:
      throw new Error("Target with React Fragment is not supported");
    case ReactIs.Portal:
      throw new Error("Target with React Portal is not supported");
    case ReactIs.Suspense:
      throw new Error("Target with React Suspense is not supported");
  }

  if (Array.isArray(children)) {
    throw new Error("Target with React NodeArray is not supported");
  } else if (typeof children === "object") {
    if ("type" in children) {
      if (ReactIs.isLazy(children.type)) {
        throw new Error("Target with React lazy is not supported");
      }
      if (
        typeof children.type === "function" ||
        ReactIs.isForwardRef(children)
      ) {
        // React Function/Class Component
        throw Error(
          "Target with React Function/Class Component is not supported"
        );
      }

      if (!("children" in children)) {
        // React element(s)

        // register events and ref to the targets
        return React.cloneElement(children, {
          ...events,
          ref
        });
      }
    }

    throw Error("Unknown");
  }

  // raw text
  return (
    <span {...events} style={{ display: "inline-flex" }} ref={ref}>
      {children}
    </span>
  );
});

export default HintTarget;
