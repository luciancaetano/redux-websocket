"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@storybook/react");
const React = require("react");
const react_redux_1 = require("react-redux");
const basic_1 = require("./basic");
const createstore_1 = require("./createstore");
const multiple_1 = require("./multiple");
react_1.storiesOf("Usage", module)
    .add("Basic usage", () => React.createElement(react_redux_1.Provider, { store: createstore_1.store },
    React.createElement(basic_1.default, { actions: createstore_1.actions })))
    .add("Multiple connections(one per reducer)", () => React.createElement(react_redux_1.Provider, { store: createstore_1.store },
    React.createElement(multiple_1.default, null)));
//# sourceMappingURL=index.js.map