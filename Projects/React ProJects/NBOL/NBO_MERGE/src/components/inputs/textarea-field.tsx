import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import React from "react";
import { type FieldError, useFormContext } from "react-hook-form";
import { HelpText } from "./help-text";
import { useGetDataRef } from "@/hooks/useGetDataRef";
import { Textarea } from "../ui/textarea";

const getValueByKey = (obj: any, key: string): any => {
  return key.split(".").reduce((acc, part) => acc?.[part], obj);
};

interface textareaProps {
  name: string;
  rows?: number;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  dataRef?: string;
  helpText?: string;
  defaultValue?: string;
}

export const TextareaField: React.FC<textareaProps> = ({
  name,
  label,
  placeholder,
  disabled,
  required,
  className,
  dataRef,
  helpText,
  defaultValue,
  rows = 3,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    // getValues,
  } = useFormContext(); // Access the react-hook-form context

  const error = getValueByKey(errors, name) as FieldError | undefined;
  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.textarea-field"
  );

  return (
    <div
      className={` group relative ${className}`}
      data-ref={`${componentDataRef}.container`}
    >
      {label && (
        <label
          data-ref={`${componentDataRef}.label`}
          htmlFor={name}
          className="block mb-1.5 bg-background px-1 text-sm leading-5 font-normal text-helper"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div
        className={cn("focus-within:p-px rounded-sm", {
          "bg-tertiary-gradient": !error,
        })}
      >
        <Textarea
          autoFocus={false}
          rows={rows}
          id={name}
          placeholder={placeholder}
          data-ref={`${componentDataRef}.input`}
          disabled={disabled}
          defaultValue={defaultValue}
          {...register(name, required ? { required } : {})}
          onChange={(e) => {
            const cleanValue = DOMPurify.sanitize(e.target.value, {
              ALLOWED_TAGS: [],
              ALLOWED_ATTR: [],
            });
            setValue(name, cleanValue, { shouldValidate: true });
          }}
          className={`border text-md! font-medium font-red-display block w-full! text-text-primary bg-background! placeholder:text-gray-300 rounded-sm px-4 py-3 focus-visible:ring-0 border-solid focus:outline-none ${
            error ? "border-destructive" : ""
          }`}
        />
      </div>
      {(error || helpText) && (
        <HelpText error={!!error}>{error ? error?.message : helpText}</HelpText>
      )}
    </div>
  );
};
