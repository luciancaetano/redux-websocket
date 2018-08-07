import { ActionsTypes } from "./actions.types";
import { ProtocolHandler } from "./ProtocolHandler";
import { IWebsocketState } from "./types";

export const createReducer = (connectionName: string) => {

    const initialState: IWebsocketState = {
        error: false,
        errorMessage: null,
        status: "CLOSED",
        handlers: {},
    };

    return (state = initialState, action: any = {}) => {
        if (action.payload && action.payload.connectionName === connectionName) {
            switch (action.type) {
                case ActionsTypes.WS_OPEN: return {
                    ...state,
                    status: "OPEN",
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
                    if (action.payload && action.payload.type && action.payload.handler &&
                        !(state.handlers[action.payload.type] instanceof ProtocolHandler)
                    ) {
                        return {
                            ...state,
                            handlers: {
                                ...state.handlers,
                                [action.payload.type]: action.payload.handler,
                            },
                        };
                    } else {
                        return state;
                    }

                case ActionsTypes.WS_DETACH_PROTOCOL_HANDLER:
                    if (action.payload.handler
                        && state.handlers[action.payload.handler.name] instanceof ProtocolHandler) {
                        return {
                            ...state,
                            handlers: {
                                ...state.handlers,
                                [action.payload.handler.name]: undefined,
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
