import { AnyAction } from "redux";
import { ActionsTypes } from "./actions.types";
import { ProtocolHandler } from "./ProtocolHandler";

export class WsActions {

    constructor(public connectionName?: string) {}

    public open(url: string, protocols?: string | string[]): AnyAction {
        return {
            type: ActionsTypes.WS_OPENING,
            payload: {
                url,
                protocols : protocols || undefined,
                connectionName: this.connectionName,
            },
        };
    }

    public close(): AnyAction {
        return {
            type: ActionsTypes.WS_CLOSING,
            payload: {
                connectionName: this.connectionName,
            },
        };
    }

    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): AnyAction {
        return {
            type: ActionsTypes.WS_SEND,
            payload: {
                data,
                connectionName: this.connectionName,
            },
        };
    }

    public attachProtocolHandler(handler: ProtocolHandler, key: string): AnyAction {
        return {
            type: ActionsTypes.WS_ATTACH_PROTOCOL_HANDLER,
            payload: {
                handler,
                key,
                connectionName: this.connectionName,
            },
        };
    }

    public detachProtocolHandler(key: string): AnyAction {
        return {
            type: ActionsTypes.WS_DETACH_PROTOCOL_HANDLER,
            payload: {
                key,
                connectionName: this.connectionName,
            },
        };
    }
}

export const createActions = (connectionName: string) => new WsActions(connectionName);
