import { ReactNode } from "react";

export const ButtonFooter = ({ children }: { children: ReactNode }) => {
  return (
    <div className='py-4 bg-[#f3f3f5]  w-[calc(100vw_-_319px)] left-[319px] border-t  bottom-0 fixed px-8 z-[2] '>
      {children}
    </div>
  );
};
