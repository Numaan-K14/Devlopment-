import AppBar from "@/components/app-bar";
import CustomTab from "@/components/custom-tab";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { useQuery } from "@/hooks/useQuerry";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { LuEye, LuPen } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

const ReportsPage = () => {
  //---------- colums -----------//
  const scorecardColumns: ColumnDef<any>[] = [
    {
      header: "Client Name",
      accessorKey: "client_name",
      cell({ row }) {
        return row?.original?.client?.client_name;
      },
    },
    {
      header: "Participant Name",
      accessorKey: "participant_name",
    },

    // {
    //   header: "Final Score",
    //   accessorKey: "final_score",
    //   cell({ row }) {
    //     return row?.original?.client?.final_score || "-";
    //   },
    // },
    {
      header: "Actions",
      accessorKey: "actions",
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            {row?.original?.admin_score === "pending" && (
              <Link
                to={`/reports/scorecard/${row?.original?.id}`}
                state={{
                  Participant_name: row?.original?.participant_name,
                  participant_id: row?.original?.id,
                  client_id: selectedClient?.id,
                  cohort_id: selectedCohort?.id,
                  status: row?.original?.admin_score,
                  class_id: row?.original?.cohorts?.class?.[0]?.id,
                }}
              >
                <span
                  className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
                  onClick={() => {}}
                >
                  <BiEditAlt className='text-[#006F6D] size-[14px]' />
                  Give final score
                </span>
              </Link>
            )}
            {row?.original?.admin_score === "inprogress" && (
              <Link
                to={`/reports/scorecard/${row?.original?.id}`}
                state={{
                  Participant_name: row?.original?.participant_name,
                  participant_id: row?.original?.id,
                  client_id: selectedClient?.id,
                  cohort_id: selectedCohort?.id,
                  status: row?.original?.admin_score,
                  class_id: row?.original?.cohorts?.class?.[0]?.id,
                }}
              >
                <span
                  className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
                  onClick={() => {}}
                >
                  <LuPen className='text-[#12B76A] size-5' />
                </span>
              </Link>
            )}
            {row?.original?.admin_score === "completed" && (
              <>
                {/* <Separator
                  orientation='vertical'
                  className='!h-[15px] text-red-500'
                /> */}
                <Link
                  to={`/reports/scorecard/${row?.original?.id}`}
                  state={{
                    Participant_name: row?.original?.participant_name,
                    participant_id: row?.original?.id,
                    client_id: selectedClient?.id,
                    cohort_id: selectedCohort?.id,
                    status: row?.original?.admin_score,
                    class_id: row?.original?.cohorts?.class?.[0]?.id,
                  }}
                >
                  <span className='flex gap-1 items-center cursor-pointer text-[#006F6D]'>
                    <LuEye className='size-[18px]' />
                    View
                  </span>
                </Link>
              </>
            )}
          </div>
        );
      },
    },
  ];
  const assesserColumns: ColumnDef<any>[] = [
    {
      header: "Client Name",
      accessorKey: "client_name",
      cell({ row }) {
        return row?.original?.cohort?.project?.client?.client_name;
      },
    },
    {
      header: "Class Name",
      accessorKey: "class_name",
      cell({ row }) {
        return row?.original?.cohort?.cohort_name;
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell({ row }) {
        return (
          <Link
            to={"/reports/single-class-report"}
            state={{ classId: row?.original?.id }}
          >
            <span className='flex gap-1 items-center cursor-pointer text-[#006F6D]'>
              <LuEye />
              view
            </span>
          </Link>
        );
      },
    },
  ];

  //------------- state management ---------------//
  const navigate = useNavigate();
  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;
  const [tabValue, setTabValue] = useState<any>("0");
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const [selectedClient, setSelectedClient] = useState<any>();

  //---------------- API CALLS ---------------//
  const { data: Data } = useQuery<any>({
    queryKey: [`/report/all-class-reports?clientId=${selectedClient?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient?.id,
  });
  return (
    <div>
      {/* <PageHeading>Report</PageHeading> */}
      <AppBar
        title='Report'
        subTitle={` ${user?.role === "admin" || user?.role === "assessor" ? "Edit and Manage Participants Reports" : "View Your Reports"}`}
      />
      {user?.role === "admin" && (
        <div>
          <CustomTab
            setValue={setTabValue}
            tabs={[
              { label: "Scorecard", value: 0 },
              { label: "Report", value: 1 },
            ]}
            value={tabValue}
            className='flex items-center justify-center'
          />
          {tabValue == 0 && (
            <>
              <div className='flex flex-wrap gap-5 mt-10 mb-10'>
                <SelectCommonOptions
                  handleChange={setSelectedClient}
                  required={true}
                  key={selectedClient?.id}
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
                      required
                      key={selectedProject?.id}
                      handleDataChange={(
                        project: ProjectConfigInterface | null,
                      ) => {
                        setSelectedProject(project);
                        localStorage.setItem(
                          "project",
                          JSON.stringify(project),
                        );
                        if (
                          selectedProject &&
                          selectedProject?.id !==
                            JSON.parse(localStorage.getItem("project") ?? "")
                              ?.id
                        ) {
                          setSelectedCohort(null);
                          localStorage.removeItem("cohort");
                        }
                      }}
                      onOptionsLoaded={(projects) =>
                        setClientProjects(projects)
                      }
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
                      required
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
                title='Scorecard'
                onRowDoubleClick={(row: any) => {
                  if (row?.admin_score === "pending") {
                    navigate(`/reports/scorecard/${row?.id}`, {
                      state: {
                        Participant_name: row?.participant_name,
                        participant_id: row?.id,
                        client_id: selectedClient?.id,
                        cohort_id: selectedCohort?.id,
                        status: row?.admin_score,
                        class_id: row?.cohorts?.class?.[0]?.id,
                      },
                    });
                  } else if (row?.admin_score === "inprogress") {
                    navigate(`/reports/scorecard/${row?.id}`, {
                      state: {
                        Participant_name: row?.participant_name,
                        participant_id: row?.id,
                        client_id: selectedClient?.id,
                        cohort_id: selectedCohort?.id,
                        status: row?.admin_score,
                        class_id: row?.cohorts?.class?.[0]?.id,
                      },
                    });
                  } else if (row?.admin_score === "completed") {
                    navigate(`/reports/scorecard/${row?.id}`, {
                      state: {
                        Participant_name: row?.participant_name,
                        participant_id: row?.id,
                        client_id: selectedClient?.id,
                        cohort_id: selectedCohort?.id,
                        status: row?.admin_score,
                        class_id: row?.cohorts?.class?.[0]?.id,
                      },
                    });
                  }
                }}
                url={
                  selectedClient && selectedCohort && selectedProject
                    ? `/report/participant-scorecard?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`
                    : ""
                }
                disableFilters={true}
                tableMetaDataKey='scorcard-table'
                columns={scorecardColumns}
              />
            </>
          )}
          {tabValue == 1 && (
            <>
              <SelectCommonOptions
                handleChange={setSelectedClient}
                required={true}
                handleDataChange={(client: any | null) => {
                  setSelectedClient(client);
                  localStorage.setItem("client", JSON.stringify(client));
                }}
                localStorageName='client'
                url='/client/getall-clients'
              />
              <Datagrid
                title='Report'
                onRowDoubleClick={(row: any) =>
                  navigate("/reports/single-class-report", {
                    state: { classId: row?.id },
                  })
                }
                data={Data?.[0]?.classes || []}
                disableFilters={true}
                tableMetaDataKey='report-table'
                columns={assesserColumns}
              />
            </>
          )}
        </div>
      )}
      {user?.role === "assessor" && (
        <>
          <SelectCommonOptions
            handleChange={setSelectedClient}
            required={true}
            handleDataChange={(client: any | null) => {
              setSelectedClient(client);
              localStorage.setItem("client", JSON.stringify(client));
            }}
            localStorageName='client'
            url='/client/getall-clients'
          />
          <Datagrid
            title='Report'
            onRowDoubleClick={(row: any) => {
              navigate("/reports/single-class-report", {
                state: { classId: row?.id },
              });
            }}
            data={Data?.[0]?.classes || []}
            disableFilters={true}
            tableMetaDataKey='report-table'
            columns={assesserColumns}
          />
        </>
      )}
    </div>
  );
};

export default ReportsPage;
