import React from "react";
import { useFormContext } from "react-hook-form";
import { HelpText } from "./help-text";
import { cn } from "@/lib/utils";

type Props = {
  children: (value: any) => React.ReactNode;
  className?: string;
  containerClass?: string;
  name: string;
  helpText?: string;
  label?: string;
  dataRef?: string;
  required?: boolean;
};

export const DashedInputWrapper = ({ name, label, helpText, className, containerClass, required, dataRef, children }: Props) => {
  const { getValues, getFieldState } = useFormContext(); // Access the react-hook-form context

  const { error } = getFieldState(name);

  return (
    <div className={containerClass}>
      <div
        className={cn(
          "border border-gray-300 p-8 grid grid-cols-1 gap-6 relative border-dashed rounded-xl",
          {
            "border-destructive !bg-red-50": !!error,
          },
          className
        )}
      >
        {label && (
          <label
            data-ref={`${dataRef}.label`}
            htmlFor={"body_type"}
            className="absolute start-3 top-0 z-10 block -translate-y-1/2 bg-inherit px-1 text-sm leading-5 font-normal text-helper"
          >
            <div className="absolute top-0 left-0 h-1/2 w-full bg-background z-[-1]"></div>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {children(getValues()[name])}
      </div>
      {(error || helpText) && (
        <HelpText dataRef={`${dataRef}.label`} error={!!error}>
          {error ? error?.message : helpText}
        </HelpText>
      )}
    </div>
  );
};
