"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_types_1 = require("./actions.types");
const webSocket = {};
const encoders = {};
const decoders = {};
exports.createMiddleware = () => (store) => (next) => (action) => {
    switch (action.type) {
        case actions_types_1.ActionsTypes.WS_OPENING:
            if (action.payload) {
                const connectionName = action.payload.connectionName;
                if (webSocket[connectionName]) {
                    webSocket[connectionName].close();
                }
                const sockConf = Object.assign({ protocols: undefined, filter: null, stopHandlerPropagation: false, jsonRPC: false }, action.payload.config);
                if (sockConf.filter) {
                    encoders[connectionName] = typeof sockConf.filter.encode === "function" ?
                        sockConf.filter.encode : undefined;
                    decoders[connectionName] = typeof sockConf.filter.decode === "function" ?
                        sockConf.filter.decode : undefined;
                }
                const socket = new WebSocket(String(action.payload.url), sockConf.protocols);
                socket.binaryType = typeof sockConf.binaryType === "string" ?
                    sockConf.binaryType : "blob";
                socket.addEventListener("open", (event) => next({
                    type: actions_types_1.ActionsTypes.WS_OPEN,
                    payload: { connectionName, event, socket },
                }));
                socket.addEventListener("message", (message) => {
                    const wsState = store.getState()[connectionName];
                    if (wsState && wsState.handlers) {
                        const handlers = wsState.handlers;
                        Object.keys(handlers).forEach((key) => {
                            const handler = handlers[key];
                            const decoder = decoders[connectionName];
                            if (typeof handler === "function") {
                                if (typeof decoder === "function") {
                                    const decoded = decoder(message);
                                    if (decoded instanceof Promise) {
                                        decoded
                                            .then((data) => handler(data, store.getState, store.dispatch))
                                            .catch((reason) => console.error(reason || "Failed to decode data"));
                                    }
                                    else {
                                        handler(decoded, store.getState, store.dispatch);
                                    }
                                }
                                else {
                                    handler(message, store.getState, store.dispatch);
                                }
                            }
                            else {
                                return true;
                            }
                        });
                    }
                    else {
                        console.error(`Invalid reducer passed to middleware
                                                 ${connectionName}`);
                    }
                });
                socket.addEventListener("close", (event) => next({
                    type: actions_types_1.ActionsTypes.WS_CLOSED,
                    payload: { connectionName, event },
                }));
                socket.addEventListener("error", (event) => next({
                    type: actions_types_1.ActionsTypes.WS_ERROR,
                    payload: { connectionName, event },
                }));
                webSocket[connectionName] = socket;
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
            const filter = encoders[action.payload.connectionName];
            if (typeof filter === "function") {
                const encoded = filter(action.payload.data);
                if (encoded instanceof Promise) {
                    encoded
                        .then((data) => webSocket[action.payload.connectionName].send(data))
                        .catch((reason) => console.error(reason || `Failed to encode data`));
                }
                else {
                    webSocket[action.payload.connectionName].send(encoded);
                }
            }
            else {
                webSocket[action.payload.connectionName].send(action.payload.data);
            }
            break;
    }
    return next(action);
};
exports.wsMiddleware = exports.createMiddleware();
//# sourceMappingURL=websocket.middleware.js.map