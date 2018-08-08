"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const index_1 = require("../src/index");
exports.store = redux_1.createStore(redux_1.combineReducers({
    ws: index_1.createReducer("ws"),
    ws2: index_1.createReducer("ws2"),
    log: (s = "", a) => {
        switch (a.type) {
            case "LOG_ADD": return `${s}\n${a.text}`;
            case "LOG_CLEAR": return ``;
            default: return s;
        }
    },
    log2: (s = "", a) => {
        switch (a.type) {
            case "LOG2_ADD": return `${s}\n${a.text}`;
            case "LOG2_CLEAR": return ``;
            default: return s;
        }
    },
}), {}, redux_1.applyMiddleware(index_1.wsMiddleware));
exports.actions = index_1.createActions("ws");
//# sourceMappingURL=createstore.js.map