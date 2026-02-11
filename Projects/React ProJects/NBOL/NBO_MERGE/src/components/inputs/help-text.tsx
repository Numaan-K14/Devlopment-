import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import React from "react";

const helpTextVariants = cva("text-[12px] leading-[16px]", {
  variants: {
    variant: {
      default: "text-neutral-6",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Props = {
  children: React.ReactNode;
  error: boolean;
  dataRef?: string;
  className?: string;
};

export const HelpText = ({ error, dataRef, className, children }: Props) => {
  return (
    <span
      data-ref={`${dataRef}.help-text`}
      id={`${dataRef}.help-text`}
      className={cn(helpTextVariants({ variant: error ? "destructive" : "default" }), className)}
    >
      {children}
    </span>
  );
};
