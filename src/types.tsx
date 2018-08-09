import { ProtocolHandler } from "./ProtocolHandler";

export interface IWebsocketState {
    error: boolean;
    errorMessage: string | null;
    status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING";
    handlers: { [key: string]: ProtocolHandler<any> };
    socket: WebSocket | null;
}
/**
 * Interface used to handle the messages between client and server
 * Ex encode/decode to json or msgpack
 */
export interface IFilterInterface {
    /** This function is used to encode message */
    encode: (message: any) => any | Promise<any>;
    /** This function is used to decode message */
    decode: (message: MessageEvent) => any | Promise<any>;
}
/**
 * Socket connection configuration
 */
export interface ISocketOpenConfig {
    /** Websocket Binary type default is blob */
    binaryType?: "blob" | "arraybuffer";
    /** Protocols used by websocket */
    protocols?: string | string[] | undefined;
    /** Handle socket messages ex encode and decode to json */
    filter?: IFilterInterface;
}
