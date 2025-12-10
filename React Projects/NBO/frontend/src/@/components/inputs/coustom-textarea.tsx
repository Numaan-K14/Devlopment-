import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useField } from "formik";
import { Label } from "../label";

interface TextAreaProps {
  name: string;
  label?: string;
  className?: string;
  placeholder?: string;
  value?: any;
  disabled?: boolean;
  onPaste?: any;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function CoustomTextarea({
  name,
  label,
  className = "",
  placeholder,
  value,
  disabled,
  onChange,
  onPaste,
}: TextAreaProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <Label>{label}</Label>}
      <Textarea
        disabled={disabled}
        onPaste={onPaste}
        placeholder={placeholder || "Type your message here."}
        {...field}
        value={value !== undefined ? value : field.value}
        onChange={(e) => {
          field.onChange(e);
          onChange?.(e);
        }}
        className={cn(className, "h-full !rounded-[8px]", {
          "border-destructive": meta.touched && meta.error,
        })}
      />
      {meta.touched && meta.error && (
        <div className='text-red-500 text-xs'>{meta.error}</div>
      )}
    </div>
  );
}
