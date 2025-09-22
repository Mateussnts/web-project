import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Cadastro/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Conversion from "./pages/Calculadora/Conversion"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/conversion" element={<Conversion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
