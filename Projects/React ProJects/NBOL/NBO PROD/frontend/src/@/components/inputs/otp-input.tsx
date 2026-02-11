import { useRef } from "react";

interface OtpInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
}

const OtpInput = ({
  name,
  value,
  onChange,
  length = 6,
  error,
}: OtpInputProps) => {
  const inputs = useRef<HTMLInputElement[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value.replace(/\D/g, "");
    const newValue = value.split("");

    if (val) {
      newValue[index] = val[val.length - 1];
      const joined = newValue.join("");
      onChange(joined);

      if (index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    } else {
      newValue[index] = "";
      onChange(newValue.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValue = value.split("");

      if (value[index]) {
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
        newValue[index - 1] = "";
        onChange(newValue.join(""));
      }
    }
  };

  return (
    <div className='flex flex-col gap-1 '>
      <div className='flex gap-2 '>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              if (el) inputs.current[i] = el;
            }}
            type='text'
            inputMode='numeric'
            maxLength={1}
            className={`w-10 h-10 rounded-sm text-center border  text-lg ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={value[i] || ""}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  );
};

export default OtpInput;
