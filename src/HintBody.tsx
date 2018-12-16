import * as React from "react";
import * as ReactDOM from "react-dom";
import { Place } from "./models";

export const modalRoot = document.querySelector("body");

interface IProperty {
  rect: Readonly<ClientRect>;
  place: Place;
  shows: boolean;
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
    let styles: React.CSSProperties = {};
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
        style={{
          display: "inline-block",
          position: "fixed",
          transition: "opacity 0.5s ease-out",
          opacity: this.props.shows && this.state.onceRendered ? 1 : 0,
          ...styles
        }}
        ref={this.ref}
        onTransitionEnd={this.onTransitionEnd}
      >
        {this.props.children}
      </div>,
      this.el
    );
  }

  private onTransitionEnd = () => {
    if (!this.props.shows && this.props.onDisappeared) {
      this.props.onDisappeared();
    }
  };
}

export default HintBody;
