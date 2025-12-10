import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const PageHeading = ({
  className,
  children,
  variant = "primary",
}: {
  className?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) => {
  return (
    <div
      className={cn(
        " font-medium  relative h-[42px] mb-10  flex justify-start items-center",
        className,
        {
          "h-8 text-base text-[#3B7FE6]": variant === "primary",
          "h-8 text-[15px] text-black": variant === "secondary",
        },
      )}
    >
      <div
        className={cn("block w-[3px] !h-[24px] rounded-r-sm mr-2", {
          "bg-[#3B7FE6]": variant === "primary",
          "bg-[#3B7FE6] ": variant === "secondary",
        })}
      ></div>
      {children}
    </div>
  );
};
