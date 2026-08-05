import type { AppointmentOut } from "../../types/doctors";
import { formatDate, formatTime } from "../../pages/utils";

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
    <li>
      <strong>
        Appointment №{appointment.id}
      </strong>

      <div>
        Patient: {appointment.patient_name}
      </div>

      <div>
        Doctor:{" "}
        {appointment.slot.doctor.full_name}
      </div>

      <div>
        Date:{" "}
        {formatDate(
          appointment.slot.start_time
        )}
      </div>

      <div>
        Time:{" "}
        {formatTime(
          appointment.slot.start_time
        )}
        {" — "}
        {formatTime(
          appointment.slot.end_time
        )}
      </div>

      <div>
        Created:{" "}
        {formatDate(appointment.created_at)}
        {" "}
        {formatTime(appointment.created_at)}
      </div>

      <button
        type="button"
        disabled={isDeleting}
        onClick={() =>
          onCancel(appointment.id)
        }
      >
        {isDeleting
          ? "Cancelling..."
          : "Cancel appointment"}
      </button>
    </li>
  );
}