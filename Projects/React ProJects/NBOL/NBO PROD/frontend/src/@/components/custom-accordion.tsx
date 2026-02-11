"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import moment from "moment";
import { FaCalendarAlt } from "react-icons/fa";

const CustomAccordion = ({ data }: { data: any[] }) => {
  console.log(data, "<0-------------- data");

  return (
    <div className='relative'>
      <Accordion type='single' collapsible className=''>
        {data?.map((item, index) => (
          <AccordionItem
            key={index}
            value={item?.id}
            className='border-none relative mb-2'
          >
            <AccordionTrigger className='flex items-center gap-2 py-1 text-gray-700 hover:no-underline data-[state=closed]:border data-[state=closed]:!border-[#DAE0E6] data-[state=closed]:px-2 data-[state=closed]:py-2 data-[state=closed]:!rounded-[8px]'>
              <div className='flex items-center gap-3'>
                <div className=' bg-primary !rounded-full flex items-center justify-center p-1.5'>
                  <FaCalendarAlt size={12} className='text-white size-3 ' />
                </div>
                <span className='text-xs font-light text-[#5F6D7E]'>
                  {moment(item?.start_date).format("DD/MM/YYYY")}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className='absolute left-[10px] top-8 !w-[2px] rounded-sm  bottom-0 bg-primary' />
              <div className='ml-6 mt-2 border border-gray-200 !rounded-[12px] bg-gray-50 p-5 text-sm'>
                {/* {item?.description} */}
                <div className='flex flex-col gap-3'>
                  <div className='flex gap-2'>
                    <div className='w-1/2 flex flex-col gap-3'>
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs text-[#5F6D7E] '>Class Name</p>
                        <p className='text-xs text-primary '>
                          {item?.cohort?.cohort_name || "-"}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs text-[#5F6D7E] '>
                          Type of Engagement
                        </p>
                        <p className='text-xs text-primary '>{"-"}</p>
                      </div>
                    </div>
                    <div className='w-1/2 flex flex-col gap-3'>
                      {" "}
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs text-[#5F6D7E] '>Participant</p>
                        <p className='text-xs text-primary '>
                          {item?.cl_par_report
                            ?.map((i: any) => i?.participant?.participant_name)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <div className='w-1/2 flex flex-col gap-3'>
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs text-[#5F6D7E] '>
                          Reports Pending
                        </p>
                        <p className='text-xs text-primary '>
                          {" "}
                          {item?.report_pending_count || "-"}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs text-[#5F6D7E] '>
                          Feedback Sessions Pending
                        </p>
                        <p className='text-xs text-primary '>0</p>
                      </div>
                    </div>
                    <div className='w-1/2 flex flex-col gap-3'>
                      {" "}
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs text-[#5F6D7E] '>
                          Reports Completed
                        </p>
                        <p className='text-xs text-primary '>
                          {item?.report_completed_count || "-"}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs text-[#5F6D7E] '>
                          Feedback Sessions Completed
                        </p>
                        <p className='text-xs text-primary '>{"-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CustomAccordion;
