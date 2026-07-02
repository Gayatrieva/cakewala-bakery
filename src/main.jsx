// ─── main.jsx ─────────────────────────────────────────────────────────────────
// React application entry point.
// Mounts the <App /> component into the #root div defined in index.html.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
