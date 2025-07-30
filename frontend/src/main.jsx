import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./Authentication/AuthContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <HeroUIProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HeroUIProvider>
  // </React.StrictMode>,
);
