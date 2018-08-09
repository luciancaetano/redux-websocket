/**
 * Protocol handler type
 */
export type ProtocolHandler<T> = (
    message: MessageEvent | T,
    getState: any,
    dispatch: (action: any) => void,
    ws: WebSocket,
) => void | boolean;
