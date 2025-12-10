import { cn } from "@/lib";
import { useGetDataRef } from "@/hooks";
import { useFormContext } from "react-hook-form";
import { Label, RadioGroup, RadioGroupItem } from "../ui";
import { DashedInputWrapper } from "./dashed-input-wrapper";

function RadioInput({
  options,
  name,
  label,
  dataRef,
  required,
  className,
  helpText,
  orientation = "horizontal",
  onValueChange,
}: {
  name: string;
  options: { value: any; label: string }[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  dataRef?: string;
  className?: string;
  helpText?: string;
  orientation?: "horizontal" | "vertical";
  onValueChange?: (val: boolean) => void;
}) {
  const componentDataRef: string = useGetDataRef(dataRef, name, "components.radio-field");

  const { setValue, watch, register } = useFormContext(); // Access the react-hook-form context

  // Handle value change
  const handleChange = (value: any) => {
    setValue(name, value, { shouldValidate: true }); // Update form value manually
    onValueChange && onValueChange(value);
  };

  const value = watch(name);

  const { disabled } = register(name);

  return (
    <DashedInputWrapper
      helpText={helpText}
      label={label}
      required={required}
      name={name}
      containerClass={cn("mt-4",className)}
      className="p-4 rounded-sm"
      dataRef={`${componentDataRef}`}
    >
      {() => (
        <RadioGroup
          data-ref={`${componentDataRef}.radio-group`}
          // style={{ "--primary": "238.7 83.5% 66.7%", "--ring": "238.7 83.5% 66.7%" } as React.CSSProperties}
          className={cn(`${orientation === "horizontal" ? "flex items-center flex-wrap gap-5" : ""}`)}
          value={value} // Controlled value
          onValueChange={handleChange}
          disabled={disabled}
        >
          {options?.map((option) => (
            <div className="flex items-center gap-2" key={"radio" + name + option?.value}>
              <RadioGroupItem
                data-ref={`${componentDataRef}.option-value.${option?.value}${option.value === value ? ".selected" : ""}`}
                value={option?.value}
                id={`radio-${option?.value}`}
              />
              <Label
                data-ref={`${componentDataRef}.option-label.${option?.value}${option.value === value ? ".selected" : ""}`}
                className={cn(disabled ? "cursor-default" : "cursor-pointer", "font-normal")}
                htmlFor={`radio-${option?.value}`}
              >
                {option?.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </DashedInputWrapper>
  );
}

export { RadioInput };
export default RadioInput;
