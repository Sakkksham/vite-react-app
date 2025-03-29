import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />  {/* ✅ Login Form at '/' */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
