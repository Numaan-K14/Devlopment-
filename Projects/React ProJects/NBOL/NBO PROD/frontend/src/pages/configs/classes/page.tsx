import { PageHeading } from "@/components";
import { DeleteItem } from "@/components/delete-item";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { Separator } from "@/components/ui/separator";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

const ConfiguredClasses = () => {
  // ------------ colums ------------//
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
                data: row?.original,
                start_date: row?.original?.start_date,
                end_date: row?.original?.end_date,
                refetchUrl: datagridUrl,
              }}
            >
              <span className='flex gap-1 items-center cursor-pointer text-[#006F6D]'>
                <BiEditAlt className='text-[#006F6D] size-[14px]' />
                Edit
              </span>
            </Link>
            <Separator
              orientation='vertical'
              className='!h-[15px] text-red-500'
            />

            <DeleteItem
              endPoint={`/class/delete-draftclass/${row?.original?.id}`}
              itemName={`${row?.original?.cohort?.cohort_name}`}
              title='Delete Class'
              refetchUrl={[datagridUrl]}
            />
          </div>
        );
      },
    },
  ];
  //--------- state management --------//
  const navigate = useNavigate();
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();

  //--------------- data grid url ------------//
  let datagridUrl = "/class/get-all-draftclass";
  if (selectedClient?.id && selectedProject?.id && selectedCohort?.id) {
    datagridUrl = `/class/get-all-draftclass?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`;
  } else if (selectedClient?.id && selectedProject?.id) {
    datagridUrl = `/class/get-all-draftclass?client_id=${selectedClient.id}&project_id=${selectedProject.id}`;
  } else if (selectedClient?.id) {
    datagridUrl = `/class/get-all-draftclass?client_id=${selectedClient.id}`;
  }
  return (
    <div>
      <PageHeading>Classes</PageHeading>

      <div className='mt-8'>
        <div className='flex flex-wrap gap-5 mb-10'>
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
          tableMetaDataKey='configured-classes'
          disableFilters
          url={datagridUrl}
          columns={clientInfoColumns}
        />
      </div>
    </div>
  );
};

export default ConfiguredClasses;
