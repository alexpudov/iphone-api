type DoctorShortOut = {
  id: number;
  full_name: string;
};

type SlotAppointmentOut = {
  id: number;
  start_time: string;
  end_time: string;
  doctor: DoctorShortOut;
};

export type AppointmentCreate = {
  slot_id: number;
  patient_name: string;
};

export type AppointmentOut = {
  id: number;
  slot_id: number;
  patient_name: string;
  created_at: string;
  slot: SlotAppointmentOut;
};
