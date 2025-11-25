import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import DashboardLayout from "./layout/DashboardLayout";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgetPassword from "./pages/public/ForgetPassword";
import ConfirmAccount from "./pages/public/ConfirmAccount";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Area pública */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="registrar" element={<Register />} />
            <Route path="olvide-password" element={<ForgetPassword />} />
            <Route path="confirmar/:id" element={<ConfirmAccount />} />
          </Route>
          
          {/* Area protegida - Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
