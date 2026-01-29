import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "react-quill/dist/quill.snow.css";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import React from "react";
import "react-quill/dist/quill.snow.css";

// createRoot(document.getElementById("root")!).render(<App />);
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);