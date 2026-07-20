import type { SlotTimeFields } from "../../types/doctors";

type SlotUpdateFormProps = {
  value: SlotTimeFields;
  error: string | null;
  onChange: (value: SlotTimeFields) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function SlotUpdateForm({
  value,
  error,
  onChange,
  onSave,
  onCancel,
}: SlotUpdateFormProps) {
  return (
    <>
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

      <button type="button" onClick={onSave}>
        Save
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>

      <div className="slot-create-error">
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}