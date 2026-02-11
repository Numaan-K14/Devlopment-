import { useGetDataRef } from "@/hooks/useGetDataRef";

import React from "react";
import { type FieldError, useFormContext } from "react-hook-form";

import { HelpText } from "./help-text";
import { Switch } from "../ui/switch";

interface SwitchInputProps {
  name: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  dataRef?: string;
  helpText?: string;
  size?: "sm" | "lg";
  direction?: "horizontal" | "vertical";
  isFieldDisabled?: boolean;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  name,
  label,
  required = false,
  className,
  dataRef,
  helpText,
  size = "sm",
  direction = "horizontal",
  isFieldDisabled = false,
}) => {
  const {
    register,
    formState: { errors, disabled: disabledFields },
    setValue,
    watch,
  } = useFormContext(); // Access the react-hook-form context

  const getValueByKey = (obj: any, key: string): any => {
    return key.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  const error = getValueByKey(errors, name) as FieldError | undefined;
  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.switch-field"
  );

  const { disabled } = register(name, {
    disabled: disabledFields
      ? Object.keys(disabledFields)?.includes(name)
      : false,
  });

  return (
    <>
      <div
        className={`flex items-center gap-3 ${
          direction === "vertical" &&
          "flex-col-reverse items-start justify-between"
        } ${className}`}
        data-ref={`${componentDataRef}.container`}
      >
        <Switch
          autoFocus={false}
          id={name}
          data-ref={`${componentDataRef}.switch`}
          disabled={disabled || isFieldDisabled}
          defaultChecked={watch(name)}
          checked={watch(name)}
          onCheckedChange={(value) => {
            setValue(name, value);
          }}
          size={size}
          className="cursor-pointer"
        />
        {label && (
          <label
            data-ref={`${componentDataRef}.label`}
            htmlFor={name}
            className=" block bg-background px-1 text-sm leading-5 font-normal text-helper"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
      </div>
      {(error || helpText) && (
        <HelpText error={!!error}>{error ? error?.message : helpText}</HelpText>
      )}
    </>
  );
};
