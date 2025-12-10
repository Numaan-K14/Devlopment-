import { FaInfoCircle } from "react-icons/fa";

const CustomCalendarEvent = ({ event }: { event: any }) => {
  const user = JSON.parse(localStorage.getItem("users_obj") || "{}");
  return user?.role === "admin" || user?.role === "assessor" ? (
    <div className='bg-[#EFF4FF] border-l-4 border border-blue-500 px-2 py-1 rounded-[3px]   text-xs text-blue-700 flex items-center justify-between gap-2'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
        <span className='flex'>
          <p>Project Name: </p> {event?.project_name}
        </span>
        <span className='flex'>
          <p>Client: </p> {event?.client_name}
        </span>
      </div>
      <FaInfoCircle className='text-blue-500 text-sm' />
    </div>
  ) : (
    <div className='bg-[#FFFBD6] border-l-4 border border-[#FCA312] px-2 py-1 rounded-[3px]   text-xs text-[#5F6D7E] flex items-center justify-between gap-2'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
        <span className='flex'>
          <p>Class: </p> {event?.client_name}
        </span>
        {/* <span className='flex'>
          <p>Room No: </p> {event?.room}
        </span> */}
      </div>
      <FaInfoCircle className='text-[#FCA312] text-sm' />
    </div>
  );
};

export default CustomCalendarEvent;
