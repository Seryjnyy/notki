import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "@repo/ui/styles.css";
import "~/lib/styles/themes.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StyleProvider />
        <App />
    </React.StrictMode>
);
