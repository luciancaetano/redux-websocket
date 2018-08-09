import { AnyAction, applyMiddleware, combineReducers, createStore } from "redux";
import { createActions, createReducer, ProtocolHandler, wsMiddleware } from "../src/index";

export const store = createStore(
    combineReducers({
        ws: createReducer("ws"),
        ws2: createReducer("ws2"),
        ws3: createReducer("ws3"),
        log: (s: string = "", a: AnyAction) => {
            switch (a.type) {
                case "LOG_ADD": return `${s}\n${a.text}`;
                case "LOG_CLEAR": return ``;
                default: return s;
            }
        },
        log2: (s: string = "", a: AnyAction) => {
            switch (a.type) {
                case "LOG2_ADD": return `${s}\n${a.text}`;
                case "LOG2_CLEAR": return ``;
                default: return s;
            }
        },
    }),
    {},
    applyMiddleware(wsMiddleware),
);
export const actions = createActions("ws");
