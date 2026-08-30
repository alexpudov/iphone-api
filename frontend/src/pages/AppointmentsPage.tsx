import { useEffect, useState } from "react";
import { getErrorMessage } from "./utils";

import { deleteAppointment, fetchAppointments } from "../api/api";

import type { AppointmentOut } from "../types/allTypes";

import { AppointmentList } from "../components/appointment/AppointmentList";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentOut[]>([]);

  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null,
  );

  const [deletingAppointmentId, setDeletingAppointmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await fetchAppointments();

        setAppointments(data);
        setAppointmentsError(null);
      } catch (error: unknown) {
        setAppointmentsError(getErrorMessage(error));
      }
    }

    loadAppointments();
  }, []);

  async function handleCancelAppointment(appointmentId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAppointmentId(appointmentId);

      await deleteAppointment(appointmentId);

      setAppointments((previousAppointments) =>
        previousAppointments.filter(
          (appointment) => appointment.id !== appointmentId,
        ),
      );

      setAppointmentsError(null);
    } catch (error: unknown) {
      setAppointmentsError(getErrorMessage(error));
    } finally {
      setDeletingAppointmentId(null);
    }
  }

  return (
    <div className="container">
      <h1>Appointments</h1>

      {appointmentsError && <p className="error">{appointmentsError}</p>}

      {!appointmentsError && (
        <AppointmentList
          appointments={appointments}
          onCancel={handleCancelAppointment}
          deletingAppointmentId={deletingAppointmentId}
        />
      )}
    </div>
  );
}
