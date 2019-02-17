import React, { useCallback, useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
// @ts-ignore
import ResizeObserver from "resize-observer-polyfill";
import { get as getBaseElement } from "./baseHelper";
import { ActualPlace, Place } from "./models";

interface IProperty {
  rect: Readonly<ClientRect>;
  place: Place | ActualPlace[];
  safetyMargin: number;
  rendersSmoothly: boolean;
  shows: boolean;
  bodyClass: string;
  shownClass: string;
  hiddenClass: string;
  usesTransition: boolean;
  onDisappeared?(): void;
}

function placeToAttempts(place: Place): ActualPlace[] {
  switch (place) {
    case "top":
    case "bottom":
    case "left":
    case "right":
      return [place];
    case "column":
      return ["top", "bottom"];
    case "row":
      return ["left", "right"];
    case "start":
      return ["top", "left"];
    case "end":
      return ["bottom", "right"];
  }
}

function calculatePosition(
  placeAttempts: ActualPlace[],
  targetRect: ClientRect,
  contentRect: ClientRect,
  safetyMargin: number
): {
  top: number;
  left: number;
  place: ActualPlace;
} | null {
  let top: number | null = null;
  let left: number | null = null;
  let showingPlace: ActualPlace | null;

  for (const place of placeAttempts) {
    showingPlace = place;
    if (place === "top") {
      const targetHorizontalCenter = (targetRect.left + targetRect.right) / 2;
      const targetTop = targetRect.top;

      const contentWidth = contentRect.width;
      const contentHeight = contentRect.height;

      left = targetHorizontalCenter - contentWidth / 2;
      top = targetTop - contentHeight;

      // check if valid position
      if (
        safetyMargin <= top &&
        safetyMargin <= left &&
        left + contentWidth + safetyMargin < window.innerWidth
      ) {
        break;
      }
    } else if (place === "bottom") {
      const targetBottom = targetRect.bottom;
      const targetHorizontalCenter = (targetRect.left + targetRect.right) / 2;

      const contentWidth = contentRect.width;
      const contentHeight = contentRect.height;

      left = targetHorizontalCenter - contentWidth / 2;
      top = targetBottom;

      // check if valid position
      if (
        top + contentHeight + safetyMargin < window.innerHeight &&
        safetyMargin <= left &&
        left + contentWidth + safetyMargin < window.innerWidth
      ) {
        break;
      }
    } else if (place === "left") {
      const targetLeft = targetRect.left;
      const targetVerticalCenter = (targetRect.top + targetRect.bottom) / 2;

      const contentWidth = contentRect.width;
      const contentHeight = contentRect.height;

      left = targetLeft - contentWidth;
      top = targetVerticalCenter - contentHeight / 2;

      // check if valid position
      if (
        safetyMargin <= left &&
        safetyMargin <= top &&
        top + contentHeight + safetyMargin < window.innerHeight
      ) {
        break;
      }
    } else if (place === "right") {
      const targetRight = targetRect.right;
      const targetVerticalCenter = (targetRect.top + targetRect.bottom) / 2;

      const contentWidth = contentRect.width;
      const contentHeight = contentRect.height;

      left = targetRight;
      top = targetVerticalCenter - contentHeight / 2;

      // check if valid position
      if (
        left + contentWidth + safetyMargin < window.innerWidth &&
        safetyMargin <= top &&
        top + contentHeight + safetyMargin < window.innerHeight
      ) {
        break;
      }
    } else {
      throw new Error("Invalid argument `place`.");
    }
  }

  return top !== null && left !== null && showingPlace !== null
    ? { top, left, place: showingPlace }
    : null;
}

const HintBody: React.FunctionComponent<IProperty> = ({
  rect,
  place,
  safetyMargin,
  rendersSmoothly,
  shows,
  bodyClass,
  shownClass,
  hiddenClass,
  usesTransition,
  onDisappeared,
  children
}) => {
  const [contentRect, setContentRect] = useState<ClientRect | null>(null);
  const [hasRendered, setHasRendered] = useState(false);
  const [hasTransformed, setHasTransformed] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // resize observer
  useEffect(() => {
    const ro: ResizeObserver = new ResizeObserver(entries => {
      if (entries && entries[0]) {
        // too problematic code. ResizeObserver's rect didn't work well
        setContentRect(bodyRef.current!.getBoundingClientRect());
        setHasRendered(true);
      }
    });

    ro.observe(bodyRef.current!);

    return () => {
      ro.disconnect();
    };
  }, []);

  const [element] = useState(() => {
    const el = document.createElement("div");
    el.setAttribute("style", "display: inline-block; float: left");
    return el;
  });
  const [modalRoot] = useState(getBaseElement());

  // real mount and unmount
  useEffect(() => {
    modalRoot.appendChild(element);

    return () => {
      modalRoot.removeChild(element);
    };
  }, []);

  // delayed state initialize
  useEffect(() => {
    if (rendersSmoothly) {
      setTimeout(() => {
        setHasTransformed(true);
      }, 50);
    }
  });

  const onTransitionEnd = useCallback(() => {
    if (usesTransition && !shows && onDisappeared) {
      onDisappeared();
    }
  }, [usesTransition, shows, onDisappeared]);

  let position: { top: number; left: number } = null;
  let showingPlace = "";
  if (contentRect) {
    const attempts: ActualPlace[] =
      place instanceof Array ? place : placeToAttempts(place);

    const { place: pla, ...pos } = calculatePosition(
      attempts,
      rect,
      contentRect,
      safetyMargin
    );
    position = pos;
    showingPlace = pla;
  }

  return ReactDOM.createPortal(
    <div
      ref={bodyRef}
      style={{
        display: "inline-flex",
        position: "absolute",
        left: `0`,
        top: `0`,
        transform: position
          ? `translate(${position.left}px,${position.top}px)`
          : undefined,
        transition:
          rendersSmoothly && hasTransformed
            ? "transform 0.05s ease-in-out"
            : undefined
      }}
    >
      <div
        onTransitionEnd={onTransitionEnd}
        className={[
          bodyClass,
          shows && (!usesTransition || hasRendered) ? shownClass : hiddenClass,
          showingPlace
        ].join(" ")}
      >
        {children}
      </div>
    </div>,
    element
  );
};

export default HintBody;
