"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_types_1 = require("./actions.types");
const ProtocolHandler_1 = require("./ProtocolHandler");
exports.createReducer = (connectionName) => {
    const initialState = {
        error: false,
        errorMessage: null,
        status: "CLOSED",
        handlers: {},
        socket: null,
    };
    return (state = initialState, action = {}) => {
        if (action.payload && action.payload.connectionName === connectionName) {
            switch (action.type) {
                case actions_types_1.ActionsTypes.WS_OPEN: return Object.assign({}, state, { status: "OPEN", socket: action.payload.socket });
                case actions_types_1.ActionsTypes.WS_CLOSED: return Object.assign({}, state, { status: "CLOSED" });
                case actions_types_1.ActionsTypes.WS_ERROR: return Object.assign({}, state, { error: true, errorMessage: action.payload.event });
                case actions_types_1.ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER:
                    if (action.payload && action.payload.type && action.payload.handler &&
                        !(state.handlers[action.payload.type] instanceof ProtocolHandler_1.ProtocolHandler)) {
                        return Object.assign({}, state, { handlers: Object.assign({}, state.handlers, { [action.payload.type]: action.payload.handler }) });
                    }
                    else {
                        return state;
                    }
                case actions_types_1.ActionsTypes.WS_DETACH_PROTOCOL_HANDLER:
                    if (action.payload.handler
                        && state.handlers[action.payload.handler.name] instanceof ProtocolHandler_1.ProtocolHandler) {
                        return Object.assign({}, state, { handlers: Object.assign({}, state.handlers, { [action.payload.handler.name]: undefined }) });
                    }
                    else {
                        return state;
                    }
                default: return state;
            }
        }
        else {
            return state;
        }
    };
};
//# sourceMappingURL=websocket.reducer.js.map