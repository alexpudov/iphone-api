import { Routes, Route } from "react-router-dom";
import DoctorsPage  from "./pages/DoctorsPage";
import DoctorDetailsPage  from "./pages/DoctorDetailsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DoctorsPage />} />
      <Route path="/doctors/:doctorId" element={<DoctorDetailsPage />} />
    </Routes>
  );
}