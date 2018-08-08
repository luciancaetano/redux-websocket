import * as React from "react";
import { connect } from "react-redux";
import { IWebsocketState, WsActions } from "../src";
import * as Components from "./components";

interface IProps {
    actions: WsActions;
    state: {
        ws: IWebsocketState,
        log: string,
    };
    dispatch: (action: any) => void;
}

class BasicApp extends React.Component<IProps, any> {
    /**
     * Here We attach a simple protocol handler
     */
    public componentDidMount() {
        this.dispatch(this.actions.attachProtocolHandler((message, getState, dispatch) => {
            dispatch({ type: "LOG_ADD", text: `Server say's "${message.data}"` });
        }, "SimpleHandler"));
    }

    get actions(): WsActions {
        return this.props.actions;
    }

    public log(line: string) {
        this.dispatch({ type: "LOG_ADD", text: line });
    }

    public dispatch(act: any) {
        this.props.dispatch(act);
    }

    public onConnectClick(e: React.MouseEvent<HTMLButtonElement>) {
        this.dispatch(this.actions.open("wss://echo.websocket.org"));
        this.log("Connectiing to wss://echo.websocket.org");
    }
    public onDisConnectClick(e: React.MouseEvent<HTMLButtonElement>) {
        this.dispatch(this.actions.close());
        this.log("Closing connection");
    }
    public onSendPingClick(e: React.MouseEvent<HTMLButtonElement>) {
        this.dispatch(this.actions.send("PING"));
        this.log("Sending ping...");
    }

    public render() {
        const { state } = this.props;
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div>
                    <Components.StatusBar>
                        <Components.ConnectionStatus online={state.ws.status === "OPEN"}>
                            {state.ws.status}
                        </Components.ConnectionStatus>
                        {state.ws.status === "OPEN" ?

                            <Components.DisConnectButton onClick={(e) => this.onDisConnectClick(e)}>
                                Disconnect
                            </Components.DisConnectButton>
                            :

                            <Components.ConnectButton onClick={(e) => this.onConnectClick(e)}>
                                Connect
                            </Components.ConnectButton>
                        }

                        <Components.ConnectButton onClick={(e) => this.onSendPingClick(e)}>
                            Send Ping
                        </Components.ConnectButton>
                        <Components.DisConnectButton onClick={(e) => this.dispatch({ type: "LOG_CLEAR" })}>
                            Clear Log
                        </Components.DisConnectButton>

                    </Components.StatusBar>
                    <Components.TextArea value={state.log} spellCheck={false} readOnly />
                    <br />
                    <Components.Handlers>
                        <Components.HTitle>Handlers</Components.HTitle>
                        {Object.keys(state.ws.handlers).map((key, index) =>
                            <Components.HItem key={index}>
                            {key}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{state.ws.handlers[key].toString()}
                            </Components.HItem>)}
                    </Components.Handlers>
                </div>
            </div>
        );
    }
}

export default connect((state) => ({ state }))(BasicApp as any) as any;
