"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_types_1 = require("./actions.types");
class WsActions {
    constructor(connectionName) {
        this.connectionName = connectionName;
    }
    open(url, protocols, config) {
        return {
            type: actions_types_1.ActionsTypes.WS_OPENING,
            payload: {
                url,
                protocols,
                config,
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
    reconnect() {
        return {
            type: actions_types_1.ActionsTypes.WS_RECONNECTING,
            payload: {
                connectionName: this.connectionName,
            },
        };
    }
    attachProtocolHandler(handler) {
        return {
            type: actions_types_1.ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER_REQUEST,
            payload: {
                handler,
                connectionName: this.connectionName,
            },
        };
    }
    detachProtocolHandler(handler) {
        return {
            type: actions_types_1.ActionsTypes.WS_DETACH_PROTOCOL_HANDLER,
            payload: {
                handler,
                connectionName: this.connectionName,
            },
        };
    }
}
exports.createActions = (connectionName) => new WsActions(connectionName);
//# sourceMappingURL=websocket.actions.js.map