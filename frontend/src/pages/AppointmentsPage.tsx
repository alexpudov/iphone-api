import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { fetchAppointments } from "../api/api";
import type { AppointmentOut } from "../types/doctors";
import { getErrorMessage } from "./utils"

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<AppointmentOut[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await fetchAppointments();

        setAppointments(data);
        setError(null);
      } catch (error: unknown) {
        setError(getErrorMessage(error));
      }
    }

    loadAppointments();
  }, []);

  return (
    <div className="container">

    <Link to="/">← Back to doctors</Link>

      <h1>Appointments</h1>

      {error && <p className="error">{error}</p>}

      {!error && appointments.length === 0 && (
        <p>No appointments.</p>
      )}

      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <strong>
              Appointment №{appointment.id}
            </strong>

            <div>
              Patient: {appointment.patient_name}
            </div>

            <div>
              Slot: {appointment.slot.id}
            </div>

              <div>

            Created: {" "}
            {new Date(appointment.created_at).toLocaleDateString("ru-RU")}

            , {" "}
            {new Date(appointment.created_at).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            })}
            
            <div>
              Slot start time: {new Date(appointment.slot.start_time).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            })}
            </div>
            
            <div>
              Slot end time: {new Date(appointment.slot.end_time).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            })}
            </div>

            <div>
              Doctor id: {appointment.slot.doctor.id}
            </div>

             <div>
              Doctor name: {appointment.slot.doctor.full_name}
            </div>


            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}