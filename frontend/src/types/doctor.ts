export type Doctor = {
  id: number;
  full_name: string;
  specialization: string;
  is_active: boolean;
  image_url: string | null;
};

export type DoctorFilters = {
  active?: boolean;
  specialization?: string;
  limit?: number;
  offset?: number;
};

export type DoctorCreate = {
  full_name: string;
  specialization: string;
  is_active: boolean;
};

export type DoctorUpdate = Partial<DoctorCreate>;
