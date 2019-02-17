import React, { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import ResizeObserver from "resize-observer-polyfill";
import HintBody from "./HintBody";
import HintTarget from "./HintTarget";
import { ActualPlace, Event, Place } from "./models";

interface IProperty {
  place: Place | ActualPlace[];
  safetyMarginOfHint: number;
  centralizes: boolean; // TODO implement this feature: centralize hint position at the edge
  bodyClass: string;
  usesTransition: boolean; // TODO implement this feature: users CSS transition or not
  targetMoves: boolean;
  rendersSmoothly: boolean;
  events: Event[];
  keepsOriginalPlace: boolean; // TODO implement this feature: hint position transition
  content: JSX.Element | string | ((rect: ClientRect) => JSX.Element | string);
}

const ReactPortalHint: React.FunctionComponent<IProperty> = ({
  place = "top",
  safetyMarginOfHint = 4,
  centralizes = true,
  bodyClass = "react-portal-hint__body",
  usesTransition = true,
  targetMoves = false,
  rendersSmoothly = true,
  events = ["mouse-hover"],
  keepsOriginalPlace = false,
  content,
  children
}) => {
  const [rect, setRect] = useState<ClientRect | null>(null);
  const [isBodyRendering, setIsBodyRendering] = useState(false);
  const [isBodyShowing, setIsBodyShowing] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  const updateRect = useCallback(() => {
    if (targetRef.current) {
      setRect(targetRef.current.getBoundingClientRect());
    }
  }, []);

  // resize observer
  useEffect(() => {
    const ro: ResizeObserver = new ResizeObserver(entries => {
      if (!targetMoves && isBodyRendering && entries && entries[0]) {
        // too problematic code. ResizeObserver's rect didn't work well
        updateRect();
      }
    });

    ro.observe(targetRef.current!);

    return () => {
      ro.disconnect();
    };
  });

  // interval
  useEffect(() => {
    const intervalHandler = setInterval(() => {
      if (targetMoves && isBodyRendering) {
        updateRect();
      }
    }, 50);

    return () => {
      clearInterval(intervalHandler);
    };
  });

  const show = useCallback(() => {
    updateRect();
    setIsBodyRendering(true);
    setIsBodyShowing(true);
  }, []);
  const hide = useCallback(() => {
    setIsBodyShowing(false);
  }, []);

  const onClick = useCallback(() => {
    if (events.includes("click")) {
      if (isBodyShowing) {
        hide();
      } else {
        show();
      }
    }
  }, [isBodyShowing, events]);
  const onDoubleClick = useCallback(() => {
    if (events.includes("double-click")) {
      if (isBodyShowing) {
        hide();
      } else {
        show();
      }
    }
  }, [isBodyShowing, events]);
  const onFocus = useCallback(() => {
    if (events.includes("focus")) {
      show();
    }
  }, [events]);
  const onBlur = useCallback(() => {
    if (events.includes("focus")) {
      hide();
    }
  }, [events]);
  const onMouseEnter = useCallback(() => {
    if (events.includes("mouse-hover")) {
      show();
    }
  }, [events]);
  const onMouseLeave = useCallback(() => {
    if (events.includes("mouse-hover")) {
      hide();
    }
  }, [events]);

  const onDisappeared = useCallback(() => {
    setIsBodyRendering(false);
  }, []);

  return (
    <>
      <HintTarget
        ref={targetRef}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        children={children}
      />
      {isBodyRendering && rect && (
        <HintBody
          rect={rect}
          place={place}
          safetyMargin={safetyMarginOfHint}
          rendersSmoothly={rendersSmoothly}
          shows={isBodyShowing}
          bodyClass={bodyClass}
          shownClass={"shown"}
          hiddenClass={"hidden"}
          usesTransition={usesTransition === true}
          onDisappeared={onDisappeared}
        >
          {typeof content === "function" ? content(rect) : content}
        </HintBody>
      )}
    </>
  );
};

export default ReactPortalHint;
export { set as setBaseElement } from "./baseHelper";
