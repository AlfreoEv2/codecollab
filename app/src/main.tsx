import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faCodeBranch,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { ClerkProvider } from "@clerk/clerk-react";

library.add(faFile, faCodeBranch, faFolder);
// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
