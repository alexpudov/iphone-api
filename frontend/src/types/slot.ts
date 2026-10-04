export type Slot = {
  id: number;
  doctor_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

export type SlotCreate = {
  doctor_id: number;
  start_time: string;
  end_time: string;
};

export type SlotUpdate = Partial<Omit<SlotCreate, "doctor_id">>;

export type SlotTimeFields = Pick<SlotCreate, "start_time" | "end_time">;
