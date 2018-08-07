## Motivation
Doing a lot of research I did not find anything very solid about working with Redux and WebSocket, so I started some tests and came up with some conclusions that helped me get started in this library which controls the connection by a middleware, the state by the reducer and the messages from the server by a protocol handler.

# Installing

`
npm install --save @luciancaetano/redux-websocket
`

OR

`
yarn add @luciancaetano/redux-websocket
`

Then, to enable Redux Websocket, use applyMiddleware():
```javascript
import { createStore, applyMiddleware } from 'redux';
import {middleware as wsMiddleware, createReducer} from '@luciancaetano/redux-websocket';
import rootReducer from './reducers/index';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  combineReducers({
    ...rootReducer,
    ws: createReducer('ws')
  }),
  applyMiddleware(wsMiddleware)
);
```

# Actions
```javascript
 import { createActions } from '@luciancaetano/redux-websocket';
 
 const actions = createActions('ws');
```
### Open
  The open action initializes a new connection via the websocket if it does not already exist.
  ```typescript
   interface IWebsocketMiddlewareConfig {
        timeout?: number;
        maxAttempts?: number;
    }
    function open(url: string, protocols: string | string[], config: IWebsocketMiddlewareConfig):Action
  ```
### Close()
  The close action closes the connection
  ```typescript
    function close():Action;
  ```
### Send
  Enqueues data to be transmited.
  ```typescript
function send(data: string | ArrayBufferLike | Blob | ArrayBufferView):Action;
  ```

### attachProtocolHandler
  Add a protocol handler to our websocket state
  ```typescript
    function attachProtocolHandler(handler: ProtocolHandler, key: string):Action;
  ```
### detachProtocolHandler
Remove a procol handler from our websocket state
  ```typescript
    function attachProtocolHandler(key: string):Action;
  ```

# ProtocolHandler
```typescript
 import { ProtocolHandler } from '@luciancaetano/redux-websocket';

 type ProtocolHandler = (message: MessageEvent, getState: any, dispatch: (action: any) => void) => void;


```

```javascript
import { createActions, ProtocolHandler } from '@luciancaetano/redux-websocket';
const actions = createActions('ws');
function PongHandler(message: MessageEvent, getState: any, dispatch: (action: any) => void){
    if(message.data == 'PONG'){
      alert('Server says pong');
      this.dispatch({type: 'DO_PING'});
      console.log(this.getState());
    }
}
// Register the PongHandler
store.dispatch(actions.attachProtocolHandler(PongHandler, "PongHandler"))

```

# Reducer state
Working together with the middleware we have the reducer which contains information about the state of the connection and the ProtocolHandler's registered errors etc.
See the interface:
```typescript
interface IWebsocketState {
    error: boolean;
    errorMessage: string | null;
    status: "OPEN" | "OPENING" | "CLOSED" | "CLOSING";
    handlers: {[key: string]: ProtocolHandler} ;
}
```


# Multiple Connection

To use multiple connection just user another name for connection name parameter in createReducer and createActions

```javascript
import { createStore, applyMiddleware } from 'redux';
import {middleware as wsMiddleware, createReducer, createActions} from '@luciancaetano/redux-websocket';
import rootReducer from './reducers/index';
 const actionsConn1 = createActions('ws1');
 const actionsConn2 = createActions('ws2');
// Note: this API requires redux@>=3.1.0
const store = createStore(
  combineReducers({
    ...rootReducer,
    ws1: cc('ws1'),
    ws2: createReducer('ws2'),
  }),
  applyMiddleware(wsMiddleware)
);

```


# TODO
- Remove create reducer and set only single reducer for multiple dynamic connections