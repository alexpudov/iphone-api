import type { AppointmentOut } from "../../types/allTypes";

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
    return <p>No appointments.</p>;
  }

  return (
    <ul>
      {appointments.map((appointment) => (
        <AppointmentItem
          key={appointment.id}
          appointment={appointment}
          onCancel={onCancel}
          isDeleting={
            deletingAppointmentId === appointment.id
          }
        />
      ))}
    </ul>
  );
}