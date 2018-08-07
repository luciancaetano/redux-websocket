export type ProtocolHandler = (message: MessageEvent, getState: any, dispatch: (action: any) => void) => void;
