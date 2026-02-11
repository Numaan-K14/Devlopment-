import { ButtonFooter, PageHeading } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@/hooks/useQuerry";
import { useState } from "react";
import { BiDonateHeart } from "react-icons/bi";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { GoClock, GoLightBulb } from "react-icons/go";
import { IoIosTrendingUp } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { PiTreeStructure } from "react-icons/pi";
import { SiCircle } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
import HoverCard from "./components/assessmentCard";
import ExpectedBehaviorsDialoag from "./components/expectedBehavioursDialoag";

const ParticipantDashboard = () => {
  const user_obj = localStorage.getItem("users_obj");
  const user = user_obj && JSON.parse(user_obj);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: compitencyData, isPending } = useQuery<any>({
    queryKey: [
      `/competency/participant-dashboard/${user?.participant_id}/${user?.client_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: !!user?.participant_id,
    // enabled: false,
  });

  if (location.pathname === "cbi/cbi-assessment") {
   console.log(compitencyData,"<---- compitencyData");
 }
  return (
    <>  
      <AppBar
        title='Dashboard'
        subTitle='Assessment overview and leadership insights.'
      />

      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-[36px] leading-[44px] text-[#0A0A0A] text-center'>
            Welcome {user?.name}
          </h1>
          <p className='text-[20px] leading-7 text-[#717182] '>
            Discover your leadership potential through our comprehensive
            assessment designed to evaluate key competencies and provide
            insights into your strengths and areas for development.
          </p>
        </div>
        <div>
          <PageHeading>Interactive Assessments </PageHeading>
          <div className='flex flex-wrap gap-3'>
            <HoverCard
              title='Think on Your Feet'
              className='bg-[rgba(239,246,255,0.8)] border border-[rgba(219,234,254,0.5)]'
              icon={<LuBrain className='size-9 text-[#155DFC]' />}
              hoverContent='Think on Your Feet'
            />
            <HoverCard
              title='Role Play'
              className='bg-[rgba(236,253,245,0.8)] border border-[rgba(208,250,229,0.5)]'
              icon={<LuBrain className='size-9 text-[#009966]' />}
              hoverContent='Role Play'
            />
            <HoverCard
              title='Business Case Study'
              className='bg-[rgba(250,245,255,0.8)] border border-[rgba(243,232,255,0.5)]'
              icon={<LuBrain className='size-9 text-[#9810FA]' />}
              hoverContent='Business Case Study'
            />
            <HoverCard
              title='Leadership Questionnaire'
              className='bg-[rgba(255,247,237,0.8)] border border-[rgba(255,237,212,0.5)]'
              icon={<LuBrain className='size-9 text-[#F54900]' />}
              hoverContent='Leadership Questionnaire'
            />
            <HoverCard
              title='Group Activity'
              className='bg-[rgba(236,254,255,0.8)] border border-[rgba(206,250,254,0.5)]'
              icon={<LuBrain className='size-9 text-[#0092B8]' />}
              hoverContent='Group Activity'
            />
          </div>
        </div>
        <div>
          <PageHeading>Leadership Competencies Assessed</PageHeading>
          <div className='flex flex-wrap gap-5'>
            {compitencyData && !isPending
              ? compitencyData?.map((item: any, index: number) => (
                  <Tooltip key={index}>
                    <TooltipTrigger>
                      <div
                        onClick={() => {
                          setOpen(true);
                          setSelectedIndex(index);
                        }}
                        className='w-[483px] flex gap-3 items-center rounded-[10px] h-[66px] bg-[#F8FAFC] border border-[#F1F5F9] py-[23px] px-[13px] text-lg text-[#0A0A0A] cursor-pointer'
                      >
                        {item?.competency?.includes("Strategic") ? (
                          <GoClock className='size-9 text-[#D08700]' />
                        ) : item?.competency?.includes("Innovation") ? (
                          <GoLightBulb className='size-9 text-[#9810FA]' />
                        ) : item?.competency?.includes("Collaborative") ? (
                          <PiTreeStructure className='size-9 text-[#0092B8] rotate-90' />
                        ) : item?.competency?.includes("Business Acumen") ? (
                          <IoIosTrendingUp className='size-9 text-[#009966]' />
                        ) : item?.competency?.includes(
                            "Inspirational Leadership",
                          ) ? (
                          <SiCircle className='size-9 text-[#F54900]' />
                        ) : item?.competency?.includes("Talent Development") ? (
                          <BiDonateHeart className='size-9 text-[#EC003F]' />
                        ) : (
                          <IoIosTrendingUp className='size-9 text-[#009966]' />
                        )}

                        {item?.competency}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                      <div className=' p-2 rounded-[4px] bg-white  border border-[#DAE0E6] text-[#5F6D7E] text-[14px] shadow-[rgba(16,24,40,0.04)] '>
                        {item?.competency}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))
              : // <Skeleton className=' h-[66px] w-[483px]' />
                [1, 2, 3, 4, 5, 6]?.map((item: any) => (
                  <div key={item} className='flex items-center space-x-4 w-[483px] h-[66px] '>
                    <Skeleton className='h-14 w-14 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-6 w-[400px] ' />
                      <Skeleton className='h-5 w-[380px]' />
                    </div>
                  </div>
                ))}
          </div>
        </div>
        <div className='mb-16'>
          <PageHeading>Guidelines</PageHeading>
          <div className='flex gap-5'>
            <div className='w-1/2 border border-[#E9EAEB] p-4 rounded-[8px]'>
              <div className='text-lg text-[#535862] flex gap-1 items-center'>
                <FaRegCheckCircle className='size-[18px] text-[#009966]' />
                Do's
              </div>
              <div>
                <ul className='list-disc px-14'>
                  <li> Use a laptop/desktop with good internet.</li>
                  <li>Sit in a quiet, well-lit room.</li>
                  <li>Keep your webcam and mic on (if required).</li>
                  <li>Read questions carefully before answering.</li>
                  <li>Submit the test before time ends.</li>
                  <li>
                    Contact support immediately if you face technical issues.
                  </li>
                </ul>
              </div>
            </div>
            <div className='w-1/2 border border-[#E9EAEB] p-4'>
              {" "}
              <div className='text-lg text-[#535862] flex gap-1 items-center'>
                <FaRegTimesCircle className='size-[18px] text-[#F54900]' />
                Dont's
              </div>
              <div>
                <ul className='list-disc px-14'>
                  <li>
                    Don’t use mobile phones, headphones, or notes (unless
                    allowed).
                  </li>
                  <li>Don’t switch tabs, browsers, or applications.</li>
                  <li>Don’t refresh or close the test window.</li>
                  <li>Don’t allow others in the room during the test.</li>
                  <li>Don’t try to copy, record, or share questions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {open && (
          <ExpectedBehaviorsDialoag
            handleClose={setOpen}
            data={compitencyData}
            selectedIndex={selectedIndex}
          />
        )}
        <ButtonFooter>
          <div className='flex justify-end'>
            <CustomButton onClick={() => navigate("/assessments")}>
              Start Now
            </CustomButton>
          </div>
        </ButtonFooter>
      </div>
    </>
  );
};

export default ParticipantDashboard;
