
export default function simpleHandler(message: MessageEvent, getState, dispatch) {
    dispatch({ type: "LOG_ADD", text: `Server say's "${message.data}"` });
}
