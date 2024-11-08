import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import "@repo/ui/styles.css";
import "./index.css";
import "~/lib/styles/themes.css";
import { StyleProvider } from "./providers/style-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StyleProvider />
        <App />
    </React.StrictMode>
);
