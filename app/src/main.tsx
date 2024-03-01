import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFile, faCodeBranch } from "@fortawesome/free-solid-svg-icons";

library.add(faFile, faCodeBranch);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
