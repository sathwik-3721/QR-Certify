import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./global.css";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { Toaster } from "./components/ui/toaster.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
        <App />
        <Toaster />
      {/* </ThemeProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);
