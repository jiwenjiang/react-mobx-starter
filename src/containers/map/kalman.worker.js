/*eslint-disable*/
import _ from "lodash";
const obj = {foo: "foo"};

_.has(obj, "foo");

console.log("4444", _.has(obj, "foo"));

// Post data to parent thread
self.postMessage({foo: "foo"});

// Respond to message from parent thread
self.addEventListener("message", (event) => console.log("收到父组件", event));
