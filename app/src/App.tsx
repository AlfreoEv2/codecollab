import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Editor from "./pages/Editor/Editor";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function PrivateRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/:uuid?"
          element={
            <PrivateRoute>
              <Editor />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
