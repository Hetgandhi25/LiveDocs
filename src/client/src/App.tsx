import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TextEditor } from "./components/TextEditor";
import {Home} from "./components/Home";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documents/:id" element={<TextEditor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
