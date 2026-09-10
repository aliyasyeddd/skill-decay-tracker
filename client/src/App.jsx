import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import SignUp from "./components/SignUp";
import SkillDetail from "./pages/SkillDetail";



function App() {
  return(
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills/:id" element={<SkillDetail />} />
      </Routes>
    </BrowserRouter>
  )
  ;
}

export default App;
