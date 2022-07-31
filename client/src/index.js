///////////////////////////////////////////////////////////////////////////////
// Imports
///////////////////////////////////////////////////////////////////////////////
// Packages
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import dotenv from "dotenv";
import axios from "axios";

// Application files
import { App } from "./App";
import { store } from "./redux/store";

import "./index.css";

///////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////

dotenv.config();
axios.defaults.baseURL = process.env.REACT_APP_API || "http://127.0.0.1:3001/";

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
