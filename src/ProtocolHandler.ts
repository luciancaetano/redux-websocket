export abstract class ProtocolHandler {
    constructor(public getState: any, public dispatch: (action: any) => void) {}
    public abstract handle(message: MessageEvent): boolean;
}
