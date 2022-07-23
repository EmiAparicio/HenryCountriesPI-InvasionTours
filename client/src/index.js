/////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////
// Packages
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// Application files
import { App } from "./App";
import { store } from "./redux/store";

import "./index.css";

/////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////
// App render - Redux store provide
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
