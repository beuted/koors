import Login from "./Login";
import App from "./App";
import { Routes, Route, Link } from "react-router-dom";

function Koors() {
  return (
    <div className="Koors">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </div>
  )
}

export default Koors;