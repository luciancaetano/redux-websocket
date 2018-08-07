"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sockette_1 = require("sockette");
const actions_types_1 = require("./actions.types");
const ProtocolHandler_1 = require("./ProtocolHandler");
const webSocket = {};
exports.middleware = (store) => (next) => (action) => {
    switch (action.type) {
        case actions_types_1.ActionsTypes.WS_OPENING:
            if (action.payload) {
                if (webSocket[action.payload.connectionName]) {
                    webSocket[action.payload.connectionName].close();
                }
                webSocket[action.payload.connectionName] = new sockette_1.default(action.payload.url, {
                    protocols: action.payload.protocols || undefined,
                    timeout: action.payload.config.timeout || 1000,
                    maxAttempts: action.payload.config.maxAttempts || Infinity,
                    onopen: (event) => next({
                        type: actions_types_1.ActionsTypes.WS_OPEN,
                        payload: { connectionName: action.payload.connectionName, event },
                    }),
                    onmessage: (message) => {
                        const wsState = store.getState()[action.payload.connectionName];
                        if (wsState && wsState.handlers) {
                            const handlers = wsState.handlers;
                            Object.keys(handlers).forEach((key) => {
                                const handler = handlers[key];
                                handler.handle(message);
                            });
                        }
                        else {
                            console.error(`Invalid reducer passed to middleware
                                                 ${action.payload.connectionName}`);
                        }
                    },
                    onreconnect: (event) => next({
                        type: actions_types_1.ActionsTypes.WS_RECONNECTING,
                        payload: { connectionName: action.payload.connectionName, event },
                    }),
                    onmaximum: (event) => next({
                        type: actions_types_1.ActionsTypes.WS_RECONNECTION_MAX,
                        payload: { connectionName: action.payload.connectionName, event },
                    }),
                    onclose: (event) => next({
                        type: actions_types_1.ActionsTypes.WS_CLOSED,
                        payload: { connectionName: action.payload.connectionName, event },
                    }),
                    onerror: (event) => next({
                        type: actions_types_1.ActionsTypes.WS_ERROR,
                        payload: { connectionName: action.payload.connectionName, event },
                    }),
                });
            }
            break;
        case actions_types_1.ActionsTypes.WS_CLOSING:
            if (webSocket[action.payload.connectionName]) {
                webSocket[action.payload.connectionName].close();
                webSocket[action.payload.connectionName] = null;
            }
            else {
                console.warn("Socket is closed");
            }
            break;
        case actions_types_1.ActionsTypes.WS_SEND:
            webSocket[action.payload.connectionName].send(action.payload);
            break;
        case actions_types_1.ActionsTypes.WS_RECONNECT:
            webSocket[action.payload.connectionName].reconnect();
            break;
        case actions_types_1.ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER_REQUEST:
            if (typeof action.payload.handler === "function") {
                const hwnd = new action.payload.handler(store.getState, next);
                if (hwnd instanceof ProtocolHandler_1.ProtocolHandler) {
                    next({
                        type: actions_types_1.ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER,
                        payload: {
                            type: hwnd.constructor.name,
                            handler: hwnd,
                            connectionName: action.payload.connectionName,
                        },
                    });
                }
            }
            break;
    }
};
//# sourceMappingURL=websocket.middleware.js.map