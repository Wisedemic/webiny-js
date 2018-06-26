import React from "react";
import ReactDOM from "react-dom";
import { app } from "webiny-client";
import App from "./App";

app.setup().then(() => {
    window.app = app;
    ReactDOM.render(<App />, document.getElementById("root"));
});