import type { SlotCreate } from "../../../types/slot";
import "./SlotCreateForm.css";

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
      <h2>Create slot</h2>
      <form className="slot-create-form" onSubmit={onSubmit}>
        <label className="form-field">
          Start time:{" "}
          <input
            className="datetime-input"
            type="datetime-local"
            lang="en-GB"
            value={value.start_time}
            onChange={(event) =>
              onChange({
                ...value,
                start_time: event.target.value,
              })
            }
          />
        </label>

        <label className="form-field">
          End time:{" "}
          <input
            className="datetime-input"
            type="datetime-local"
            lang="en-GB"
            value={value.end_time}
            onChange={(event) =>
              onChange({
                ...value,
                end_time: event.target.value,
              })
            }
          />
        </label>

        <button type="submit" className="button button-primary slot-submit">
          Create slot
        </button>
      </form>

      {error && (
        <div className="slot-create-error">
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}
