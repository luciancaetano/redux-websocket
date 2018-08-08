"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const Components = require("./components");
class BasicApp extends React.Component {
    componentDidMount() {
        this.dispatch(this.actions.attachProtocolHandler((message, getState, dispatch) => {
            dispatch({ type: "LOG_ADD", text: `Server say's "${message.data}"` });
        }, "SimpleHandler"));
    }
    get actions() {
        return this.props.actions;
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
                React.createElement(Components.TextArea, { value: state.log, spellCheck: false, readOnly: true }),
                React.createElement("br", null),
                React.createElement(Components.Handlers, null,
                    React.createElement(Components.HTitle, null, "Handlers"),
                    Object.keys(state.ws.handlers).map((key, index) => React.createElement(Components.HItem, { key: index },
                        key,
                        React.createElement("br", null),
                        "\u00A0\u00A0\u00A0\u00A0",
                        state.ws.handlers[key].toString()))))));
    }
}
exports.default = react_redux_1.connect((state) => ({ state }))(BasicApp);
//# sourceMappingURL=basic.js.map