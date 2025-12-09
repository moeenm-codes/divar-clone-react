// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ToastProvider } from "components/context/ToastContext.jsx";
import { FavoritesProvider } from "components/context/FavoritesContext.jsx";
import { ThemeProvider } from "./components/context/ThemeContext";

import App from "./App.jsx";

import "styles/fonts.css";
import "styles/index.css";
import "styles/responsive/index.css";
import "styles/dark-mode/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
