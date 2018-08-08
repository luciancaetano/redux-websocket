"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const src_1 = require("../src");
const Components = require("./components");
class ConnectWs2 extends React.Component {
    componentDidMount() {
        this.dispatch(this.actions.attachProtocolHandler((message, getState, dispatch) => {
            dispatch({ type: "LOG2_ADD", text: `Server say's "${message.data}"` });
        }, "SimpleHandler"));
    }
    get actions() {
        return new src_1.WsActions("ws2");
    }
    log(line) {
        this.dispatch({ type: "LOG2_ADD", text: line });
    }
    dispatch(act) {
        this.props.dispatch(act);
    }
    onConnectClick(e) {
        this.dispatch(this.actions.open("wss://echo.websocket.org"));
        this.log("Connectiing to wss://echo.websocket.org");
    }
    onDisConnectClick(e) {
        this.dispatch(this.actions.close());
        this.log("Closing connection");
    }
    onSendPingClick(e) {
        this.dispatch(this.actions.send("PING"));
        this.log("Sending ping...");
    }
    render() {
        const { state } = this.props;
        return (React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center" } },
            React.createElement("div", null,
                React.createElement(Components.StatusBar, null,
                    React.createElement(Components.ConnectionStatus, { online: state.ws2.status === "OPEN" }, state.ws2.status),
                    state.ws2.status === "OPEN" ?
                        React.createElement(Components.DisConnectButton, { onClick: (e) => this.onDisConnectClick(e) }, "Disconnect")
                        :
                            React.createElement(Components.ConnectButton, { onClick: (e) => this.onConnectClick(e) }, "Connect"),
                    React.createElement(Components.ConnectButton, { onClick: (e) => this.onSendPingClick(e) }, "Send Ping"),
                    React.createElement(Components.DisConnectButton, { onClick: (e) => this.dispatch({ type: "LOG2_CLEAR" }) }, "Clear Log")),
                React.createElement(Components.TextArea, { value: state.log2, spellCheck: false, readOnly: true }))));
    }
}
class ConnectWs1 extends React.Component {
    componentDidMount() {
        this.dispatch(this.actions.attachProtocolHandler((message, getState, dispatch) => {
            dispatch({ type: "LOG_ADD", text: `Server say's "${message.data}"` });
        }, "SimpleHandler"));
    }
    get actions() {
        return new src_1.WsActions("ws");
    }
    log(line) {
        this.dispatch({ type: "LOG_ADD", text: line });
    }
    dispatch(act) {
        this.props.dispatch(act);
    }
    onConnectClick(e) {
        this.dispatch(this.actions.open("wss://echo.websocket.org"));
        this.log("Connectiing to wss://echo.websocket.org");
    }
    onDisConnectClick(e) {
        this.dispatch(this.actions.close());
        this.log("Closing connection");
    }
    onSendPingClick(e) {
        this.dispatch(this.actions.send("PING"));
        this.log("Sending ping...");
    }
    render() {
        const { state } = this.props;
        return (React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center" } },
            React.createElement("div", null,
                React.createElement(Components.StatusBar, null,
                    React.createElement(Components.ConnectionStatus, { online: state.ws.status === "OPEN" }, state.ws.status),
                    state.ws.status === "OPEN" ?
                        React.createElement(Components.DisConnectButton, { onClick: (e) => this.onDisConnectClick(e) }, "Disconnect")
                        :
                            React.createElement(Components.ConnectButton, { onClick: (e) => this.onConnectClick(e) }, "Connect"),
                    React.createElement(Components.ConnectButton, { onClick: (e) => this.onSendPingClick(e) }, "Send Ping"),
                    React.createElement(Components.DisConnectButton, { onClick: (e) => this.dispatch({ type: "LOG_CLEAR" }) }, "Clear Log")),
                React.createElement(Components.TextArea, { value: state.log, spellCheck: false, readOnly: true }))));
    }
}
const Ws2 = react_redux_1.connect((state) => ({ state }))(ConnectWs2);
const Ws1 = react_redux_1.connect((state) => ({ state }))(ConnectWs1);
exports.default = () => {
    return (React.createElement("div", null,
        React.createElement(Ws1, null),
        React.createElement("hr", null),
        React.createElement(Ws2, null)));
};
//# sourceMappingURL=multiple.js.map