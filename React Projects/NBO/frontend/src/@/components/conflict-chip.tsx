import { GoDotFill } from "react-icons/go";

const ConflictChip = ({ title }: { title: string }) => {
  return (
    <div
      className={` !h-[28px] !flex text-[14px] items-center rounded-[5px] !py-[2px] !px-[8px] ${title.startsWith("Conflict") ? "bg-[#FEF6F6] text-[#E2341D] !w-[76px]" : title.startsWith("Client") ? "bg-[#ccf4e063] text-[#00bb6d] !w-[73px] justify-center" : title.startsWith("NBOL") ? "bg-[#CCE3F463] text-[#0071BB] !w-[73px] justify-center" : " bg-[#CCE3F463] text-[#0071BB] !w-[103px]"} `}
    >
      {(title.startsWith("Conflict") ||
        title.startsWith("No Conflict")) && <GoDotFill className='!size-3' />}
      {title}
    </div>
  );
};

export default ConflictChip;
