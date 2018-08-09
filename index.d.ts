declare module '@luciancaetano/redux-websocket' {

	export const JSonFilter: IFilterInterface

	interface AnyAction {
		type: string;
		payload: any;
		[key: string]: any;
	}

	export type ProtocolHandler<T> = (
		message: MessageEvent | T,
		getState: any,
		dispatch: (action: any) => void,
		ws: WebSocket,
	) => void | boolean;

	export const ActionsTypes: {
		WS_OPENING: string;
		WS_OPEN: string;
		WS_CLOSED: string;
		WS_CLOSING: string;
		WS_ERROR: string;
		WS_SEND: string;
		WS_ATTACH_PROTOCOL_HANDLER: string;
		WS_DETACH_PROTOCOL_HANDLER: string;
	};

	export interface IWebsocketState {
		error: boolean;
		errorMessage: string | null;
		status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING";
		handlers: {
			[key: string]: ProtocolHandler<any>;
		};
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
		/** Use handlers on JSON RPC calls */
		// useOnRPC?: boolean;
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
		/** Use Json RPC calls */
		// jsonRPC?: boolean;
	}


	class WsActions {
		connectionName?: string | undefined;
		constructor(connectionName?: string | undefined);
		public open(url: string, skConfig?: ISocketOpenConfig): AnyAction;
		close(): AnyAction;
		send(data: string | ArrayBufferLike | Blob | ArrayBufferView): AnyAction;
		attachProtocolHandler(handler: ProtocolHandler<any>, key: string): AnyAction;
		detachProtocolHandler(key: string): AnyAction;
	}

	export const createActions: (connectionName: string) => WsActions;
	export const createMiddleware: () => any;
	export const wsMiddleware: any;
	export const createReducer: (connectionName: string) => (state?: IWebsocketState, action?: any) => {
		status: string;
		socket: any;
		error: boolean;
		errorMessage: string | null;
		handlers: {
			[key: string]: ProtocolHandler<any>;
		};
	} | {
		error: boolean;
		errorMessage: any;
		status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING";
		handlers: {
			[key: string]: ProtocolHandler<any>;
		};
		socket: WebSocket | null;
	};
}
