import * as React from "react";
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

  private ref = React.createRef<HTMLDivElement>();

  private ro = new ResizeObserver(entries => {
    if (this.state.rendersBody && entries && entries[0]) {
      // too problematic code. ResizeObserver's rect didn't work well
      this.setState({ rect: this.ref.current!.getBoundingClientRect() });
    }
  });

  public componentDidMount() {
    this.setState({ rect: this.ref.current!.getBoundingClientRect() });
    this.ro.observe(this.ref.current!);
  }

  public componentWillUnmount() {
    this.ro.disconnect();
  }

  public render() {
    return (
      <>
        <div
          style={{ display: "inline-flex" }}
          ref={this.ref}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.props.children}
        </div>
        {this.state.rendersBody && this.state.rect && (
          <HintBody
            rect={this.state.rect}
            place={this.props.place}
            safetyMargin={this.props.safetyMarginOfHint}
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
      rect: this.ref.current!.getBoundingClientRect() // if observer works in all situation, this is not necessary
    });
  };
  public readonly hide = () => {
    this.setState({ showsBody: false });
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
