import { AlertCircleIcon } from "./Icons.jsx";

/**
 * Reusable form field shell.
 * Renders a label, an icon, the control (input / select / textarea) and a
 * field-specific validation message. Highlights invalid fields with a red border.
 */
export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  registration,
  required = true,
  options = [],
  hint,
}) {
  const isTextarea = type === "textarea";
  const isSelect = type === "select";

  const inputClasses = `field-input ${Icon ? "has-icon" : ""} ${
    error ? "field-input-error" : ""
  }`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="field-shell">
        {Icon && (
          <Icon
            className={`field-icon ${isTextarea ? "field-icon--top" : ""}`}
            aria-hidden="true"
          />
        )}

        {isSelect ? (
          <select
            id={name}
            name={name}
            className={`${inputClasses} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.9rem_center] bg-no-repeat pr-10`}
            {...registration}
          >
            <option value="">Select a department</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea
            id={name}
            name={name}
            rows={4}
            className={inputClasses}
            placeholder={placeholder}
            {...registration}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            {...registration}
          />
        )}
      </div>

      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && (
        <p className="error-text" role="alert">
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

