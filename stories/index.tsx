import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Provider } from "react-redux";
import BasicApp from "./basic";
import {actions, store} from "./createstore";
import Multiple from "./multiple";

storiesOf("Usage", module)
.add("Basic usage", () => <Provider store={store}><BasicApp actions={actions}/></Provider>)
.add("Multiple connections(one per reducer)", () => <Provider store={store}><Multiple/></Provider>);
