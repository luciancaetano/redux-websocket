import { ProtocolHandler } from "./ProtocolHandler";

export interface IWebsocketState {
    error: boolean;
    errorMessage: string | null;
    status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING" | "RECONECTING" | "MAX_ATTEMPS";
    handlers: {[key: string]: ProtocolHandler} ;
}

export interface IWebsocketMiddlewareConfig {
    timeout?: number;
    maxAttempts?: number;
}
