import { Routes, Route } from "react-router-dom";
import DoctorsPage from "./pages/doctorsPage/DoctorsPage";
import DoctorDetailsPage from "./pages/doctorDetailsPage/DoctorDetailsPage";
import AppointmentsPage from "./pages/appointmentsPage/AppointmentsPage";
import LoginPage from "./pages/loginPage/LoginPage";
import { AuthRequire } from "./components/ProtectedRoute";
import RegisterPage from "./pages/registerPage/RegisterPage";
import { Layout } from "./components/navigation/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <AuthRequire>
            <Layout />
          </AuthRequire>
        }
      >
        <Route path="/" element={<DoctorsPage />} />

        <Route path="/doctors/:doctorId" element={<DoctorDetailsPage />} />

        <Route path="/appointments" element={<AppointmentsPage />} />
      </Route>
    </Routes>
  );
}
