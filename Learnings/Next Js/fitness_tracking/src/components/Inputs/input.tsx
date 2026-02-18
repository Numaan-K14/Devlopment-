import { useField } from "formik";

export function CustomInput({ className = "", ...props }) {
  const [field, mata] = useField(props.name);
  return (
    <>
      <input
        {...field}
        {...props}
        className={`rounded-md border px-4 py-2 bg-white focus:outline-none w-full ${className}`}
      />
      {mata.touched && mata.error && (
        <div className="text-red-500 text-sm">{mata.error}</div>
      )}
    </>
  );
}
