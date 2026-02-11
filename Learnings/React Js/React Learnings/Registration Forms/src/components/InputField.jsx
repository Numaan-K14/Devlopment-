export function InputField({
 required,
  label,
  type,
  id,
  pattern,
  maxLength,
  autoComplete,
  value,
  placeholder,
  name,
  onChange,
  htmlFor,
  
}) {
  return (
    <div className="mb-3">
      <label htmlFor={htmlFor} className="text-lg font-medium ">
        {label}
      </label>
      <input
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        id={id}
        pattern={pattern}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="flex w-full outline-none bg-blue-50 px-2 py-2 rounded-md"
      />
    </div>
  );
}
