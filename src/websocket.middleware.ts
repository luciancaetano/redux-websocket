import { AnyAction, Middleware, MiddlewareAPI } from "redux";
import { ActionsTypes } from "./actions.types";
import { ProtocolHandler } from "./ProtocolHandler";

const webSocket: { [key: string]: WebSocket } = {};

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

                            const socket =
                                new WebSocket(action.payload.url, action.payload.protocols || undefined);

                            socket.addEventListener("open", (event) =>
                                next({
                                    type: ActionsTypes.WS_OPEN,
                                    payload: { connectionName: action.payload.connectionName, event, socket },
                                }),
                            );

                            socket.addEventListener("message",
                                (message: MessageEvent) => {
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
                                });
                            // close event
                            socket.addEventListener("close", (event) =>
                                next({
                                    type: ActionsTypes.WS_CLOSED,
                                    payload: { connectionName: action.payload.connectionName, event },
                                }),
                            );
                            // error event
                            socket.addEventListener("error", (event) =>
                                next({
                                    type: ActionsTypes.WS_ERROR,
                                    payload: { connectionName: action.payload.connectionName, event },
                                }),
                            );

                            webSocket[action.payload.connectionName] = socket;
                        }
                        break;

                    case ActionsTypes.WS_CLOSING:
                        if (webSocket[action.payload.connectionName]) {
                            webSocket[action.payload.connectionName].close();
                        } else {
                            console.warn("Socket is closed");
                        }
                        break;

                    case ActionsTypes.WS_SEND:
                        webSocket[action.payload.connectionName].send(action.payload.data);
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
