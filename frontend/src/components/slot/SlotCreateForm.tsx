import type { SlotCreate, } from "../../types/doctors";

type SlotCreateFormProps = {
  value: SlotCreate;
  error: string | null;
  onChange: (value: SlotCreate) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function SlotCreateForm({
  value,
  error,
  onChange,
  onSubmit,
}: SlotCreateFormProps) {

  return (
    <div className="slot-create-section">
      <form className="doctor-form" onSubmit={onSubmit}>
        <h2>Create slot</h2>

        <label>
          Start time:{" "}
          <input
            type="datetime-local"
            value={value.start_time}
            onChange={(event) =>
              onChange({
                ...value,
                start_time: event.target.value,
              })
            }
          />
        </label>

        <label>
          End time:{" "}
          <input
            type="datetime-local"
            value={value.end_time}
            onChange={(event) =>
              onChange({
                ...value,
                end_time: event.target.value,
              })
            }
          />
        </label>

        <button type="submit">Create slot</button>
      </form>

      <div className="slot-create-error">
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}