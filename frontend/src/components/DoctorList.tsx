import type { Doctor } from "../types/doctors";
import { Link, useLocation  } from "react-router-dom";

type DoctorListProps = {
  doctors: Doctor[];
};

export function DoctorList({ doctors }: DoctorListProps) {
  const location = useLocation();
  return (
    <ul>
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <b>{doctor.full_name}</b> — {doctor.specialization} — {" "}
          {doctor.is_active ? "active" : "inactive"} {" "}

          <Link
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
  );
}