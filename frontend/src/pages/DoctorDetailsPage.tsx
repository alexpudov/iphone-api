import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDoctorById, updateDoctor, getDoctorSlots, createSlot, patchSlot,} from "../api/api"; //deleteSlot
import type { Doctor,  DoctorUpdate, Slot, SlotCreate, SlotTimeFields, AppointmentCreate} from "../types/doctors";

import { DoctorUpdateForm } from "../components/doctor/DoctorUpdateForm";
import { SlotCreateForm } from "../components/slot/SlotCreateForm";
import { SlotUpdateForm } from "../components/slot/SlotUpdateForm";

export default function DoctorDetailsPage() {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  
  const [doctorLoadError, setDoctorLoadError] =
  useState<string | null>(null);

  const [doctorUpdateError, setDoctorUpdateError] =
  useState<string | null>(null);

  const [editDoctor, setEditDoctor] = useState<DoctorUpdate>({
  full_name: "",
  specialization: "",
  is_active: false,
});

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const id = Number(doctorId);
  const isInvalidId = !doctorId || Number.isNaN(id);

  const [newSlot, setNewSlot] = useState<SlotCreate>({
  doctor_id: id,
  start_time: "",
  end_time: "",
});

function formatSlotDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU");
}

function formatSlotTime(date: string) {
  return new Date(date).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const [editSlotId, setEditSlotId] = useState<number | null> (null)
const [editSlot, setEditSlot] = useState({
  start_time: "",
  end_time: "",
});

const [slotCreateError, setSlotCreateError] = useState<string | null> (null);
const [slotUpdateError, setSlotUpdateError] = useState<string | null> (null);

const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);

const [newAppointment, setNewAppointment] = useState<AppointmentCreate>({
  slot_id: 0,
  patient_name: "",
});

function validateSlotTimes(slot: SlotTimeFields): string | null {
  if (!slot.start_time || !slot.end_time) {
    return "Start time and end time are required";
  }

  const startTime = new Date(slot.start_time);
  const endTime = new Date(slot.end_time);

  const durationInMilliseconds =
    endTime.getTime() - startTime.getTime();

  const minimumDurationInMilliseconds =
    15 * 60 * 1000;

  const maximumDurationInMilliseconds =
    60 * 60 * 1000;

  if (endTime <= startTime) {
    return "End time must be after start time";
  }

  if (
    durationInMilliseconds <
    minimumDurationInMilliseconds
  ) {
    return "Slot duration must be at least 15 minutes";
  }

  if (
    durationInMilliseconds >
    maximumDurationInMilliseconds
  ) {
    return "Slot duration must not exceed one hour";
  }

  return null;
}



  useEffect(() => {
    if (isInvalidId) {
      return;
    }

    fetchDoctorById(id)
      .then((data) => {
        setDoctor(data);
        setEditDoctor({
            full_name: data.full_name,
            specialization: data.specialization,
            is_active: data.is_active,
  });
        setDoctorLoadError(null);
      })
      .catch((e) => setDoctorLoadError(e.message));

      getDoctorSlots(id)
        .then((data) => {
          setSlots(data);
          setSlotsError(null);
        })
    .catch((e) => setSlotsError(e.message));
  }, [id, isInvalidId]);


  function handleUpdateDoctor(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (isInvalidId) {
    return;
  }

  const validateFullName = editDoctor.full_name?.trim() ?? "";
  const validateSpecialization = editDoctor.specialization?.trim() ?? "";
  if (
  !validateFullName ||
  !validateSpecialization
) {
  setDoctorUpdateError("Fields cannot be empty");
  return;
}
 
  if (validateFullName.length < 2 || validateSpecialization.length < 2) {
    setDoctorUpdateError("Fields must be at least 2 characters")
    return;
  }

  if (validateFullName.length > 50 || validateSpecialization.length > 50) {
    setDoctorUpdateError("Fields must be at most 50 characters")
    return;
  }

  if (
  !/^[\p{L}\s]+$/u.test(validateFullName) ||
  !/^[\p{L}\s]+$/u.test(validateSpecialization)
) {
  setDoctorUpdateError(
    "Fields can contain only letters and spaces"
  );
  return;
}

if (
  /\s{2,}/.test(validateFullName) || 
  /\s{2,}/.test(validateSpecialization)) {
  setDoctorUpdateError(
    "Only one space is allowed between words"
  );
  return;
}


  updateDoctor(id, editDoctor)
    .then((updatedDoctor) => {
      setDoctor(updatedDoctor);
      setEditDoctor({
        full_name: updatedDoctor.full_name,
        specialization: updatedDoctor.specialization,
        is_active: updatedDoctor.is_active,
      });
      
      setDoctorUpdateError(null);
    })
    .catch((e) => setDoctorUpdateError(e.message));
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}


function handleCreateSlot(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (isInvalidId) {
    return;
  }

  const validationError = validateSlotTimes(newSlot)

  if (validationError) {
    setSlotCreateError(validationError);
    return;
  }

  createSlot({
    ...newSlot,
    doctor_id: id,
  })
    .then((createdSlot) => {
      setSlots((previousSlots) => [
        ...previousSlots,
        createdSlot,
      ]);

      setNewSlot({
        doctor_id: id,
        start_time: "",
        end_time: "",
      });

      setSlotCreateError(null);
    })
    .catch((error: unknown) => {
      setSlotCreateError(
        getErrorMessage(error)
      );
    });
}

function handleEditSlot(slot: Slot) {
  setEditSlotId(slot.id);

  setEditSlot({
    start_time: slot.start_time.slice(0, 16),
    end_time: slot.end_time.slice(0, 16),
  });

  setSlotUpdateError(null);
}

function handleSaveSlot(slotId: number) {
  const validationError = validateSlotTimes(editSlot);

  if (validationError) {
    setSlotUpdateError(validationError);
    return;
  }

  patchSlot(slotId, editSlot)
    .then((updatedSlot) => {
      setSlots((previousSlots) =>
        previousSlots.map((slot) =>
          slot.id === slotId ? updatedSlot : slot
        )
      );

      setEditSlotId(null);

      setEditSlot({
        start_time: "",
        end_time: "",
      });

      setSlotUpdateError(null);
    })
    .catch((error: unknown) => {
      setSlotUpdateError(getErrorMessage(error));
    });
}

function handleCancelEdit() {
 setEditSlotId(null);

  setEditSlot({
    start_time: "",
    end_time: "",
  });
}

function handleStartBooking(slot: Slot) {
  setBookingSlotId(slot.id);

  setNewAppointment({
    slot_id: slot.id,
    patient_name: "",
  });
}

function handleCreateAppointment() {

}

function handleCancelAppointment() {
  setBookingSlotId(null);
}
  return (
    <div className="container">
      <Link to="/">← Back to doctors</Link>

      <h1>Doctor Details</h1>

      {isInvalidId && <p className="error">Invalid doctor id</p>}

      {!isInvalidId && doctorLoadError && (
        <p className="error">{doctorLoadError}</p>
      )}

      {!isInvalidId && !doctorLoadError && doctor && (
        <div>
          <p>
            <b>ID:</b> {doctor.id}
          </p>

          <p>
            <b>Name:</b> {doctor.full_name}
          </p>

          <p>
            <b>Specialization:</b> {doctor.specialization}
          </p>

          <p>
            <b>Status:</b>{" "}
            {doctor.is_active ? "active" : "inactive"}
          </p>
        </div>
      )}

      {doctor && (
        <DoctorUpdateForm
          value={editDoctor}
          error={doctorUpdateError}
          onChange={(value) => {
            setEditDoctor(value);
            setDoctorUpdateError(null);
          }}
          onSubmit={handleUpdateDoctor}
        />
      )}

  {doctor && (
  <div>
    <h2>Slots</h2>

    {slotsError && <p className="error">{slotsError}</p>}

    {!slotsError && slots.length === 0 && (
      <p>No slots for this doctor.</p>
    )}

    {!slotsError && slots.length > 0 && (
      <ul>
        {slots.map((slot) => (

          <li key={slot.id}>

            {editSlotId === slot.id ? 
            (
              <SlotUpdateForm
                value={editSlot}
                error={slotUpdateError}
                onChange={setEditSlot}
                onSave={() => handleSaveSlot(slot.id)}
                onCancel={handleCancelEdit}
              />
            ) 
            
    : (
      <>
        <span>
          {formatSlotDate(slot.start_time)}{" "}
          {formatSlotTime(slot.start_time)} —{" "}
          {formatSlotTime(slot.end_time)}
        </span>

        <button onClick={() => handleEditSlot(slot)}>
          Edit
          </button>

        <button onClick={() => handleStartBooking(slot)}>
          Book
        </button>

        {bookingSlotId  === slot.id && (
          <form className="doctor-form" onSubmit={handleCreateAppointment}>

          <input
            type="text"
            value={newAppointment.patient_name}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                patient_name: e.target.value,
              })
            }
          />

          <button type="submit"> Book appointment </button>
          <button type="button" onClick={handleCancelAppointment}> Cancel </button>
          </form>)}
      </>
    )}
</li>
          
  ))}
      </ul>
    )}
  </div>
)}

{doctor && (
  <SlotCreateForm
    value={newSlot}
    error={slotCreateError}
    onChange={(value) => {
      setSlotCreateError(null);
      setNewSlot(value);
    }}
    onSubmit={handleCreateSlot}
  />
)}

    </div>
  );
}