import { Loader2 } from "lucide-react";

export const CustomLoader = ({ message }: { message?: string }) => {
  return (
    <div className='w-full h-[150px] !my-10  flex justify-center items-center'>
      <div className='flex flex-col gap-3 items-center'>
        <Loader2 className='animate-spin  w-[70px]  text-[#A5ACBA] h-[70px] ' />{" "}
        <div className='text-[#A5ACBA]'>
          {message ? message : "Fetching Data Please Wait!"}
        </div>
      </div>
    </div>
  );
};
