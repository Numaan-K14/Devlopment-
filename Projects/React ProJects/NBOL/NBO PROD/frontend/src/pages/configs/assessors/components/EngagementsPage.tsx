import { Autocomplete, DatePickerWithRange } from "@/components/inputs";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { useQuery } from "@/hooks/useQuerry";
import { AssessorsInterface } from "@/interfaces/assessors";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import AssessorsTimelineDialoag from "./AssessorsTimeline";

const EngagementsPage = () => {
  // ------------ colums ------------//
  const columns: ColumnDef<any>[] = [
    {
      header: "Client Name",
      accessorKey: "client_name",
    },
    {
      header: "Reports Prepared",
      accessorKey: "report_completed_count",
    },
    // {
    //   header: "Feedback Sessions",
    //   accessorKey: "feedback_sessions ",
    // },
    // {
    //   header: "Engagement Type",
    //   accessorKey: "engagement_type",
    // },
    {
      header: "Action",
      accessorKey: "Action",
      meta: {
        disableFilters: true,
      },
      cell({ row }) {
        console.log(row);
        return (
          <div className='flex justify-start items-center gap-5'>
            <span
              className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
              onClick={() => {
                setSelectedAssessorTimeline(true);
                setSelectedClient(row?.original?.id);
              }}
            >
              <LuEye className='text-[#006F6D] size-[14px]' />
              View Details
            </span>
          </div>
        );
      },
    },
  ];

  //--------- state management --------//
  const [selectedAssessor, setSelectedAssessor] = useState<any>();
  const [selectedClient, setSelectedClient] = useState<any>();
  const [selectedAssessorTimeline, setSelectedAssessorTimeline] =
    useState<any>();
  const [date, setDate] = useState<any>();

  const { data: AssessorsData } = useQuery<AssessorsInterface[]>({
    queryKey: [`/assessors`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  const { data: AssessorTimelineData } = useQuery<any[]>({
    queryKey: [
      `/assessors/assessor-client-classes/${selectedClient}/${selectedAssessor?.id}?start_date=${moment(date?.from).format("YYYY-MM-DD")}&end_date=${moment(date?.to).format("YYYY-MM-DD")}`,
    ],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient && !!selectedAssessor && !!date,
  });

  // console.log(AssessorsData, ",---------- AssessorsData");
  // console.log(AssessorTimelineData, ",---------- AssessorTimelineData");

  return (
    <div>
      <div className='flex gap-5 mt-10'>
        {/* <CustomSelect
          options={AssessorsData || []}
          getOptionLabel={(item: any) => item?.assessor_name}
          getOptionValue={(item: any) => item?.id}
          onChange={(item) => setSelectedAssessor(item?.id)}
        /> */}
        <Autocomplete
          withPortal={false}
          required
          className='w-[494px] h-[48px]'
          label='Select Assessor'
          getOptionLabel={(item: AssessorsInterface) => item?.assessor_name}
          getOptionValue={(item: AssessorsInterface) => item?.id}
          options={AssessorsData || []}
          onChange={(item) => setSelectedAssessor(item)}
        />
        <DatePickerWithRange
          label='Select Date Range'
          value={date}
          buttonClassName='!w-[494px]'
          className='w-[494px] h-[48px]'
          onChange={(range: any) => {
            setDate(range);
          }}
        />
      </div>
      <Datagrid
        title='Engagements'
        onRowDoubleClick={(row: any) => {}}
        disableFilters={true}
        tableMetaDataKey='assessors-engagements'
        columns={columns}
        url={
          selectedAssessor && date?.from && date?.to
            ? `/assessors/assessor-clients/${selectedAssessor?.id}?start_date=${moment(date?.from).format("YYYY-MM-DD")}&end_date=${moment(date?.to).format("YYYY-MM-DD")}`
            : ""
        }
      ></Datagrid>
      {selectedAssessorTimeline && (
        <AssessorsTimelineDialoag
          handleClose={setSelectedAssessorTimeline}
          AssessorTimelineData={AssessorTimelineData}
          date={date}
        />
      )}
    </div>
  );
};

export default EngagementsPage;
