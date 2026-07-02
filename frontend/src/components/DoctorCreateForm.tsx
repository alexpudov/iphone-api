import type { DoctorCreate } from "../types/doctors";

type DoctorCreateFormProps = {
  newDoctor: DoctorCreate;
  formErrors: {
    full_name: string;
    specialization: string;
  };
   isValid: boolean;
  onChange: (doctor: DoctorCreate) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function DoctorCreateForm({
  newDoctor,
  formErrors,
  isValid,
  onChange,
  onSubmit,
}: DoctorCreateFormProps) {
 return (
  <form className="doctor-form" onSubmit={onSubmit}>
    <div className="form-field">
  <span className="field-error">
    {formErrors.full_name || "\u00A0"}
  </span>

  <input
  className={formErrors.full_name ? "input-error" : ""}
  type="text"
  placeholder="Full name"
  value={newDoctor.full_name}
  onChange={(e) => {
    const value = e.target.value;

    if (/^[\p{L}\s]*$/u.test(value)) 
      onChange({
        ...newDoctor,
        full_name: value,
      });
    
  }}
/>
</div>

   <div className="form-field">
  <span className="field-error">
    {formErrors.specialization || "\u00A0"}
  </span>

  <input
  className={formErrors.specialization ? "input-error" : ""}
  type="text"
  placeholder="Specialization"
  value={newDoctor.specialization}
  onChange={(e) => {
    const value = e.target.value;

    if (/^[\p{L}\s]*$/u.test(value)) {
      onChange({
        ...newDoctor,
        specialization: value,
      });
    }
  }}
/>
</div>

    <label className="filter-item">
      <input
        type="checkbox"
        checked={newDoctor.is_active}
        onChange={(e) =>
          onChange({
            ...newDoctor,
            is_active: e.target.checked,
          })
        }
      />
      Active
    </label>

    <button type="submit" disabled={!isValid}>Add doctor</button>
  </form>
);
}