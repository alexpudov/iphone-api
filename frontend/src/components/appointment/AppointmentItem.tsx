import type { AppointmentOut } from "../../types/appointment";
import { formatDate, formatTime } from "../../utils";
import "./Appointment.css";

type AppointmentItemProps = {
  appointment: AppointmentOut;
  onCancel: (appointmentId: number) => void;
  isDeleting: boolean;
};

export function AppointmentItem({
  appointment,
  onCancel,
  isDeleting,
}: AppointmentItemProps) {
  return (
    <tr>
      <td>{appointment.id}</td>

      <td>{appointment.patient_name}</td>

      <td>{appointment.slot.doctor.full_name}</td>

      <td>{formatDate(appointment.slot.start_time)}</td>

      <td>
        {formatTime(appointment.slot.start_time)}
        {" — "}
        {formatTime(appointment.slot.end_time)}
      </td>

      <td>
        {formatDate(appointment.created_at)}{" "}
        {formatTime(appointment.created_at)}
      </td>

      <td>
        <button
          className="button button-danger"
          type="button"
          disabled={isDeleting}
          onClick={() => onCancel(appointment.id)}
        >
          {isDeleting ? "Cancelling..." : "Cancel"}
        </button>
      </td>
    </tr>
  );
}
