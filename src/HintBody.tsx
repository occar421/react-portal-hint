import * as React from "react";
import * as ReactDOM from "react-dom";
import { get as getBaseElement } from "./baseHelper";
import { Place } from "./models";

interface IProperty {
  rect: Readonly<ClientRect>;
  place: Place;
  shows: boolean;
  bodyClass: string;
  shownClass: string;
  hiddenClass: string;
  useTransition: boolean;
  onDisappeared?(): void;
}

const initialState = {
  contentRect: null as ClientRect | null,
  onceRendered: false
};
type State = Readonly<typeof initialState>;

class HintBody extends React.Component<IProperty, State> {
  public readonly state: State = initialState;

  private el = document.createElement("div");
  private ref = React.createRef<HTMLDivElement>();
  private modalRoot = null;

  constructor(props) {
    super(props);

    this.el.setAttribute("style", "display: inline-block; float: left");
    this.modalRoot = getBaseElement();
  }

  public componentDidMount() {
    this.modalRoot.appendChild(this.el);

    const rect = this.ref.current!.getBoundingClientRect();
    this.setState({ contentRect: rect, onceRendered: true });
  }

  public componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
  }

  public render() {
    let styles: React.CSSProperties = {
      display: "inline-flex",
      position: "absolute"
    };
    if (this.state.contentRect) {
      if (this.props.place === "top") {
        const targetHorizontalCenter =
          (this.props.rect.left + this.props.rect.right) / 2;
        const targetTop = this.props.rect.top;

        const contentWidth = this.state.contentRect.width;
        const contentHeight = this.state.contentRect.height;

        // FIXME: strangely, it is not align center...
        styles = {
          ...styles,
          left: `${targetHorizontalCenter - contentWidth / 2}px`,
          top: `${targetTop - contentHeight}px`
        };
      } else if (this.props.place === "bottom") {
        const targetBottom = this.props.rect.bottom;
        const targetHorizontalCenter =
          (this.props.rect.left + this.props.rect.right) / 2;

        const contentWidth = this.state.contentRect.width;

        // FIXME: strangely, it is not align center...
        styles = {
          ...styles,
          left: `${targetHorizontalCenter - contentWidth / 2}px`,
          top: `${targetBottom}px`
        };
      } else if (this.props.place === "left") {
        const targetLeft = this.props.rect.left;
        const targetVerticalCenter =
          (this.props.rect.top + this.props.rect.bottom) / 2;

        const contentWidth = this.state.contentRect.width;
        const contentHeight = this.state.contentRect.height;

        styles = {
          ...styles,
          left: `${targetLeft - contentWidth}px`,
          top: `${targetVerticalCenter - contentHeight / 2}px`
        };
      } else if (this.props.place === "right") {
        const targetRight = this.props.rect.right;
        const targetVerticalCenter =
          (this.props.rect.top + this.props.rect.bottom) / 2;

        const contentHeight = this.state.contentRect.height;

        styles = {
          ...styles,
          left: `${targetRight}px`,
          top: `${targetVerticalCenter - contentHeight / 2}px`
        };
      }
    }

    const placeClass: string = this.props.place; // temporary

    return ReactDOM.createPortal(
      <div
        ref={this.ref}
        style={styles}
        onTransitionEnd={this.onTransitionEnd}
        className={[
          this.props.bodyClass,
          this.props.shows &&
          (!this.props.useTransition || this.state.onceRendered)
            ? this.props.shownClass
            : this.props.hiddenClass,
          placeClass
        ].join(" ")}
      >
        {this.props.children}
      </div>,
      this.el
    );
  }

  private onTransitionEnd = () => {
    if (
      this.props.useTransition &&
      !this.props.shows &&
      this.props.onDisappeared
    ) {
      this.props.onDisappeared();
    }
  };
}

export default HintBody;
