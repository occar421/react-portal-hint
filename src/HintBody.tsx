import * as React from "react";
import * as ReactDOM from "react-dom";
// @ts-ignore
import ResizeObserver from "resize-observer-polyfill";
import { get as getBaseElement } from "./baseHelper";
import { ActualPlace, Place } from "./models";

interface IProperty {
  rect: Readonly<ClientRect>;
  place: Place | ActualPlace[];
  safetyMargin: number;
  shows: boolean;
  bodyClass: string;
  shownClass: string;
  hiddenClass: string;
  usesTransition: boolean;
  onDisappeared?(): void;
}

const initialState = {
  contentRect: null as ClientRect | null,
  onceRendered: false
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

class HintBody extends React.Component<IProperty, State> {
  public readonly state: State = initialState;

  private el = document.createElement("div");
  private ref = React.createRef<HTMLDivElement>();
  private modalRoot = null;
  private ro = new ResizeObserver(entries => {
    if (entries && entries[0]) {
      // too problematic code. ResizeObserver's rect didn't work well
      this.setState({
        contentRect: this.ref.current!.getBoundingClientRect(),
        onceRendered: true
      });
    }
  });

  constructor(props) {
    super(props);

    this.el.setAttribute("style", "display: inline-block; float: left");
    this.modalRoot = getBaseElement();
  }

  public componentDidMount() {
    this.modalRoot.appendChild(this.el);

    this.ro.observe(this.ref.current!);
  }

  public componentWillUnmount() {
    this.modalRoot.removeChild(this.el);

    this.ro.disconnect();
  }

  public render() {
    const position = { top: 0, left: 0 };
    let showingPlace = "";
    if (this.state.contentRect) {
      const attempts: ActualPlace[] =
        this.props.place instanceof Array
          ? this.props.place
          : placeToAttempts(this.props.place);

      for (const place of attempts) {
        showingPlace = place;
        if (place === "top") {
          const targetHorizontalCenter =
            (this.props.rect.left + this.props.rect.right) / 2;
          const targetTop = this.props.rect.top;

          const contentWidth = this.state.contentRect.width;
          const contentHeight = this.state.contentRect.height;

          position.left = targetHorizontalCenter - contentWidth / 2;
          position.top = targetTop - contentHeight;

          // check if valid position
          if (
            this.props.safetyMargin <= position.top &&
            this.props.safetyMargin <= position.left &&
            position.left + contentWidth + this.props.safetyMargin <
              window.innerWidth
          ) {
            break;
          }
        } else if (place === "bottom") {
          const targetBottom = this.props.rect.bottom;
          const targetHorizontalCenter =
            (this.props.rect.left + this.props.rect.right) / 2;

          const contentWidth = this.state.contentRect.width;
          const contentHeight = this.state.contentRect.height;

          position.left = targetHorizontalCenter - contentWidth / 2;
          position.top = targetBottom;

          // check if valid position
          if (
            position.top + contentHeight + this.props.safetyMargin <
              window.innerHeight &&
            this.props.safetyMargin <= position.left &&
            position.left + contentWidth + this.props.safetyMargin <
              window.innerWidth
          ) {
            break;
          }
        } else if (place === "left") {
          const targetLeft = this.props.rect.left;
          const targetVerticalCenter =
            (this.props.rect.top + this.props.rect.bottom) / 2;

          const contentWidth = this.state.contentRect.width;
          const contentHeight = this.state.contentRect.height;

          position.left = targetLeft - contentWidth;
          position.top = targetVerticalCenter - contentHeight / 2;

          // check if valid position
          if (
            this.props.safetyMargin <= position.left &&
            this.props.safetyMargin <= position.top &&
            position.top + contentHeight + this.props.safetyMargin <
              window.innerHeight
          ) {
            break;
          }
        } else if (place === "right") {
          const targetRight = this.props.rect.right;
          const targetVerticalCenter =
            (this.props.rect.top + this.props.rect.bottom) / 2;

          const contentWidth = this.state.contentRect.width;
          const contentHeight = this.state.contentRect.height;

          position.left = targetRight;
          position.top = targetVerticalCenter - contentHeight / 2;

          // check if valid position
          if (
            position.left + contentWidth + this.props.safetyMargin <
              window.innerWidth &&
            this.props.safetyMargin <= position.top &&
            position.top + contentHeight + this.props.safetyMargin <
              window.innerHeight
          ) {
            break;
          }
        } else {
          throw new Error("Invalid argument `place`.");
        }
      }
    }

    const styles: React.CSSProperties = {
      display: "inline-flex",
      position: "absolute",
      left: `${position.left || 0}px`,
      top: `${position.top || 0}px`
    };

    return ReactDOM.createPortal(
      <div
        ref={this.ref}
        style={styles}
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
