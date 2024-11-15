import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
// import "@repo/ui/styles.css";
import "./index.css";
import "~/lib/styles/themes.css";
import { StyleProvider } from "./providers/style-provider.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StyleProvider />
        <App />
    </React.StrictMode>
);
