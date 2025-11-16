import React from "react";
import ReactDOM from "react-dom/client";
import { ToastProvider } from "components/context/ToastContext.jsx";

import App from "./App.jsx";

import "styles/fonts.css";
import "styles/index.css";
import { FavoritesProvider } from "components/context/FavoritesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </ToastProvider>
  </React.StrictMode>
);
