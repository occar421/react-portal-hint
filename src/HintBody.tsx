import * as React from "react";
import * as ReactDOM from "react-dom";
import { Place } from "./models";

export const modalRoot = document.querySelector("body");

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

  constructor(props) {
    super(props);

    this.el.setAttribute("style", "display: inline-block;");
  }

  public componentDidMount() {
    modalRoot.appendChild(this.el);

    const rect = this.ref.current!.getBoundingClientRect();
    this.setState({ contentRect: rect, onceRendered: true });
  }

  public componentWillUnmount() {
    modalRoot.removeChild(this.el);
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
      }
    }

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
            : this.props.hiddenClass
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
