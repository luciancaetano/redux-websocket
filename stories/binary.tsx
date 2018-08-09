import * as React from "react";
import { connect } from "react-redux";
import { IFilterInterface, IWebsocketState, WsActions } from "../src";
import binaryHandler from "./binaryHandler";
import * as Components from "./components";

interface IProps {
    actions: WsActions;
    state: {
        ws3: IWebsocketState,
        log: string,
    };
    dispatch: (action: any) => void;
}

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"));

const binaryFilter: IFilterInterface = {
    encode: (m: any) => {
        const data = String(m);
        const buf = new Uint8Array(data.length);
        buf.forEach((_, i) => {
            buf[i] = data.charCodeAt(i);
        });
        return buf;
    },
    decode: (m: MessageEvent) => {
        const buff = m.data as ArrayBuffer;
        const str = String.fromCharCode.apply(null, new Uint8Array(buff));
        const hex = toHexString(new Uint8Array(buff));
        return `${str}(${hex})`;
    },
};

class App extends React.Component<IProps, any> {
    /**
     * Here We attach a simple protocol handler
     */
    public componentDidMount() {
        this.dispatch(this.actions.attachProtocolHandler(binaryHandler, binaryHandler.name));
    }

    get actions(): WsActions {
        return new WsActions("ws3");
    }

    public log(line: string) {
        this.dispatch({ type: "LOG_ADD", text: line });
    }

    public dispatch(act: any) {
        this.props.dispatch(act);
    }

    public onConnectClick(e: React.MouseEvent<HTMLButtonElement>) {
        this.dispatch(this.actions.open("wss://echo.websocket.org", {
            filter: binaryFilter,
            binaryType: "arraybuffer",
        }));
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
                        <Components.ConnectionStatus online={state.ws3.status === "OPEN"}>
                            {state.ws3.status}
                        </Components.ConnectionStatus>
                        {state.ws3.status === "OPEN" ?

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
                        {Object.keys(state.ws3.handlers).map((key, index) =>
                            <Components.HItem key={index}>
                            {key}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{state.ws3.handlers[key].toString()}
                            </Components.HItem>)}
                    </Components.Handlers>
                </div>
            </div>
        );
    }
}

export default connect((state) => ({ state }))(App as any) as any;
