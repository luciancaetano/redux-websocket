"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
class BasicApp extends React.Component {
    render() {
        console.log(this.props);
        return React.createElement("div", null, "Sample app");
    }
}
exports.default = react_redux_1.connect((state) => ({ state }))(BasicApp);
//# sourceMappingURL=sample.js.map