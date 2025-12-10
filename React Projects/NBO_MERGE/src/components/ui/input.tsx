import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement & { label: string },
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <>
      <input
        type={type}
        className={cn(
          "flex !h-[44px] w-full   border-[#DAE0E6] border-[1px] !rounded-[8px] border-input  bg-white px-3 py-1 text-[13px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#A5ACBA] !placeholder:text-sm !placeholder:font-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    </>
  );
});
Input.displayName = "Input";

export { Input };
