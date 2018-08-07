"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_types_1 = require("./actions.types");
class WsActions {
    constructor(connectionName) {
        this.connectionName = connectionName;
    }
    open(url, protocols) {
        return {
            type: actions_types_1.ActionsTypes.WS_OPENING,
            payload: {
                url,
                protocols,
                connectionName: this.connectionName,
            },
        };
    }
    close() {
        return {
            type: actions_types_1.ActionsTypes.WS_CLOSING,
            payload: {
                connectionName: this.connectionName,
            },
        };
    }
    send(data) {
        return {
            type: actions_types_1.ActionsTypes.WS_SEND,
            payload: {
                data,
                connectionName: this.connectionName,
            },
        };
    }
    attachProtocolHandler(handler, key) {
        return {
            type: actions_types_1.ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER,
            payload: {
                handler,
                key,
                connectionName: this.connectionName,
            },
        };
    }
    detachProtocolHandler(key) {
        return {
            type: actions_types_1.ActionsTypes.WS_DETACH_PROTOCOL_HANDLER,
            payload: {
                key,
                connectionName: this.connectionName,
            },
        };
    }
}
exports.createActions = (connectionName) => new WsActions(connectionName);
//# sourceMappingURL=websocket.actions.js.map