

import DOMPurify from "dompurify";
import { Add, Box, Minus } from "iconsax-react";
import React from "react";
import { type FieldError, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { HelpText } from "./help-text";
import { useGetDataRef } from "@/hooks/useGetDataRef";
import { Button } from "../ui/button";
import { getValueByKey } from "@/lib/getValueBykey";

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  dataRef?: string;
  helpText?: string;
  inputClassName?: string;
  isPackageField?: boolean;
}

export const InputField: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
  className,
  dataRef,
  helpText,
  inputClassName,
  isPackageField,
}) => {
  const {
    register,
    formState: { errors, disabled: formDisabled },
    watch,
    setValue,
  } = useFormContext(); // Access the react-hook-form context

  const error = getValueByKey(errors, name) as FieldError | undefined;
  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.input-field",
  );
  return (
    <div
      className={` group relative  ${className}`}
      data-ref={`${componentDataRef}.container`}
    >
      {label && (
        <label
          data-ref={`${componentDataRef}.label`}
          htmlFor={name}
          className='block mb-1.5 bg-background px-1 text-sm leading-5 font-normal text-helper'
        >
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      )}
      <div
        className={cn("focus-within:p-[1px] rounded-sm relative ", {
          "bg-tertiary-gradient": !error,
        })}
      >
        <Input
          autoComplete='false'
          id={name}
          type={type}
          placeholder={placeholder}
          data-ref={`${componentDataRef}.input`}
          disabled={disabled || formDisabled}
          defaultValue={watch(name)}
          {...register(name, {
            required,
            valueAsNumber: type === "string",
            onChange: (e) => {
              if (type === "text") {
                const cleanValue = DOMPurify.sanitize(e.target.value, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
                });
                e.target.value = cleanValue;
              }
            },
          })}
          className={`border !text-md font-medium !h-[40px] block !w-full text-text-primary !bg-background placeholder:text-gray-300 rounded-sm px-4 py-[0.75rem] focus-visible:ring-0 border-solid focus:outline-none ${
            error ? "border-destructive" : ""
          } ${isPackageField ? "pl-7 quantity-field" : ""} ${inputClassName}`}
        />
        {isPackageField && (
          <>
            <Box
              className='absolute left-2  h-4 w-4 top-1/2 -translate-y-1/2 z-[2]'
              color='var(--color-gray-6)'
            />
            <div className='flex items-center gap-1 absolute right-2 top-1/2 -translate-y-1/2 '>
              <Button
                onClick={() => setValue(name, `${parseFloat(watch(name)) - 1}`)}
                size={"icon"}
                variant={"ghost"}
                className='h-fit w-fit [&_svg]:!size-6'
                disabled={disabled || formDisabled}
              >
                <Minus color='var(--color-text-primary)' />
              </Button>
              <div className='w-[1px] h-5 bg-gray-200  md:block hidden'></div>
              <Button
                onClick={() => setValue(name, `${parseFloat(watch(name)) + 1}`)}
                size={"icon"}
                variant={"ghost"}
                className='h-fit w-fit [&_svg]:!size-6'
                disabled={disabled || formDisabled}
              >
                <Add color='red' />
              </Button>
            </div>
          </>
        )}
      </div>
      {(error || helpText) && (
        <HelpText dataRef={`${componentDataRef}`} error={!!error}>
          {error ? error?.message : helpText}
        </HelpText>
      )}
    </div>
  );
};
