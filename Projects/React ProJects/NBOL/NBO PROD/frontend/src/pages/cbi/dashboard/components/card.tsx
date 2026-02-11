import { FaArrowTrendUp } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";
import { RxLightningBolt } from "react-icons/rx";
import Trend from "react-trend";
import MyLineChart from "./line-chart";

const DashboardCard = ({
  variant,
  title,
  count,
  percentage,
}: {
  variant?: "FIRST" | "SECOND" | "THIRD" | "FORTH";
  title?: string;
  count?: string;
  percentage?: string;
}) => {
  return variant === "FIRST" ? (
    <div className='h-[198px] bg-[#FFFFFF] w-[348.5px] border border-[#E9EAEB] rounded-[8px] p-5 shadow-[rgba(10,13,18,0.05)]'>
      <div className='flex flex-col gap-5'>
        <div className='bg-[#DCFAE6] rounded-[8px] !w-[48px] !h-[48px] flex items-center justify-center'>
          <FaArrowTrendUp className='size-6 text-[#079455] font-medium' />
        </div>
        <div className='flex flex-col gap-2'>
          <p className='font-medium text-sm text-[#535862] leading-5'>
            {title}
          </p>
          <div className='flex justify-between  relative'>
            <p className='font-semibold text-3xl leading-[38px] text-[#181D27] '>
              {count}
            </p>
            <span className='h-[24px] border border-[#D5D7DA] bg-[#FFFFFF] shadow-[rgba(10,13,18,0.05)] rounded-[6px] gap-1 py-[2px] px-2 absolute bottom-0 right-0 flex items-center'>
              <LuArrowUpRight className='size-3 text-[#17B26A] font-medium' />{" "}
              <span className='text-[14px] font-medium leading-5 text-[#414651]'>
                {percentage}%
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : variant === "SECOND" ? (
    <div className='h-[198px] bg-[#FFFFFF] w-[348.5px] border border-[#E9EAEB] rounded-[8px] p-5 shadow-[rgba(10,13,18,0.05)]'>
      <div className='flex flex-col gap-2'>
        <p className='font-medium text-sm text-[#535862] leading-5'>{title}</p>
        <div className='flex justify-between  items-center'>
          <p className='font-semibold text-3xl leading-[38px] text-[#181D27] '>
            {count}
          </p>
          <span className='h-[24px]  bg-[#FFFFFF] shadow-[rgba(10,13,18,0.05)] rounded-[6px] gap-1 py-[2px] px-2  flex items-center'>
            <div className='flex gap-1 items-center text-[#17B26A] text-[14px] font-medium leading-5'>
              <FaArrowTrendUp className='size-3 text-[#17B26A] font-medium' />{" "}
              {percentage}%
            </div>
            <span className='text-[14px] font-medium leading-5 text-[#414651]'>
              vs last month
            </span>
          </span>
        </div>
        <div>
          <MyLineChart />
        </div>
      </div>
    </div>
  ) : variant === "THIRD" ? (
    <div className='h-[198px] bg-[#FFFFFF] w-[348.5px] border border-[#E9EAEB] rounded-[8px] p-5 shadow-[rgba(10,13,18,0.05)]'>
      <div className='flex flex-col gap-5'>
        <div className='flex items-center gap-3'>
          <div className='bg-[#D8E7FC] rounded-[8px] !w-[48px] !h-[48px] flex items-center justify-center'>
            <RxLightningBolt className='size-6 text-[#265BB8] font-medium' />
          </div>
          <p className=' text-base font-semibold text-[#181D27] leading-6'>
            {title}
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='font-medium text-sm text-[#535862] leading-5'>
            {title}
          </p>
          <div className='flex justify-between  relative'>
            <p className='font-semibold text-3xl leading-[38px] text-[#181D27] '>
              {count}
            </p>
            <span className='h-[24px] border border-[#D5D7DA] bg-[#FFFFFF] shadow-[rgba(10,13,18,0.05)] rounded-[6px] gap-1 py-[2px] px-2 absolute bottom-0 right-0 flex items-center'>
              <LuArrowUpRight className='size-3 text-[#17B26A] font-medium' />{" "}
              <span className='text-[14px] font-medium leading-5 text-[#414651]'>
                {percentage}%
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : variant === "FORTH" ? (
    <div className='h-[198px] bg-[#FFFFFF] w-[348.5px] border border-[#E9EAEB] rounded-[8px] p-5 shadow-[rgba(10,13,18,0.05)]'>
      <div className='flex flex-col gap-5'>
        {/* <div className='shadow-[rgba(10,13,18,0.05)] border border-[#D5D7DA] rounded-[8px] !w-[48px] !h-[48px] flex items-center justify-center'>
          <FaArrowTrendUp className='size-6 ' />
        </div> */}
        <p className='text-base font-semibold text-[#181D27] leading-6'>
          {title}
        </p>
        <div className='flex  gap-2'>
          <div className='flex flex-col   w-[65%]'>
            <p className='font-semibold text-3xl leading-[38px] text-[#181D27] '>
              {count}
            </p>
            <span className='h-[24px]  bg-[#FFFFFF] shadow-[rgba(10,13,18,0.05)] rounded-[6px] gap-1 py-[2px]   flex items-center'>
              <div className='flex gap-1 items-center text-[#17B26A] text-[14px] font-medium leading-5'>
                <FaArrowTrendUp className='size-3 text-[#17B26A]' />{" "}
                {percentage}%
              </div>
              <span className='text-[14px] font-medium leading-5 text-[#414651]'>
                vs last month
              </span>
            </span>
          </div>
          <div className='w-[35%]'>
            {/* <MyLineChart height={60} /> */}
            <Trend
              height={60}
              smooth
              autoDraw
              autoDrawDuration={3000}
              autoDrawEasing='ease-out'
              data={[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]}
              gradient={["#079455"]}
              radius={0}
              strokeWidth={4}
              strokeLinecap={"butt"}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default DashboardCard;
