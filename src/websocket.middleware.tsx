import { AnyAction, Middleware, MiddlewareAPI } from "redux";
import { ActionsTypes } from "./actions.types";
import { ProtocolHandler } from "./ProtocolHandler";
import { ISocketOpenConfig } from "./types";

type TFilter = (message: MessageEvent) => any;
const webSocket: { [key: string]: WebSocket } = {};
const encoders: { [key: string]: TFilter } = {};
const decoders: { [key: string]: TFilter } = {};

export const createMiddleware =
    () =>
        (store: MiddlewareAPI<any, any>) =>
            (next: (action: any) => void) =>
                (action: AnyAction) => {
                    switch (action.type) {
                        case ActionsTypes.WS_OPENING:
                            if (action.payload) {
                                /** Stores connection name */
                                const connectionName = action.payload.connectionName;
                                if (webSocket[connectionName]) {
                                    webSocket[connectionName].close();
                                }

                                const sockConf: ISocketOpenConfig = {
                                    protocols: undefined,
                                    filter: null,
                                    stopHandlerPropagation: false,
                                    jsonRPC: false,
                                    ...action.payload.config,
                                };

                                if (sockConf.filter) {
                                    /** Validates filter and register */
                                    encoders[connectionName] = typeof sockConf.filter.encode === "function" ?
                                        sockConf.filter.encode : undefined as any;
                                    decoders[connectionName] = typeof sockConf.filter.decode === "function" ?
                                        sockConf.filter.decode : undefined as any;
                                }
                                /** Create ws connection using configuration */
                                const socket = new WebSocket(
                                    String(action.payload.url),
                                    sockConf.protocols,
                                );

                                socket.binaryType = typeof sockConf.binaryType === "string" ?
                                    sockConf.binaryType : "blob";

                                /** Handle open event */
                                socket.addEventListener("open", (event) =>
                                    next({
                                        type: ActionsTypes.WS_OPEN,
                                        payload: { connectionName, event, socket },
                                    }),
                                );
                                /** Handle message event */
                                socket.addEventListener("message",
                                    (message: MessageEvent) => {
                                        /** Get action connection state */
                                        const wsState = store.getState()[connectionName];
                                        // --------------------
                                        if (wsState && wsState.handlers) {
                                            const handlers = wsState.handlers;
                                            /** Iterate all handlers */
                                            Object.keys(handlers).forEach((key) => {
                                                const handler: ProtocolHandler<any> = handlers[key];
                                                const decoder = decoders[connectionName];
                                                if (typeof handler === "function") {
                                                    if (typeof decoder === "function") {
                                                        const decoded = decoder(message);
                                                        if (decoded instanceof Promise) {
                                                            decoded
                                                                .then((data) => handler(
                                                                    data,
                                                                    store.getState,
                                                                    store.dispatch,
                                                                    socket,
                                                                ))
                                                                .catch((reason) =>
                                                                    console.error(reason || "Failed to decode data"));
                                                        } else {
                                                            handler(
                                                                decoded,
                                                                store.getState,
                                                                store.dispatch,
                                                                socket,
                                                            );
                                                        }
                                                    } else {
                                                        handler(
                                                            message,
                                                            store.getState,
                                                            store.dispatch,
                                                            socket,
                                                        );
                                                    }
                                                } else {
                                                    return true;
                                                }
                                            });
                                        } else {
                                            console.error(`Invalid reducer passed to middleware
                                                 ${connectionName}`);
                                        }
                                    });
                                /** Handle close event */
                                socket.addEventListener("close", (event) =>
                                    next({
                                        type: ActionsTypes.WS_CLOSED,
                                        payload: { connectionName, event },
                                    }),
                                );
                                /** Handle error event */
                                socket.addEventListener("error", (event) =>
                                    next({
                                        type: ActionsTypes.WS_ERROR,
                                        payload: { connectionName, event },
                                    }),
                                );

                                webSocket[connectionName] = socket;
                            }
                            break;
                        /** Handle closing action and close socket */
                        case ActionsTypes.WS_CLOSING:
                            if (webSocket[action.payload.connectionName]) {
                                webSocket[action.payload.connectionName].close();
                            } else {
                                console.warn("Socket is closed");
                            }
                            break;
                        /** Handle send action */
                        case ActionsTypes.WS_SEND:
                            const filter = encoders[action.payload.connectionName];
                            if (typeof filter === "function") {
                                const encoded = filter(action.payload.data);
                                if (encoded instanceof Promise) {
                                    encoded
                                        .then((data) => webSocket[action.payload.connectionName].send(data))
                                        .catch((reason) =>
                                            console.error(reason || `Failed to encode data`));
                                } else {
                                    webSocket[action.payload.connectionName].send(encoded);
                                }
                            } else {
                                webSocket[action.payload.connectionName].send(action.payload.data);
                            }

                            break;
                    }

                    return next(action);
                };

export const wsMiddleware = createMiddleware();
