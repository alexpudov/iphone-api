import type { AppointmentOut } from "../../types/appointment";
import "./Appointment.css";

import { AppointmentItem } from "./AppointmentItem";

type AppointmentListProps = {
  appointments: AppointmentOut[];
  onCancel: (appointmentId: number) => void;
  deletingAppointmentId: number | null;
};

export function AppointmentList({
  appointments,
  onCancel,
  deletingAppointmentId,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return <section className="page-card">No appointments.</section>;
  }

  return (
    <section className="page-card-appointment">
      <table className="appointments-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              onCancel={onCancel}
              isDeleting={deletingAppointmentId === appointment.id}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
