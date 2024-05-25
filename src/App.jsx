import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import AIResponse from "./pages/AIResponse.jsx";
import Navigation from "./components/Navigation.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/ai-response" element={<AIResponse />} />
      </Routes>
      <Navigation />
    </Router>
  );
}

export default App;
