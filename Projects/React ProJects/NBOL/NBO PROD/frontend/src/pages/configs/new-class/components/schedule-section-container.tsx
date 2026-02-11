import { cn } from "@/lib/utils";
import React from "react";

const ScheduleSectionContainer = ({
  title,
  children,
  className,
  extraButton,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  extraButton?: any;
}) => {
  return (
    <div
      className={cn(
        "w-full border border-[#E5E7EB] !rounded-[10px] h-auto bg-white",
        className,
      )}
    >
      <div className='py-4 px-6 border-b border-[#E5E7EB] text-lg font-medium text-[#101828] flex justify-between'>
        <p>{title}</p>
        {extraButton ? extraButton : null}
      </div>
      <div className='!min-h-fit px-6 pb-7 pt-4'>{children}</div>
    </div>
  );
};

export default ScheduleSectionContainer;
