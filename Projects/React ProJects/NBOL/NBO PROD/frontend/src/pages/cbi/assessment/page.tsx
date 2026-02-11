import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@/hooks/useQuerry";
import { useState } from "react";
import { IoArrowForwardOutline } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import PartDashboardCard from "./components/part-dashboard-card";
import ProceedDialoag from "./components/proceedDialoag";

const CBIAsessment = () => {
  const user_obj = localStorage.getItem("users_obj");
  const user = user_obj && JSON.parse(user_obj);
  const [openProceedDialoag, setOpenProceedDialoag] = useState(false);
  const navigate = useNavigate();

  const { data: QuestionerId, isPending } = useQuery<any>({
    queryKey: [
      `/cbi/participant-assessment/${user?.participant_id}/${user?.client_id}/${
        user?.["participants.cohort_id"]
      }`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: !!user?.participant_id,
  });

  const { data: compitencyData } = useQuery<any>({
    queryKey: [
      `/competency/participant-dashboard/${user?.participant_id}/${user?.client_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: !!user?.participant_id,
  });

  console.log(compitencyData, "<----------------- compitencyData");
  return (
    <div className=''>
      <AppBar
        // extraButtons={}
        showNav={false}
        subTitle='Assess your professional skills across key competencies'
        title='Welcome to the Competency Based Interview Portal'
      />
      <div className='flex flex-col mt-6 gap-10'>
        <div className='flex flex-col gap-2 justify-center items-center '>
          <div className='w-[64px] h-[64px] bg-[#2F6DD1] flex items-center justify-center rounded-full'>
            <RiComputerLine className='w-[32px] h-[32px] text-white' />
          </div>
          <div className='flex flex-col items-center '>
            <h2 className='text-[#2F6DD1] text-[36px] leading-[44px] font-bold mb-2'>
              Competency-Based Interview Portal
            </h2>
            <p className='text-[#181D27] text-[16px] leading-6'>
              Assess your professional skills across six key competencies with
              AI-powered questions and personalized feedback
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-4'>
          {compitencyData
            ? compitencyData?.map((item: any, index: number) => (
                <PartDashboardCard
                  subTitle={item?.description}
                  title={item?.competency}
                  number={index + 1}
                />
              ))
            : [1, 2, 3, 4, 5, 6]?.map((i: any) => (
                <div className='h-[150px] w-[480.67px] border p-5 rounded-[8px] flex flex-col gap-4 animate-pulse'>
                  <div className='flex gap-2'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <Skeleton className='w-[400px] h-10 rounded-[8px]' />
                  </div>
                  <Skeleton className='w-full h-[60px] rounded-[8px]' />
                </div>
              ))}

          {/* <PartDashboardCard
            subTitle='Professional skills assessment covering key workplace abilities and behavioral indicators. Lorem Ipsum Lorem Ipsum'
            title='Assessment Area'
            number={1}
          />
          <PartDashboardCard
            subTitle='Professional skills assessment covering key workplace abilities and behavioral indicators. Lorem Ipsum Lorem Ipsum'
            title='Assessment Area'
            number={1}
          />
          <PartDashboardCard
            subTitle='Professional skills assessment covering key workplace abilities and behavioral indicators. Lorem Ipsum Lorem Ipsum'
            title='Assessment Area'
            number={1}
          />
          <PartDashboardCard
            subTitle='Professional skills assessment covering key workplace abilities and behavioral indicators. Lorem Ipsum Lorem Ipsum'
            title='Assessment Area'
            number={1}
          />
          <PartDashboardCard
            subTitle='Professional skills assessment covering key workplace abilities and behavioral indicators. Lorem Ipsum Lorem Ipsum'
            title='Assessment Area'
            number={1}
          /> */}
        </div>
        <div className='flex items-center justify-center'>
          <CustomButton
            disabled={!QuestionerId?.partiAssessments?.quessionnaire_id}
            isPending={isPending}
            onClick={() =>
              // navigate(
              //   `/cbi/cbi-assessment/${QuestionerId?.quessionnaire_id}`,
              //   {
              //     state: {
              //       quessionnaire_id:
              //         QuestionerId?.partiAssessments?.quessionnaire_id,
              //       participant_id: user?.participant_id,
              //     },
              //   },
              // )
              setOpenProceedDialoag(true)
            }
          >
            Start Assessment <IoArrowForwardOutline className='size-5' />
          </CustomButton>

          {openProceedDialoag && (
            <ProceedDialoag
              handleClose={setOpenProceedDialoag}
              state={{
                quessionnaire_id:
                  QuestionerId?.partiAssessments?.quessionnaire_id,
                participant_id: user?.participant_id,
                session_time: QuestionerId?.each_section_timer,
                total_sections: QuestionerId?.sections,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CBIAsessment;
