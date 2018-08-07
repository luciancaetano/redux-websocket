import { ProtocolHandler } from "./ProtocolHandler";

export interface IWebsocketState {
    error: boolean;
    errorMessage: string | null;
    status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING";
    handlers: {[key: string]: ProtocolHandler} ;
}
