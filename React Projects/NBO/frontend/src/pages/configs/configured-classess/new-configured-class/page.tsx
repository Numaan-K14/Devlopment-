import { ButtonFooter } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DatePickerWithRange } from "@/components/inputs";
import CustomSelect from "@/components/inputs/custom-select";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { axios } from "@/config/axios";
import { useQuery } from "@/hooks/useQuerry";
import { CompetiencyInterface } from "@/interfaces/competency";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DetailsDialoag from "../../new-class/components/details-dialoag";
import DeleteDraftDialoag from "../components/deleteDraaftDialoag";

const NewConfiguredClass = () => {
  const columns: ColumnDef<any>[] = [
    {
      header: "Assessment name",
      accessorKey: "assessmentName",
      cell({ row }) {
        return row?.original?.assessment_name;
      },
    },
    {
      header: "Action",
      accessorKey: "Action",
      cell({ row }) {
        return (
          <span
            className={`flex gap-1 items-center cursor-pointer text-[#006F6D] `}
            onClick={() => {
              setOpen(true);
              setRowData(row?.original);
            }}
          >
            <FaEye className={` text-[#006F6D]  size-[14px]`} />
            View
          </span>
        );
      },
    },
  ];

  const { state } = useLocation();
  const navigate = useNavigate();

  console.log(state, "<----------- statwe");
  //----------- API Calls ---------------//
  const { data: SingleClassData } = useQuery<any>({
    queryKey: [`/class/getsingle-schedule-draft/${state?.cohort_id}`],
    select: (data: any) => data?.data?.data,
    enabled: !!state?.cohort_id,
  });
  const { data: CompiteancyData } = useQuery<CompetiencyInterface[]>({
    queryKey: [
      `/competency/client-all-competencies/${SingleClassData?.client_id}`,
    ],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!SingleClassData,
  });

  const { mutate: launchClassMutate, isPending: launchClassPending } =
    useMutation({
      mutationFn: (data: any) =>
        axios.post(
          `/class/${SingleClassData?.client?.id}/${SingleClassData?.cohort?.id}`,
          data,
        ),
      onSuccess(data) {
        toast.success(data.data.message || "Successfully Launched Class!");
        navigate(-1);
      },
      onError: (resp: any) => {
        toast.error(resp?.response?.data?.message || "Something went wrong!");
      },
    });

  //--------------- state management --------------//
  const [open, setOpen] = useState<boolean>(false);
  const [openDeletDraftDialoag, setOpenDeletDraftDialoag] =
    useState<boolean>(false);
  const [rowData, setRowData] = useState<any>();
  const DatagridData = JSON.parse(localStorage.getItem("data") || "[]");

  console.log(SingleClassData, "<------ SingleClassData");

  //--------------------- launch logic ----------------//
  const handleLaunchLogic = (launchData: any) => {
    const formatedData = {
      facility_id: SingleClassData?.facility_id,
      start_date: SingleClassData?.start_date
        ? format(SingleClassData?.start_date, "yyyy-MM-dd")
        : null,
      end_date: SingleClassData?.end_date
        ? format(SingleClassData?.end_date, "yyyy-MM-dd")
        : null,
      project_id: SingleClassData?.project?.id,
      class_breaks: SingleClassData?.cohort?.class_breaks,
      normal_assess_duration: SingleClassData?.normal_assess_duration || 30,
      grp_act_assess_duration: SingleClassData?.grp_act_assess_duration || 30,
      cbi_assess_duration: SingleClassData?.cbi_assess_duration || 30,
      welcome_sess_duration: SingleClassData?.cbi_assess_duration || 15,

      cbi_assessment_id: SingleClassData?.cbi_assessment_id
        ? SingleClassData?.cbi_assessment_id
        : undefined,
      cbi_quessionnaire_id: SingleClassData?.cbi_quessionnaire_id
        ? SingleClassData?.cbi_quessionnaire_id
        : undefined,
      class_assessments: launchData?.schedule_data?.map(
        (singleParData: any) => {
          const {
            assessment_id,
            is_group_activity,
            is_quesionnaire,
            participantSchedules,
            groups,
          } = singleParData;

          return {
            assessment_id,
            scenerio_id: !is_quesionnaire
              ? singleParData?.groups?.length
                ? singleParData?.groups?.[0]?.participants?.[0]?.scenarioId
                : singleParData?.participantSchedules?.[0]?.scenarioId
              : null,
            quessionnaire_id: is_quesionnaire
              ? singleParData?.participantSchedules?.[0]?.questionnaireId
              : null,
            class_competencies:
              CompiteancyData?.map((compi: any) => ({
                competency_id: compi?.id,
              })) ?? [],

            participant_assessment: !is_group_activity
              ? participantSchedules.map((p: any) => ({
                  participant_id: p.participantId,
                  email: "",
                  room_id: p.roomId ? p.roomId : null,
                  class_assessors: p.assessorIds.map((id: string) => ({
                    assessor_id: id,
                  })),
                  start_time: p.startTime,
                  end_time: p.endTime,
                  break: null,
                }))
              : undefined,
            part_gr_act_room: is_group_activity
              ? groups?.map((group: any) => ({
                  room_id: group?.roomId,
                  assessor_id: group?.assessorId,
                  start_time: group?.startTime,
                  end_time: group?.endTime,
                  part_gr_act: group?.participants?.map((par: any) => ({
                    participant_id: par?.participantId,
                  })),
                }))
              : undefined,
          };
        },
      ),
    };

    // return console.log(formatedData, ",----------- formated data");
    launchClassMutate(formatedData);
  };
  return (
    <div>
      <AppBar title='Classes Management' subTitle='Edit and Launch Classes' />
      <div className='grid grid-cols-3 gap-4 mt-[16px] flex-wrap'>
        <CustomSelect
          required
          value={SingleClassData?.client}
          className='w-[494.33px] h-[48px]'
          label='Select Client'
          getOptionLabel={(item) => item?.client_name}
          getOptionValue={(item) => item?.id}
          options={[SingleClassData?.client]}
          disabled={true}
        />

        <CustomSelect
          required
          value={SingleClassData?.project}
          className='w-[494.33px] h-[48px]'
          label='Select Project'
          getOptionLabel={(item) => item?.project_name}
          getOptionValue={(item) => item?.id}
          options={[SingleClassData?.project]}
          disabled={true}
        />

        <CustomSelect
          required
          className='w-[494.33px] h-[48px]'
          label='Select Cohort'
          getOptionLabel={(item) => item?.cohort_name}
          getOptionValue={(item) => item?.id}
          options={[SingleClassData?.cohort]}
          value={SingleClassData?.cohort}
          disabled={true}
        />

        <CustomSelect
          required
          className='w-[494.33px] h-[48px]'
          label='Select Facility'
          disabled
          getOptionLabel={(item) => item?.facility_name}
          getOptionValue={(item) => item?.id}
          options={[SingleClassData?.facility]}
          value={SingleClassData?.facility}
        />

        <DatePickerWithRange
          fromDate={new Date()}
          required
          label='Class Start and end date'
          value={{
            from: SingleClassData?.start_date,
            to: SingleClassData?.end_date,
          }}
          disabled
          buttonClassName='!w-[494.33px]'
          // onChange={setDate}
          className=' h-[48px] '
        />
      </div>

      <div className='mb-20'>
        <Datagrid
          title='Scheduled Class'
          disableFilters
          disableSearch
          data={SingleClassData?.schedule_data}
          columns={columns}
        />
      </div>
      <ButtonFooter>
        <div className='flex gap-4 justify-end'>
          {/* <CustomButton variant='outline'>Clear</CustomButton> */}
          <CustomButton variant='outline' onClick={() => navigate(-1)}>
            back
          </CustomButton>
          <CustomButton
            variant='outline'
            // onClick={() => navigate("/generate-schedule")}
            onClick={() => setOpenDeletDraftDialoag(true)}
          >
            Reschedule
          </CustomButton>

          <CustomButton
            isPending={launchClassPending}
            disabled={launchClassPending}
            onClick={() => {
              handleLaunchLogic(SingleClassData);
            }}
          >
            Launch Class
          </CustomButton>
        </div>
      </ButtonFooter>
      {openDeletDraftDialoag && (
        <DeleteDraftDialoag
          handleClose={setOpenDeletDraftDialoag}
          id={state?.row_id}
        />
      )}
      {open && <DetailsDialoag data={rowData} setOpen={setOpen} />}
    </div>
  );
};

export default NewConfiguredClass;
