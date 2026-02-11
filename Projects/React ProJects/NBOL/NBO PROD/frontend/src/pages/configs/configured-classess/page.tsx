import AppBar from "@/components/app-bar";
import { DeleteItem } from "@/components/delete-item";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { LuPen } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

const ConfiguredClasses = () => {
  const clientInfoColumns: ColumnDef<any>[] = [
    {
      header: "Client Name",
      accessorKey: "client_name",
      cell({ row }: { row: any }) {
        return row?.original?.client?.client_name;
      },
    },
    {
      header: "Project Name",
      accessorKey: "project_name",
      cell({ row }: { row: any }) {
        return row?.original?.project?.project_name;
      },
    },
    {
      header: "Class Name",
      accessorKey: "class_name",
      cell({ row }: { row: any }) {
        return row?.original?.cohort?.cohort_name;
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <Link
              to={`class/${row?.original?.id}`}
              state={{
                cohort_id: selectedCohort?.id,
                row_id: row?.original?.id,
              }}
            >
              <span className='flex gap-1 items-center cursor-pointer text-[#006F6D]'>
                <LuPen className='text-[#12B76A] size-[18px]' />
              </span>
            </Link>
            {/* <Separator
              orientation='vertical'
              className='!h-[15px] text-red-500'
            /> */}

            <DeleteItem
              endPoint={`/class/delete-draftclass/${row?.original?.id}?delete_business_case=true`}
              itemName={`${row?.original?.cohort?.cohort_name}`}
              title='Delete Class'
              refetchUrl={[
                `/class/get-all-schedule-draft?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`,
              ]}
            />
          </div>
        );
      },
    },
  ];
  const navigate = useNavigate();
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();

  return (
    <div>
      {/* <PageHeading>Classes</PageHeading> */}
      <AppBar title='Classes Management' subTitle='Edit and Launch Classes' />
      <div className='mt-[16px]'>
        <div className='flex flex-wrap gap-5 mb-10'>
          <SelectCommonOptions
            handleChange={setSelectedClient}
            required={true}
            key={selectedClient?.id}
            handleDataChange={(client: ClientCreateInterface | null) => {
              setSelectedClient(client);
              setSelectedProject(null);
              localStorage.setItem("client", JSON.stringify(client));
              localStorage.removeItem("project");
              localStorage.removeItem("cohort");
            }}
            localStorageName='client'
            url='/client/getall-clients'
          />

          {selectedClient && (
            <div>
              <SelectCommonOptions
                required
                key={selectedProject?.id}
                handleDataChange={(project: ProjectConfigInterface | null) => {
                  setSelectedProject(project);
                  setSelectedCohort(null);
                  localStorage.setItem("project", JSON.stringify(project));
                  localStorage.removeItem("cohort");
                }}
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
          title='Configured Classes'
          tableMetaDataKey='configured-classes'
          disableFilters
          url={
            selectedClient && selectedProject && selectedCohort
              ? `/class/get-all-schedule-draft?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`
              : ""
          }
          columns={clientInfoColumns}
        />
      </div>
    </div>
  );
};

export default ConfiguredClasses;
