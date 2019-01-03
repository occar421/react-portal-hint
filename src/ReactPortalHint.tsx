import * as React from "react";
// @ts-ignore
import ResizeObserver from "resize-observer-polyfill";
import { set as setBaseElement } from "./baseHelper";
import HintBody from "./HintBody";
import { Place } from "./models";

interface IProperty {
  place: Place;
  bodyClass: string;
  useTransition: boolean;
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
    "place" | "bodyClass" | "useTransition"
  > = {
    place: "top",
    bodyClass: "react-portal-hint__body",
    useTransition: true
  };
  public static setBaseElement(element: string | HTMLElement) {
    setBaseElement(element);
  }
  public readonly state: State = initialState;
  private ref = React.createRef<HTMLDivElement>();
  private ro = new ResizeObserver(() => {
    if (this.state.rendersBody) {
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
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.props.children}
        </div>
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

  private onMouseEnter = () => {
    this.setState({ rendersBody: true, showsBody: true });
  };

  private onMouseLeave = () => {
    this.setState({ showsBody: false });
  };

  private onDisappeared = () => {
    this.setState({ rendersBody: false });
  };
}

export default ReactPortalHint;
