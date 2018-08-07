"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_types_1 = require("./actions.types");
const webSocket = {};
exports.wsMiddleware = (store) => (next) => (action) => {
    switch (action.type) {
        case actions_types_1.ActionsTypes.WS_OPENING:
            if (action.payload) {
                if (webSocket[action.payload.connectionName]) {
                    webSocket[action.payload.connectionName].close();
                }
                const config = action.payload && action.payload.config ? action.payload.config : {};
                const socket = new WebSocket(action.payload.url, action.payload.protocols || undefined);
                socket.addEventListener("open", (event) => next({
                    type: actions_types_1.ActionsTypes.WS_OPEN,
                    payload: { connectionName: action.payload.connectionName, event, socket },
                }));
                socket.addEventListener("message", (message) => {
                    const wsState = store.getState()[action.payload.connectionName];
                    if (wsState && wsState.handlers) {
                        const handlers = wsState.handlers;
                        Object.keys(handlers).forEach((key) => {
                            const handler = handlers[key];
                            if (typeof handler === "function") {
                                handler(message);
                            }
                        });
                    }
                    else {
                        console.error(`Invalid reducer passed to middleware
                                                 ${action.payload.connectionName}`);
                    }
                });
                socket.addEventListener("close", (event) => next({
                    type: actions_types_1.ActionsTypes.WS_CLOSED,
                    payload: { connectionName: action.payload.connectionName, event },
                }));
                socket.addEventListener("error", (event) => next({
                    type: actions_types_1.ActionsTypes.WS_ERROR,
                    payload: { connectionName: action.payload.connectionName, event },
                }));
                webSocket[action.payload.connectionName] = socket;
            }
            break;
        case actions_types_1.ActionsTypes.WS_CLOSING:
            if (webSocket[action.payload.connectionName]) {
                webSocket[action.payload.connectionName].close();
            }
            else {
                console.warn("Socket is closed");
            }
            break;
        case actions_types_1.ActionsTypes.WS_SEND:
            webSocket[action.payload.connectionName].send(action.payload.data);
            break;
    }
    return next(action);
};
//# sourceMappingURL=websocket.middleware.js.map