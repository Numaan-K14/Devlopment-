import AppBar from "@/components/app-bar";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@/hooks/useQuerry";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiEye } from "react-icons/fi";
import { LuPen } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import DashboardCard from "./components/card";

const Dashboard = () => {
  const columns: ColumnDef<any>[] = [
    {
      header: "Name",
      accessorKey: "participant_name",
    },
    // {
    //   header: "Employee ID",
    //   accessorKey: "employee_ID",
    // },
    {
      header: "Email address",
      accessorKey: "email",
    },
    {
      header: "Status",
      accessorKey: "assessment_status",
      cell({ row }) {
        return (
          <span
            className={`py-[2px] px-2 border !rounded-full text-[12px] font-medium capitalize ${
              row?.original?.cbi_status === "completed"
                ? "bg-[#ECFDF3] text-[#027A48]"
                : row?.original?.cbi_status === "inprogress" ||
                    row?.original?.cbi_status === "pending"
                  ? "bg-[#F0F9FF] text-[#1849AA]"
                  : row?.original?.cbi_status === "paused"
                    ? "bg-[#FFFAEB] text-[#B54708]"
                    : ""
            }`}
          >
            {row?.original?.cbi_status || "-"}
          </span>
        );
      },
    },
    // {
    //   header: "Score",
    //   accessorKey: "score",
    //   cell({ row }) {
    //     return <p>{row?.original?.cbi_report?.overall_score || "-"}</p>;
    //   },
    // },
    {
      header: "Score",
      accessorKey: "score",
      cell({ row }) {
        const score = Number(row?.original?.cbi_report?.overall_score);

        if (!score) return <p>-</p>;

        const totalStars = 5;
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 !== 0;

        return (
          <div className='flex items-center gap-[2px]'>
            {Array.from({ length: fullStars }).map((_, i) => (
              <AiFillStar
                key={`full-${i}`}
                className='text-[#F4B000]'
                size={20}
              />
            ))}

            {hasHalfStar && (
              <span className='relative w-[20px] h-[20px] inline-block'>
                <AiOutlineStar
                  className='absolute top-0 left-0 text-[#D9D9D9]'
                  size={20}
                />
                <AiFillStar
                  className='absolute top-0 left-0 text-[#F4B000]'
                  size={20}
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                />
              </span>
            )}

            {Array.from({
              length: totalStars - fullStars - (hasHalfStar ? 1 : 0),
            }).map((_, i) => (
              <AiOutlineStar
                key={`empty-${i}`}
                className='text-[#D9D9D9]'
                size={20}
              />
            ))}
          </div>
        );
      },
    },
    {
      header: "Date of Completion",
      accessorKey: "date_of_completion",
      cell({ row }) {
        return (
          <p>
            {moment(row?.original?.cbi_report?.createdAt).format("DD/MM/YYYY")}
          </p>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell({ row }) {
        // console.log(row, "<---------- row");
        return row?.original?.cbi_status === "completed" ? (
          <>
            {row?.original?.cbi_status === "completed" &&
            row?.original?.cbi_score_submitted === "pending" ? (
              <Link
                to={`final-score`}
                state={row?.original?.id}
                className='flex items-center gap-1'
              >
                <LuPen className='text-[#12B76A] size-[18px]' />
                Edit Report
              </Link>
            ) : (
              row?.original?.cbi_status === "completed" &&
              row?.original?.cbi_score_submitted === "completed" && (
                <Link
                  to={`/cbi-report-ui/${row?.original?.id}?onlyView=true`}
                  state={row?.original?.id}
                  className='flex items-center gap-1'
                >
                  <FiEye />
                  View Report
                </Link>
              )
            )}
          </>
        ) : (
          <p className='flex items-center gap-1 text-[#D5D7DA]'>
            <FiEye />
            View Report
          </p>
        );
      },
    },

    // {
    //   header: "Action",
    //   accessorKey: "Action",
    //   meta: {
    //     disableFilters: true,
    //   },
    //   cell({ row }) {
    //     return (
    //       <div className='flex justify-start items-center gap-5'>
    //         <span
    //           className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
    //           onClick={() => {
    //             setOpen(true);
    //             setSelectedRow(row?.original?.id);
    //             setSelectedRowData(row?.original);
    //           }}
    //         >
    //           <BiEditAlt className='text-[#006F6D] size-[14px]' />
    //           Edit
    //         </span>
    //         <Separator
    //           orientation='vertical'
    //           className='!h-[15px] text-red-500'
    //         />

    //         <DeleteItem
    //           endPoint={`/assessors/${row?.original?.id}`}
    //           itemName={`${row?.original?.assessor_name}`}
    //           title='Delete Assessors'
    //           refetchUrl={["/assessors"]}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];

  const { data: ReportData } = useQuery<any>({
    queryKey: [`/cbi/dashboard`],
    select: (data: any) => data?.data?.data,
    enabled: true,
  });
  const [selectedClient, setSelectedClient] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const navigate = useNavigate();
  // console.log(ReportData, ",--------- datatatat");

  let datagridUrl = "/cbi/participant-data-filter";
  if (selectedClient?.id && selectedProject?.id && selectedCohort?.id) {
    datagridUrl = `/cbi/participant-data-filter?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`;
  } else if (selectedClient?.id && selectedProject?.id) {
    datagridUrl = `/cbi/participant-data-filter?client_id=${selectedClient.id}&project_id=${selectedProject.id}`;
  } else if (selectedClient?.id) {
    datagridUrl = `/cbi/participant-data-filter?client_id=${selectedClient.id}`;
  }
  return (
    <div className=''>
      <AppBar
        showNav={false}
        title='Dashboard'
        subTitle='Manage Participants, Report, Competencies, and Leadership Levels'
      />
      <div className='flex mt-6 gap-8'>
        {ReportData ? (
          <>
            <DashboardCard
              variant='FIRST'
              title='Total Participants'
              count={ReportData?.total_participants}
              percentage='100'
            />
            <DashboardCard
              variant='SECOND'
              title='Paused Interviews'
              count={ReportData?.report_paused_participants}
              percentage='100'
            />
            <DashboardCard
              variant='THIRD'
              title='Completed Interviews'
              count={ReportData?.report_completed_participants}
              percentage='100'
            />
            <DashboardCard
              variant='FORTH'
              title='Interviews in Progress'
              count={ReportData?.report_inprogress_participants}
              percentage='100'
            />
          </>
        ) : (
          [1, 2, 3, 4]?.map((item) => (
            <div className='h-[198px]  w-[348.5px] border p-4 flex flex-col gap-4 border-[#D5D7DA] rounded-[8px] animate-pulse'>
              <Skeleton className='h-[60px] w-[60px] rounded-[8px]' />
              <Skeleton className='h-[20px] rounded-[8px]' />
              <Skeleton className='h-[80px] rounded-[8px]' />
            </div>
          ))
        )}
      </div>
      <div className='flex flex-wrap gap-5  mt-6 mb-10'>
        <SelectCommonOptions
          key={selectedClient?.id}
          handleChange={setSelectedClient}
          required={true}
          handleDataChange={(client: ClientCreateInterface | null) => {
            setSelectedClient(client);
            localStorage.setItem("client", JSON.stringify(client));
            if (
              selectedClient &&
              selectedClient?.id !==
                JSON.parse(localStorage.getItem("client") ?? "")?.id
            ) {
              setSelectedProject(null);
              localStorage.removeItem("project");
              localStorage.removeItem("cohort");
            }
          }}
          localStorageName='client'
          url='/client/getall-clients'
        />

        {selectedClient && (
          <div>
            <SelectCommonOptions
              key={selectedProject?.id}
              handleDataChange={(project: ProjectConfigInterface | null) => {
                setSelectedProject(project);
                localStorage.setItem("project", JSON.stringify(project));
                if (
                  selectedProject &&
                  selectedProject?.id !==
                    JSON.parse(localStorage.getItem("project") ?? "")?.id
                ) {
                  setSelectedCohort(null);
                  localStorage.removeItem("cohort");
                }
              }}
              required={true}
              onOptionsLoaded={(projects) => setClientProjects(projects)}
              localStorageName='project'
              url={`/projects/client-projects/${selectedClient?.id}`}
            />
            {clientProjects.length === 0 && (
              <p
                className='text-[#528BFF] underline text-[13px] mt-2 cursor-pointer'
                onClick={() => navigate("/project-configuration")}
              >
                Add New
              </p>
            )}
          </div>
        )}
        {selectedClient && selectedProject && (
          <>
            <SelectCommonOptions
              key={selectedCohort?.id}
              handleDataChange={(cohort: CohortInterface | null) => {
                setSelectedCohort(cohort);
                localStorage.setItem("cohort", JSON.stringify(cohort));
              }}
              localStorageName='cohort'
              url={`/participant/get-project-cohorts/${selectedProject?.id}`}
            />
          </>
        )}
      </div>
      <Datagrid
        columns={columns}
        disableFilters
        title='Participants'
        disableSearch
        url={datagridUrl}
      />
    </div>
  );
};

export default Dashboard;
