import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";
import { set as setBaseElement } from "./baseHelper";
import HintBody from "./HintBody";
import HintTarget from "./HintTarget";
import { ActualPlace, Event, Place } from "./models";

interface Props {
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

const defaultProps: Partial<Props> = {
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

class ReactPortalHint extends React.Component<Props, State> {
  public static defaultProps = defaultProps as Pick<
    Props,
    keyof typeof defaultProps
  >;

  public static setBaseElement(element: string | HTMLElement): void {
    setBaseElement(element);
  }

  public readonly state: State = initialState;

  private targetRef = React.createRef<HTMLElement>();

  private ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
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
  private intervalHandler: number | null = null;

  public componentDidMount(): void {
    if (
      typeof this.props.children === "undefined" ||
      this.props.children === null
    ) {
      return;
    }

    if (!this.targetRef.current) {
      throw new Error("Reference to the component is invalid.");
    }

    this.ro.observe(this.targetRef.current);

    this.intervalHandler = window.setInterval(() => {
      if (this.props.targetMoves && this.state.rendersBody) {
        this.updateRect();
      }
    }, 50);
  }

  public componentWillUnmount(): void {
    this.ro.disconnect();

    if (this.intervalHandler !== null) {
      clearInterval(this.intervalHandler);
    }
  }

  public render(): React.ReactNode {
    return (
      <>
        <HintTarget
          ref={this.targetRef}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.props.children}
        </HintTarget>
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
            usesTransition={this.props.usesTransition}
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

  public readonly show = (): void => {
    if (!this.targetRef.current) {
      throw new Error("Reference to the component is invalid.");
    }

    this.setState({
      rendersBody: true,
      showsBody: true,
      rect: this.targetRef.current.getBoundingClientRect() // if observer works in all situation, this is not necessary
    });
  };
  public readonly hide = (): void => {
    this.setState({ showsBody: false });
  };

  private updateRect = (): void => {
    if (this.targetRef.current) {
      this.setState({ rect: this.targetRef.current.getBoundingClientRect() });
    }
  };

  private onClick = (): void => {
    if (this.props.events.includes("click")) {
      if (this.state.showsBody) {
        this.hide();
      } else {
        this.show();
      }
    }
  };

  private onDoubleClick = (): void => {
    if (this.props.events.includes("double-click")) {
      if (this.state.showsBody) {
        this.hide();
      } else {
        this.show();
      }
    }
  };

  private onFocus = (): void => {
    if (this.props.events.includes("focus")) {
      this.show();
    }
  };

  private onBlur = (): void => {
    if (this.props.events.includes("focus")) {
      this.hide();
    }
  };

  private onMouseEnter = (): void => {
    if (this.props.events.includes("mouse-hover")) {
      this.show();
    }
  };

  private onMouseLeave = (): void => {
    if (this.props.events.includes("mouse-hover")) {
      this.hide();
    }
  };

  private onDisappeared = (): void => {
    this.setState({ rendersBody: false });
  };
}

export default ReactPortalHint;
