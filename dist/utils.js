"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSonFilter = {
    encode: (m) => JSON.stringify(m),
    decode: (m) => {
        try {
            return JSON.parse(m.data);
        }
        catch (e) {
            return new Error("jJson in invalid format.");
        }
    },
};
//# sourceMappingURL=utils.js.map