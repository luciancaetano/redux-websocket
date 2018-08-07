import { AnyAction, Middleware, MiddlewareAPI } from "redux";
import Sockette from "sockette";
import { ActionsTypes } from "./actions.types";
import { ProtocolHandler } from "./ProtocolHandler";

const webSocket: { [key: string]: any } = {};

export const wsMiddleware =
    (store: MiddlewareAPI<any, any>) =>
        (next: (action: any) => void) =>
            (action: AnyAction) => {
                switch (action.type) {
                    case ActionsTypes.WS_OPENING:
                        if (action.payload) {
                            if (webSocket[action.payload.connectionName]) {
                                webSocket[action.payload.connectionName].close();
                            }
                            const config = action.payload && action.payload.config ? action.payload.config : {};
                            webSocket[action.payload.connectionName] = new Sockette(action.payload.url, {
                                // WS Protocols
                                protocols: action.payload.protocols || undefined,
                                // Connection timeout
                                timeout: config.timeout || 1000,
                                // Max connections attempls
                                maxAttempts: config.maxAttempts || Infinity,
                                // open event
                                onopen: (event) =>
                                    next({
                                        type: ActionsTypes.WS_OPEN,
                                        payload: { connectionName: action.payload.connectionName, event },
                                    }),
                                // message event
                                onmessage: (message: MessageEvent) => {
                                    const wsState = store.getState()[action.payload.connectionName];
                                    if (wsState && wsState.handlers) {
                                        const handlers = wsState.handlers;
                                        Object.keys(handlers).forEach((key) => {
                                            const handler = handlers[key];
                                            handler.handle(message);
                                        });
                                    } else {
                                        console.error(`Invalid reducer passed to middleware
                                                 ${action.payload.connectionName}`);
                                    }
                                },
                                // reconnect event
                                onreconnect: (event) =>
                                    next({
                                        type: ActionsTypes.WS_RECONNECTING,
                                        payload: { connectionName: action.payload.connectionName, event },
                                    }),
                                // maximum reconnections event
                                onmaximum: (event) =>
                                    next({
                                        type: ActionsTypes.WS_RECONNECTION_MAX,
                                        payload: { connectionName: action.payload.connectionName, event },
                                    }),
                                // close event
                                onclose: (event) =>
                                    next({
                                        type: ActionsTypes.WS_CLOSED,
                                        payload: { connectionName: action.payload.connectionName, event },
                                    }),
                                // error event
                                onerror: (event) =>
                                    next({
                                        type: ActionsTypes.WS_ERROR,
                                        payload: { connectionName: action.payload.connectionName, event },
                                    }),
                            });
                        }
                        break;

                    case ActionsTypes.WS_CLOSING:
                        if (webSocket[action.payload.connectionName]) {
                            webSocket[action.payload.connectionName].close();
                            webSocket[action.payload.connectionName] = null;
                        } else {
                            console.warn("Socket is closed");
                        }
                        break;

                    case ActionsTypes.WS_SEND:
                        webSocket[action.payload.connectionName].send(action.payload);
                        break;

                    case ActionsTypes.WS_RECONNECT:
                        webSocket[action.payload.connectionName].reconnect();
                        break;

                    case ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER_REQUEST:
                        if (typeof action.payload.handler === "function") {
                            const hwnd = new action.payload.handler(store.getState, next);
                            if (hwnd instanceof ProtocolHandler) {
                                next({
                                    type: ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER,
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
