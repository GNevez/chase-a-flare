// @/components/checkout/FormInput.tsx
type FormInputProps = {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  containerClassName?: string;
};

export function FormInput({
  label,
  name,
  placeholder,
  type = "text",
  containerClassName = "",
}: FormInputProps) {
  return (
    <div className={containerClassName}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-neutral-600 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-background-light border border-neutral-300 rounded-lg p-3 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
      />
    </div>
  );
}
