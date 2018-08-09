import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Provider } from "react-redux";
import BasicApp from "./basic";
import Binary from "./binary";
import {actions, store} from "./createstore";
import Multiple from "./multiple";

storiesOf("Usage", module)
.add("Basic usage", () => <Provider store={store}><BasicApp actions={actions}/></Provider>)
.add("Multiple connections(one per reducer)", () => <Provider store={store}><Multiple/></Provider>)
.add("Use handlers to encode/decode binary messages message",
 () => <Provider store={store}><Binary/></Provider>,
);
