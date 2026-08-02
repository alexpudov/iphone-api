import { Routes, Route } from "react-router-dom";
import DoctorsPage  from "./pages/DoctorsPage";
import DoctorDetailsPage  from "./pages/DoctorDetailsPage";
import AppointmentsPage from "./pages/AppointmentsPage";

export default function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<DoctorsPage />} />

      <Route 
        path="/doctors/:doctorId" 
        element={<DoctorDetailsPage />} />
        
      <Route 
        path="/appointments" 
        element={<AppointmentsPage />}
  />
    </Routes>
  );
}