import React from "react";
import ReactDOM from "react-dom/client";
import { ToastProvider } from "components/context/ToastContext.jsx";

import App from "./App.jsx";

import "styles/fonts.css";
import "styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
