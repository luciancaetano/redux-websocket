declare module '@luciancaetano/redux-websocket/ProtocolHandler' {
	export abstract class ProtocolHandler {
	    getState: any;
	    dispatch: (action: any) => void;
	    constructor(getState: any, dispatch: (action: any) => void);
	    abstract handle(message: MessageEvent): boolean;
	}

}
declare module '@luciancaetano/redux-websocket/actions.types' {
	export const ActionsTypes: {
	    WS_OPENING: string;
	    WS_OPEN: string;
	    WS_RECONNECT: string;
	    WS_RECONNECTING: string;
	    WS_RECONNECTION_MAX: string;
	    WS_CLOSED: string;
	    WS_CLOSING: string;
	    WS_ERROR: string;
	    WS_SEND: string;
	    WS_ATTACH_PROTOCOL_HANDLER_REQUEST: string;
	    WS_ATTACH_PROTOCOL_HANDLER: string;
	    WS_DETACH_PROTOCOL_HANDLER: string;
	};

}
declare module '@luciancaetano/redux-websocket/types' {
	import { ProtocolHandler } from '@luciancaetano/redux-websocket/ProtocolHandler';
	export interface IWebsocketState {
	    error: boolean;
	    errorMessage: string | null;
	    status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING" | "RECONECTING" | "MAX_ATTEMPS";
	    handlers: {
	        [key: string]: ProtocolHandler;
	    };
	}
	export interface IWebsocketMiddlewareConfig {
	    timeout?: number;
	    maxAttempts?: number;
	}

}
declare module '@luciancaetano/redux-websocket/websocket.reducer' {
	import { ProtocolHandler } from '@luciancaetano/redux-websocket/ProtocolHandler';
	import { IWebsocketState } from '@luciancaetano/redux-websocket/types';
	export const createReducer: (connectionName: string) => (state?: IWebsocketState, action?: any) => {
	    status: string;
	    error: boolean;
	    errorMessage: string | null;
	    handlers: {
	        [key: string]: ProtocolHandler;
	    };
	} | {
	    error: boolean;
	    errorMessage: any;
	    status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING" | "RECONECTING" | "MAX_ATTEMPS";
	    handlers: {
	        [key: string]: ProtocolHandler;
	    };
	};

}
declare module '@luciancaetano/redux-websocket/websocket.actions' {
	import { AnyAction } from "redux";
	import { ProtocolHandler } from '@luciancaetano/redux-websocket/ProtocolHandler';
	import { IWebsocketMiddlewareConfig } from '@luciancaetano/redux-websocket/types'; class WsActions {
	    connectionName?: string | undefined;
	    constructor(connectionName?: string | undefined);
	    open(url: string, protocols: string | string[], config: IWebsocketMiddlewareConfig): AnyAction;
	    close(): AnyAction;
	    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): AnyAction;
	    reconnect(): AnyAction;
	    attachProtocolHandler(handler: typeof ProtocolHandler): AnyAction;
	    detachProtocolHandler(handler: typeof ProtocolHandler): AnyAction;
	}
	export const createActions: (connectionName: string) => WsActions;
	export {};

}
declare module '@luciancaetano/redux-websocket/websocket.middleware' {
	import { AnyAction, MiddlewareAPI } from "redux";
	export const wsMiddleware: any;

}
declare module '@luciancaetano/redux-websocket' {
	export { createReducer } from '@luciancaetano/redux-websocket/websocket.reducer';
	export { createActions } from '@luciancaetano/redux-websocket/websocket.actions';
	export { wsMiddleware } from '@luciancaetano/redux-websocket/websocket.middleware';
	export { ProtocolHandler } from '@luciancaetano/redux-websocket/ProtocolHandler';
	export { IWebsocketState, IWebsocketMiddlewareConfig } from '@luciancaetano/redux-websocket/types';

}
