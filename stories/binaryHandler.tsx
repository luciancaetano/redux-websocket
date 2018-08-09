
export default function binaryHandler(message: any, getState, dispatch) {
    dispatch({ type: "LOG_ADD", text: `Server say's "${message}"` });
}
