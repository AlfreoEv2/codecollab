import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Editor from "./pages/Editor/Editor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:uuid?" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
