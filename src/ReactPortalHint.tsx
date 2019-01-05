import * as React from "react";
// @ts-ignore
import ResizeObserver from "resize-observer-polyfill";
import { set as setBaseElement } from "./baseHelper";
import HintBody from "./HintBody";
import { Event, Place } from "./models";

interface IProperty {
  place: Place;
  bodyClass: string;
  useTransition: boolean;
  events: Event[];
  content: JSX.Element | string | ((rect: ClientRect) => JSX.Element | string);
}

const initialState = {
  rect: null as Readonly<ClientRect> | null,
  rendersBody: false,
  showsBody: false
};
type State = Readonly<typeof initialState>;

class ReactPortalHint extends React.Component<IProperty, State> {
  public static defaultProps: Pick<
    IProperty,
    "place" | "bodyClass" | "useTransition" | "events"
  > = {
    place: "top",
    bodyClass: "react-portal-hint__body",
    useTransition: true,
    events: ["mouse-hover"]
  };
  public static setBaseElement(element: string | HTMLElement) {
    setBaseElement(element);
  }
  public readonly state: State = initialState;
  // private ref = React.createRef<HTMLDivElement>();
  private childRef = React.createRef<HTMLElement>();
  private wrapRef = React.createRef<HTMLSpanElement>();
  private ro = new ResizeObserver(() => {
    if (this.state.rendersBody) {
      // too problematic code. ResizeObserver's rect didn't work well
      // this.setState({ rect: this.ref.current!.getBoundingClientRect() });
      this.setState({
        rect: this.childRef.current
          ? this.childRef.current.getBoundingClientRect()
          : this.wrapRef.current!.getBoundingClientRect()
      });
    }
  });
  public readonly show = () => {
    this.setState({ rendersBody: true, showsBody: true });
  };
  public readonly hide = () => {
    this.setState({ showsBody: false });
  };

  // TODO consider react lifecycle more
  // situation: children changed to text to element
  // addEventListener for childRef && observe should be run after render?
  // removeEventListener for wrapRef && unobserve should be run after render?

  public componentDidMount() {
    const targetRef = this.childRef.current || this.wrapRef.current!;

    this.addAllEventTo(targetRef);

    this.setState({ rect: targetRef.getBoundingClientRect() });

    this.ro.observe(targetRef);
  }

  public componentWillUnmount() {
    const targetRef = this.childRef.current || this.wrapRef.current!;

    this.removeAllEventOf(targetRef);

    this.ro.disconnect();
  }

  public render() {
    return (
      <>
        {typeof this.props.children === "object" &&
        "type" in this.props.children &&
        !("children" in this.props.children) ? (
          React.cloneElement(this.props.children, { ref: this.childRef })
        ) : (
          <span style={{ display: "inline-flex" }} ref={this.wrapRef}>
            {this.props.children}
          </span>
        )}
        {this.state.rendersBody && this.state.rect && (
          <HintBody
            rect={this.state.rect}
            place={this.props.place}
            shows={this.state.showsBody}
            bodyClass={this.props.bodyClass}
            shownClass={"shown"}
            hiddenClass={"hidden"}
            useTransition={this.props.useTransition === true}
            onDisappeared={this.onDisappeared}
          >
            {typeof this.props.content === "function"
              ? this.props.content(this.state.rect)
              : this.props.content}
          </HintBody>
        )}
      </>
    );
  }

  private addAllEventTo(ref: HTMLElement) {
    ref.addEventListener("click", this.onClick);
    ref.addEventListener("dblclick", this.onDoubleClick);
    ref.addEventListener("focus", this.onFocus);
    ref.addEventListener("blur", this.onBlur);
    ref.addEventListener("mouseenter", this.onMouseEnter);
    ref.addEventListener("mouseleave", this.onMouseLeave);
  }

  private removeAllEventOf(ref: HTMLElement) {
    ref.removeEventListener("click", this.onClick);
    ref.removeEventListener("dblclick", this.onDoubleClick);
    ref.removeEventListener("focus", this.onFocus);
    ref.removeEventListener("blur", this.onBlur);
    ref.removeEventListener("mouseenter", this.onMouseEnter);
    ref.removeEventListener("mouseleave", this.onMouseLeave);
  }

  private onClick = () => {
    if (this.props.events.includes("click")) {
      if (this.state.showsBody) {
        this.hide();
      } else {
        this.show();
      }
    }
  };

  private onDoubleClick = () => {
    if (this.props.events.includes("double-click")) {
      if (this.state.showsBody) {
        this.hide();
      } else {
        this.show();
      }
    }
  };

  private onFocus = () => {
    if (this.props.events.includes("focus")) {
      this.show();
    }
  };

  private onBlur = () => {
    if (this.props.events.includes("focus")) {
      this.hide();
    }
  };

  private onMouseEnter = () => {
    if (this.props.events.includes("mouse-hover")) {
      this.show();
    }
  };

  private onMouseLeave = () => {
    if (this.props.events.includes("mouse-hover")) {
      this.hide();
    }
  };

  private onDisappeared = () => {
    this.setState({ rendersBody: false });
  };
}

export default ReactPortalHint;
