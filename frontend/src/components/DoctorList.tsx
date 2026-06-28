import type { Doctor } from "../types/doctors";

type DoctorListProps = {
  doctors: Doctor[];
};

export function DoctorList({ doctors }: DoctorListProps) {
  return (
    <ul>
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <b>{doctor.full_name}</b> — {doctor.specialization} —{" "}
          {doctor.is_active ? "active" : "inactive"}
        </li>
      ))}
    </ul>
  );
}