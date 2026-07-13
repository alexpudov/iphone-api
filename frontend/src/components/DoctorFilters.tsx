import type { DoctorFilters as DoctorFiltersType } from "../types/doctors";

type DoctorFiltersProps = {
  filters: DoctorFiltersType;
  onChange: (filters: DoctorFiltersType) => void;
};

export function DoctorFiltersComponent({ filters, onChange }: DoctorFiltersProps) {
  return (
    <div className="filters">
      <label className="filter-item checkbox-filter">
        <input
          type="checkbox"
          checked={filters.active === true}
          onChange={(e) =>
            onChange({
              ...filters,
              active: e.target.checked ? true : undefined,
              offset: 0,
            })
          }
        />
        <span>Only active</span>
      </label>

      <label className="filter-item">
        <span>Specialization</span>
        <select
          value={filters.specialization}
          onChange={(e) =>
            onChange({
              ...filters,
              specialization: e.target.value,
              offset: 0,
            })
          }
        >
          <option value="">All</option>
          <option value="Pediatrician">Pediatrician</option>
          <option value="Dermatologist">Dermatologist </option>
          <option value="Neurologist">Neurologist </option>
          <option value="Orthopedic Surgeon">Orthopedic Surgeon </option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Gynecologist">Gynecologist </option>
          <option value="Ophthalmologist">Ophthalmologist  </option>
          <option value="Pediatrician">Pediatrician </option>

        </select>
      </label>
    </div>
  );
}