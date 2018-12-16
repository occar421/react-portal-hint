import * as React from "react";
import HintBody from "./HintBody";
import { Place } from "./models";

interface IProperty {
  place: Place;
  content: JSX.Element | string | ((rect: ClientRect) => JSX.Element | string);
}

const initialState = {
  rect: null as Readonly<ClientRect> | null,
  rendersBody: false,
  showsBody: false
};
type State = Readonly<typeof initialState>;

class ReactPortalHint extends React.Component<IProperty, State> {
  public static defaultProps: Pick<IProperty, "place"> = { place: "top" };
  public readonly state: State = initialState;
  private ref = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const rect = this.ref.current!.getBoundingClientRect();
    this.setState({ rect });
  }

  public render() {
    return (
      <>
        <div
          style={{ display: "inline-block" }}
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
