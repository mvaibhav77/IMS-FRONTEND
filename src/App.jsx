import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import Navbar from "./components/Navbar";
import { useUserStore } from "./store/useUserStore";
import Dashboard from "./pages/Dashboard";

function App() {
  const accessToken = useUserStore((state) => state.accessToken);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-10">
      <Navbar />

      <div className="flex items-center justify-center">
        <Routes>
          <Route
            path="/"
            element={
              accessToken ? <Dashboard /> : <Login />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
