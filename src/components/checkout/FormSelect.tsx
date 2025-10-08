type FormSelectProps = {
  label: string;
  name: string;
  options: string[];
  containerClassName?: string;
};

export function FormSelect({
  label,
  name,
  options,
  containerClassName = "",
}: FormSelectProps) {
  return (
    <div className={containerClassName}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-neutral-600 mb-2"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full bg-white border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
