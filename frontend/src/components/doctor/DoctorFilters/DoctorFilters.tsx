import type { DoctorFilters as DoctorFiltersType } from "../../../types/doctor";
import "./DoctorFilters.css";

type DoctorFiltersProps = {
  filters: DoctorFiltersType;
  onChange: (filters: DoctorFiltersType) => void;
};

export function DoctorFiltersComponent({
  filters,
  onChange,
}: DoctorFiltersProps) {
  return (
    <section className="page-card">
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
            <option value="infectious disease">Infectious disease</option>
            <option value="psychiatrist">Psychiatrist </option>
            <option value="neurosurgeon">Neurosurgeon </option>
            <option value="therapist">Therapist </option>
          </select>
        </label>
      </div>
    </section>
  );
}
