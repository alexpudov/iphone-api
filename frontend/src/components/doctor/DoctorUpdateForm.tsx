import type { DoctorUpdate } from "../../types/doctors";

type DoctorUpdateFormProps = {
  value: DoctorUpdate;
  error: string | null;
  onChange: (value: DoctorUpdate) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function DoctorUpdateForm({
  value,
  onChange,
  onSubmit,
  error,
  
}: DoctorUpdateFormProps) {

  return (
  
    <form className="doctor-form" onSubmit={onSubmit}>
      <input
        type="text"
        value={value.full_name ?? ""}
        onChange={(event) =>
          onChange({
            ...value,
            full_name: event.target.value,
          })
        }
      />

      <input
        type="text"
        value={value.specialization ?? ""}
        onChange={(event) =>
          onChange({
            ...value,
            specialization: event.target.value,
          })
        }
      />

      <label className="filter-item">
        <input
          type="checkbox"
          checked={value.is_active === true}
          onChange={(event) =>
            onChange({
              ...value,
              is_active: event.target.checked,
            })
          }
        />

        Active
      </label>

      <button type="submit">Save changes</button>
      
      {error && <p className="error">{error}</p>}
    </form>
  );
}