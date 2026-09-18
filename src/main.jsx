import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./styles/base.scss";
import "./styles/themes.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Web4 Publisher could not find the #root element. Ensure index.html contains <div id='root'></div>."
  );
}

ReactDOM.createRoot(rootElement).render(<App />);
