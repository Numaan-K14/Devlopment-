import { cn } from "@/lib/utils";
import { useState } from "react";

const HoverCard = ({
  className,
  icon,
  title,  
  hoverContent,
}: {
  className?: string;
  icon?: any;
  title?: string;
  hoverContent?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative w-[285px] h-[129px] rounded-[10px]  overflow-hidden transition-all duration-300 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col gap-1 items-center justify-center transition-opacity duration-300",
          { "opacity-0": hovered },
        )}
      >
        {icon}
        <p className='text-lg text-[#0A0A0A]34'>{title}</p>
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          { "opacity-100": hovered, "opacity-0": !hovered },
        )}
      >
        <p className='text-xl font-semibold'>{hoverContent}</p>
      </div>
    </div>
  );
};

export default HoverCard;
