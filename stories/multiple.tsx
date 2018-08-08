import * as React from "react";
import { connect } from "react-redux";
import { IWebsocketState, WsActions } from "../src";
import * as Components from "./components";

interface IProps {
    state: {
        ws: IWebsocketState,
        ws2: IWebsocketState,
        log: string,
        log2: string,
    };
    dispatch: (action: any) => void;
}

class ConnectWs2 extends React.Component<IProps, any> {
    /**
     * Here We attach a simple protocol handler
     */
    public componentDidMount() {
        this.dispatch(this.actions.attachProtocolHandler((message, getState, dispatch) => {
            dispatch({type: "LOG2_ADD", text: `Server say's "${message.data}"`});
        }, "SimpleHandler"));
    }

    get actions(): WsActions {
        return new WsActions("ws2");
    }

    public log(line: string) {
        this.dispatch({type: "LOG2_ADD", text: line});
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
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div>
                    <Components.StatusBar>
                        <Components.ConnectionStatus online={state.ws2.status === "OPEN"}>
                            {state.ws2.status}
                        </Components.ConnectionStatus>
                        {state.ws2.status === "OPEN" ?

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
                        <Components.DisConnectButton onClick={(e) => this.dispatch({type: "LOG2_CLEAR"})}>
                            Clear Log
                        </Components.DisConnectButton>

                    </Components.StatusBar>
                    <Components.TextArea value={state.log2} spellCheck={false} readOnly/>
                </div>
            </div>
        );
    }
}

class ConnectWs1 extends React.Component<IProps, any> {
    /**
     * Here We attach a simple protocol handler
     */
    public componentDidMount() {
        this.dispatch(this.actions.attachProtocolHandler((message, getState, dispatch) => {
            dispatch({type: "LOG_ADD", text: `Server say's "${message.data}"`});
        }, "SimpleHandler"));
    }

    get actions(): WsActions {
        return new WsActions("ws");
    }

    public log(line: string) {
        this.dispatch({type: "LOG_ADD", text: line});
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
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
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
                        <Components.DisConnectButton onClick={(e) => this.dispatch({type: "LOG_CLEAR"})}>
                            Clear Log
                        </Components.DisConnectButton>

                    </Components.StatusBar>
                    <Components.TextArea value={state.log} spellCheck={false} readOnly/>
                </div>
            </div>
        );
    }
}

const Ws2 = connect((state) => ({ state }))(ConnectWs2 as any) as any;
const Ws1 = connect((state) => ({ state }))(ConnectWs1 as any) as any;

export default () => {
    return (
        <div>
        <Ws1/>
        <hr/>
        <Ws2/>
        </div >
    );
};
