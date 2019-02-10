import * as React from "react";
import * as ReactIs from "react-is";
// @ts-ignore
import ResizeObserver from "resize-observer-polyfill";
import { set as setBaseElement } from "./baseHelper";
import HintBody from "./HintBody";
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

const initialState = {
  rect: null as Readonly<ClientRect> | null,
  rendersBody: false,
  showsBody: false,
  originalPlace: null as Place | null
};
type State = Readonly<typeof initialState>;

const defaultProps: Partial<IProperty> = {
  place: "top",
  centralizes: true,
  bodyClass: "react-portal-hint__body",
  usesTransition: true,
  targetMoves: false,
  rendersSmoothly: true,
  events: ["mouse-hover"],
  safetyMarginOfHint: 4,
  keepsOriginalPlace: false
};

class ReactPortalHint extends React.Component<IProperty, State> {
  public static defaultProps: Pick<
    IProperty,
    keyof typeof defaultProps
  > = defaultProps as any;

  public static setBaseElement(element: string | HTMLElement) {
    setBaseElement(element);
  }

  public readonly state: State = initialState;

  private targetRef = React.createRef<HTMLElement>();

  private ro = new ResizeObserver(entries => {
    if (
      !this.props.targetMoves &&
      this.state.rendersBody &&
      entries &&
      entries[0]
    ) {
      // too problematic code. ResizeObserver's rect didn't work well
      this.updateRect();
    }
  });
  private intervalHandler: number;

  public componentDidMount() {
    this.ro.observe(this.targetRef.current!);

    this.intervalHandler = setInterval(() => {
      if (this.props.targetMoves && this.state.rendersBody) {
        this.updateRect();
      }
    }, 50);
  }

  public componentWillUnmount() {
    this.ro.disconnect();

    clearInterval(this.intervalHandler);
  }

  public render() {
    return (
      <>
        {this.renderTarget()}
        {this.state.rendersBody && this.state.rect && (
          <HintBody
            rect={this.state.rect}
            place={this.props.place}
            safetyMargin={this.props.safetyMarginOfHint}
            rendersSmoothly={this.props.rendersSmoothly}
            shows={this.state.showsBody}
            bodyClass={this.props.bodyClass}
            shownClass={"shown"}
            hiddenClass={"hidden"}
            usesTransition={this.props.usesTransition === true}
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

  public readonly show = () => {
    this.setState({
      rendersBody: true,
      showsBody: true,
      rect: this.targetRef.current!.getBoundingClientRect() // if observer works in all situation, this is not necessary
    });
  };
  public readonly hide = () => {
    this.setState({ showsBody: false });
  };

  private renderTarget() {
    if (
      typeof this.props.children === "undefined" ||
      this.props.children === null
    ) {
      return;
    }

    const events: Partial<React.DOMAttributes<HTMLElement>> = {
      onClick: this.onClick,
      onDoubleClick: this.onDoubleClick,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    };

    switch (ReactIs.typeOf(this.props.children)) {
      case ReactIs.Fragment:
        throw new Error("Target with React Fragment is not supported");
      case ReactIs.Portal:
        throw new Error("Target with React Portal is not supported");
      case ReactIs.Suspense:
        throw new Error("Target with React Suspense is not supported");
    }

    if (Array.isArray(this.props.children)) {
      throw new Error("Target with React NodeArray is not supported");
    } else if (typeof this.props.children === "object") {
      if ("type" in this.props.children) {
        if (ReactIs.isLazy(this.props.children.type)) {
          throw new Error("Target with React lazy is not supported");
        }
        if (
          typeof this.props.children.type === "function" ||
          ReactIs.isForwardRef(this.props.children)
        ) {
          // React Function/Class Component
          throw Error(
            "Target with React Function/Class Component is not supported"
          );
        }

        if (!("children" in this.props.children)) {
          // React element(s)

          // register events and ref to the targets
          return React.cloneElement(this.props.children, {
            ...events,
            ref: this.targetRef
          });
        }
      }

      throw Error("Unknown");
    } else {
      // raw text
      return (
        <span
          {...events}
          style={{ display: "inline-flex" }}
          ref={this.targetRef}
        >
          {this.props.children}
        </span>
      );
    }
  }

  private updateRect = () => {
    if (this.targetRef.current) {
      this.setState({ rect: this.targetRef.current.getBoundingClientRect() });
    }
  };

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
