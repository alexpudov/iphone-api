import type { Doctor } from "../../../types/doctor";
import { Link, useLocation } from "react-router-dom";
import { API_BASE } from "../../../api/config";
import "./DoctorList.css";

type DoctorListProps = {
  doctors: Doctor[];
};

export function DoctorList({ doctors }: DoctorListProps) {
  const location = useLocation();
  return (
    <section className="page-card">
      <ul className="no-markers">
        {doctors.map((doctor) => (
          <li key={doctor.id} className="item">
            <b className="doctor-name">{doctor.full_name}</b>
            <div className="doctor-photo-space">
              <img
                className="doctor-list-photo"
                src={`${API_BASE}${doctor.image_url}`}
                alt="Add a photo!"
              />
            </div>
            <b> Specialization: </b> {doctor.specialization}
            <p>
              {" "}
              <b>Status:</b> {doctor.is_active ? "active" : "inactive"}{" "}
            </p>
            <Link
              className="doctor-details-link-button"
              to={`/doctors/${doctor.id}`}
              state={{
                from: `${location.pathname}${location.search}`,
              }}
            >
              Details
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
