import * as React from "react";
import * as ReactDOM from "react-dom";
// @ts-ignore
import ResizeObserver, { ResizeObserverEntry } from "resize-observer-polyfill";
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

const initialState = {
  contentRect: null as ClientRect | null,
  onceRendered: false,
  transformed: false
};
type State = Readonly<typeof initialState>;

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

class HintBody extends React.Component<IProperty, State> {
  public readonly state: State = initialState;

  private el = document.createElement("div");

  private ref = React.createRef<HTMLDivElement>();

  private modalRoot: HTMLElement = null;

  private ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    if (entries && entries[0]) {
      // too problematic code. ResizeObserver's rect didn't work well
      this.setState({
        contentRect: this.ref.current!.getBoundingClientRect(),
        onceRendered: true
      });
    }
  });

  constructor(props: any) {
    super(props);

    this.el.setAttribute("style", "display: inline-block; float: left");
    this.modalRoot = getBaseElement();
  }

  public componentDidMount() {
    this.modalRoot.appendChild(this.el);

    this.ro.observe(this.ref.current!);

    if (this.props.rendersSmoothly) {
      setTimeout(() => {
        this.setState({ transformed: true });
      }, 50);
    }
  }

  public componentWillUnmount() {
    this.modalRoot.removeChild(this.el);

    this.ro.disconnect();
  }

  public render(): React.ReactPortal {
    let position: { top: number; left: number } = null;
    let showingPlace = "";
    if (this.state.contentRect) {
      const attempts: ActualPlace[] =
        this.props.place instanceof Array
          ? this.props.place
          : placeToAttempts(this.props.place);

      const { place, ...pos } = calculatePosition(
        attempts,
        this.props.rect,
        this.state.contentRect,
        this.props.safetyMargin
      );
      position = pos;
      showingPlace = place;
    }

    return ReactDOM.createPortal(
      <div
        ref={this.ref}
        style={{
          display: "inline-flex",
          position: "absolute",
          left: `0`,
          top: `0`,
          transform: position
            ? `translate(${position.left}px,${position.top}px)`
            : undefined,
          transition:
            this.props.rendersSmoothly && this.state.transformed
              ? "transform 0.05s ease-in-out"
              : undefined
        }}
      >
        <div
          onTransitionEnd={this.onTransitionEnd}
          className={[
            this.props.bodyClass,
            this.props.shows &&
            (!this.props.usesTransition || this.state.onceRendered)
              ? this.props.shownClass
              : this.props.hiddenClass,
            showingPlace
          ].join(" ")}
        >
          {this.props.children}
        </div>
      </div>,
      this.el
    );
  }

  private onTransitionEnd = () => {
    if (
      this.props.usesTransition &&
      !this.props.shows &&
      this.props.onDisappeared
    ) {
      this.props.onDisappeared();
    }
  };
}

export default HintBody;
