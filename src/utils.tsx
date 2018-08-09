import { IFilterInterface } from "./types";

export const JSonFilter: IFilterInterface = {
    encode: (m) => JSON.stringify(m),
    decode: (m) => {
        try {
            return JSON.parse(m.data);
        } catch (e) {
            return new Error("jJson in invalid format.");
        }
    },
};
