import * as React from "react";
import { connect } from "react-redux";
import { IWebsocketState, WsActions } from "../src";

interface IProps {
    actions: WsActions;
    state: {
        ws: IWebsocketState,
    };
    dispatch: (action: any) => void;
}

class BasicApp extends React.Component<IProps, any> {

    public render() {
        console.log(this.props);
        return <div>Sample app</div>;
    }
}

export default connect((state) => ({state}))(BasicApp as any) as any;
