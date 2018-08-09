import { ActionsTypes } from "./actions.types";
import { ProtocolHandler } from "./ProtocolHandler";
import { IWebsocketState } from "./types";

export const createReducer = (connectionName: string) => {

    const initialState: IWebsocketState = {
        error: false,
        errorMessage: null,
        status: "CLOSED",
        handlers: {},
        socket: null,
    };

    return (state = initialState, action: any = {}) => {
        if (action.payload && action.payload.connectionName === connectionName) {
            switch (action.type) {
                case ActionsTypes.WS_OPEN: return {
                    ...state,
                    status: "OPEN",
                    socket: action.payload.socket,
                };
                case ActionsTypes.WS_CLOSED: return {
                    ...state,
                    status: "CLOSED",
                };
                case ActionsTypes.WS_ERROR: return {
                    ...state,
                    error: true,
                    errorMessage: action.payload.event,
                };

                case ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER:
                    if (typeof action.payload.key === "string" && typeof action.payload.handler === "function" &&
                        typeof state.handlers[action.payload.key] !== "function"
                    ) {
                        return {
                            ...state,
                            handlers: {
                                ...state.handlers,
                                [action.payload.key]: action.payload.handler,
                            },
                        };
                    } else {
                        return state;
                    }

                case ActionsTypes.WS_DETACH_PROTOCOL_HANDLER:
                    if (typeof state.handlers[action.payload.key] === "function") {
                        return {
                            ...state,
                            handlers: {
                                ...state.handlers,
                                [action.payload.key]: undefined,
                            },
                        };
                    } else {
                        return state;
                    }
                default: return state;
            }
        } else {
            return state;
        }
    };
};
