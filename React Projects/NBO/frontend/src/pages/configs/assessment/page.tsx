import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import CopyDataDialoag from "@/components/copy-data-dialog";
import { DeleteItem } from "@/components/delete-item";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { useQuery } from "@/hooks/useQuerry";
import { AssessmentConfigColumsInterface } from "@/interfaces/assessments";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { LuPen } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import LinkScenarioDialog from "./components/LinkScenarioDialog";

const AssessmentConfigPage = () => {
  // ------------ colums ------------//
  const columns: ColumnDef<AssessmentConfigColumsInterface>[] = [
    {
      header: "Assessments",
      accessorKey: "assessment_name",
    },
    {
      header: "Scenario Added",
      accessorKey: "assessment_count",
      cell({ row }: { row: any }) {
        return <div>{row?.original?.assessment_count}</div>;
      },
    },
    {
      header: "Actions on Scenario",
      accessorKey: "actions_on_scenario",
      meta: {
        disableFilters: true,
      },
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            {row?.original?.status === false ? (
              <>
                <span
                  className='flex gap-1 items-center cursor-pointer text-[#4338CA]'
                  onClick={() => {
                    setOpen(true);
                    setSelectedAssesment(row?.original);
                    setScenarioData(row?.original?.scenerios ?? []);
                  }}
                >
                  <FiPlus className='text-[#4338CA] size-[14px]' />
                  {row?.original?.is_quesionnaire === true
                    ? "Add Questionnaire"
                    : " Add Scenario"}
                </span>
              </>
            ) : (
              <span
                className={`flex gap-1 items-center cursor-pointer  ${
                  row?.original?.status === true
                    ? "text-[#006F6D]"
                    : "text-[#A5ACBA]"
                }`}
                onClick={() => {
                  setOpen(row?.original?.status === true && true);
                  setSelectedAssesment(row?.original);
                  setFromEdit(true);
                  setScenarioData(row?.original?.scenerios ?? []);
                }}
              >
                {/* <BiEditAlt
                  className={` ${
                    row?.original?.status === true
                      ? "text-[#006F6D]"
                      : "text-[#A5ACBA]"
                  } size-[14px]`}
                /> */}
                <LuPen
                  className={` ${
                    row?.original?.status === true
                      ? "text-[#12B76A]"
                      : "text-[#A5ACBA]"
                  } size-[18px]`}
                />
              </span>
            )}
            {row?.original?.status === true ? (
              <>
                <DeleteItem
                  endPoint={`/assessment/delete-client-assessment/${selectedClient?.id}/${selectedCohort?.id}/${row?.original?.id}`}
                  itemName={`selected scenario for this assessment`}
                  title='Delete Assessment'
                  refetchUrl={[
                    `/assessment/client-assessments/${selectedCohort?.id}`,
                  ]}
                />
              </>
            ) : null}
          </div>
        );
      },
    },
  ];

  //-------- state management --------//
  const navigate = useNavigate();
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [fromEdit, setFromEdit] = useState(false);
  const [selectedAssesment, setSelectedAssesment] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [scenarioData, setScenarioData] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const [copyDataDialog, setCopyDataDialog] = useState<boolean>(false);

  //-------- handle functions ---------//
  const handleClose = () => {
    setOpen(false);
    setSelectedAssesment(null);
    setFromEdit(false);
  };

  //------------ api calls ------------//
  const { data: CohortData } = useQuery<CohortInterface[]>({
    queryKey: [`/participant/get-project-cohorts/${selectedProject?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedProject,
  });

  return (
    <div>
      {/* <PageHeading>Assessment</PageHeading> */}
      <AppBar
        title='Assessment Management'
        subTitle='Add, Edit and Manage Assessment'
      />
      <div className='flex flex-wrap gap-5  mt-[16px] mb-10'>
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
              required={true}
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
      <div className='p-2 text-[#4d5a72] border text-[14px]  bg-white border-[#D5D7DA] !rounded-[8px]'>
        A separate assessment will be configured for each selected scenario
        based on its respective assessment type.
      </div>
      <Datagrid
        title='Assessment'
        onRowDoubleClick={(row: any) => {
          if (row?.status === false) {
            console.log(row);
            setOpen(true);
            setSelectedAssesment(row);
            setScenarioData(row?.scenerios ?? []);
          } else if (row?.status === true) {
            setOpen(row?.status === true && true);
            setSelectedAssesment(row);
            setFromEdit(true);
            setScenarioData(row?.scenerios ?? []);
          }
        }}
        tableMetaDataKey='assessment-config'
        disableFilters={true}
        columns={columns}
        url={
          selectedClient && selectedProject && selectedCohort
            ? `/assessment/client-assessments/${selectedCohort?.id}`
            : ""
        }
        extraButtons={
          <>
            {/* <CustomButton
              variant='outline'
              onClick={() => setCopyDataDialog(true)}
              disabled={!selectedClient || !selectedCohort || !selectedProject}
            >
              Import Assessment Data Form Another Cohort
            </CustomButton> */}
            {selectedClient && (
              <Link to={"add-scenario"} state={{ ProjectId: selectedProject }}>
                <CustomButton variant='outline'>
                  Create New Scenario
                </CustomButton>
              </Link>
            )}
          </>
        }
      ></Datagrid>
      {open && (
        <LinkScenarioDialog
          handleClose={handleClose}
          cohortId={selectedCohort?.id}
          assesmentId={selectedAssesment?.id}
          row={selectedAssesment}
          clientId={selectedClient}
          isEdit={fromEdit}
          refetchQuire={`/assessment/client-assessments/${selectedCohort?.id}`}
          projectId={selectedProject}
        />
      )}

      {copyDataDialog && (
        <CopyDataDialoag
          CohortData={CohortData || []}
          defaultCohort={selectedCohort}
          handleClose={setCopyDataDialog}
          url='/assessment/copy-cohort-assessments'
          refetchUrl={
            selectedClient && selectedProject && selectedCohort
              ? `/assessment/client-assessments/${selectedCohort?.id}`
              : ""
          }
        />
      )}
    </div>
  );
};

export default AssessmentConfigPage;
