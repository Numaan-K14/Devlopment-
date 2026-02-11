import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import CustomSelect from "@/components/inputs/custom-select";
import { default as SelectCommonOptions } from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import UploadListDialoag from "@/components/uploadList-dialoag";
import { axios } from "@/config/axios";
import { useQuery } from "@/hooks/useQuerry";
import {
  ClientCreateInterface,
  ClientInfoInterface,
  ProjectConfigInterface,
  ProjectInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { ParticipantsInterface } from "@/interfaces/participants";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { LuPen } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import CohortDialoag from "./component/AddCohort";
import DeleteCohortDialoag from "./component/DeleteCohort";

const ParticipantsPage = () => {
  // ------------ colums ------------//
  const columns: ColumnDef<ParticipantsInterface>[] = [
    {
      header: "Name",
      accessorKey: "participant_name",
    },
    {
      header: "Email ID",
      accessorKey: "email",
    },
    {
      header: "Date of Joining",
      accessorKey: "date_of_joining",
      cell({ row }: { row: any }) {
        return moment(row.original?.date_of_joining).format("DD/MM/YYYY");
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      enableSorting: false,
      meta: {
        disableFilters: true,
      },
      cell({ row }) {
        const rowData = row?.original;
        return (
          <div className='flex justify-start items-center gap-5'>
            <Link
              to={{ pathname: "participantsForm" }}
              state={{
                rowData,
                ClientData,
                ProjectCohortData,
                ProjectData,
              }}
            >
              <span className='flex gap-1 items-center cursor-pointer text-[#006F6D]'>
                <LuPen className='text-[#12B76A] size-[18px]' />
              </span>
            </Link>

            <DeleteItem
              endPoint={`/participant/${row?.original?.id}`}
              itemName={`${row?.original?.participant_name}`}
              title='Delete Participant'
              refetchUrl={[datagridUrl]}
            />
          </div>
        );
      },
    },
  ];

  //------------- State Management ------------//
  const navigate = useNavigate();
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [openUploadList, setOpenUploadList] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const [openCohort, setOpenCohort] = useState<any>(null);
  const [openDeleteCohort, setOpenDeleteCohort] = useState<any>(null);

  //-------------- API CALL ---------------//
  const { data: ClientData } = useQuery<ClientInfoInterface[]>({
    queryKey: [`/client/getall-clients`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  const { data: ProjectData } = useQuery<ProjectInterface[]>({
    queryKey: [`/projects/client-projects/${selectedClient?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient?.id,
  });

  const { data: ProjectCohortData } = useQuery<any>({
    queryKey: [`/participant/get-project-cohorts/${selectedProject?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedProject?.id,
  });

  //-------- handle functions ---------//
  const handleClose = (selectedCohort?: CohortInterface) => {
    setSelectedCohort(selectedCohort || null);
    setOpenCohort(false);
    setOpenDeleteCohort(false);
    setOpenUploadList(false);
  };

  console.log(selectedCohort, "<-p selectedCohort");
  //--------- Datagrid url ----------//
  let datagridUrl = "/participant";
  if (selectedClient?.id && selectedProject?.id && selectedCohort?.id) {
    datagridUrl = `/participant/participant-filter?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`;
  } else if (selectedClient?.id && selectedProject?.id) {
    datagridUrl = `/participant/participant-filter?client_id=${selectedClient.id}&project_id=${selectedProject.id}`;
  } else if (selectedClient?.id) {
    datagridUrl = `/participant/participant-filter?client_id=${selectedClient.id}`;
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `/participant/export-participants-data`,
        {
          params: {
            client_id: selectedClient?.id,
            project_id: selectedProject?.id,
            cohort_id: selectedCohort?.id,
          },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "participants_data.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error.response) {
        console.error("Response error:", await error.response.data?.text?.());
      }
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <div>
      <AppBar
        title='Participant Management'
        subTitle='Add, Edit and Manage Participants'
      />
      {/* <PageHeading>Participants</PageHeading> */}
      <div className='flex flex-wrap gap-5 mt-[16px]  mb-10'>
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
                className='text-[#3B7FE6] underline text-[13px] mt-2 cursor-pointer'
                onClick={() => navigate("/project-configuration")}
              >
                Add New
              </p>
            )}
          </div>
        )}

        {selectedClient && selectedProject && (
          <div className='flex flex-col'>
            <CustomSelect
              placeholder={
                ProjectCohortData && ProjectCohortData.length
                  ? ""
                  : "Add new cohort"
              }
              className='w-[475.33px] h-[44px] border-[#D5D7DA] shadow-[rgba(10,13,18,0.05)]'
              disabled={
                ProjectCohortData && ProjectCohortData.length ? false : true
              }
              label='Select Cohort Name'
              getOptionLabel={(item) => item?.cohort_name}
              getOptionValue={(item) => item?.id}
              options={ProjectCohortData || []}
              onChange={(item) => setSelectedCohort(item)}
              value={selectedCohort}
            />
            <div className='flex gap-2'>
              <span
                className='text-[#3B7FE6] underline text-[13px] mt-2 cursor-pointer'
                onClick={() => setOpenCohort(true)}
              >
                Add New
              </span>
              <span
                className='text-[#c51801] underline text-[13px] mt-2 cursor-pointer'
                onClick={() => setOpenDeleteCohort(true)}
              >
                Delete Cohort
              </span>
            </div>
          </div>
        )}
      </div>

      {/* <div className='p-6'>
        lsjnkvjsnkfvndk
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen} width='1000px'>
          <div className='p-4'>
            <h2 className='text-lg font-semibold mb-2'>Drawer Content</h2>
            <p>This drawer works perfectly with React 19 🎉</p>
            <DrawerClose asChild>
              <Button className='mt-4' variant='outline'>
                Close
              </Button>
            </DrawerClose>
          </div>
        </Drawer>
      </div> */}

      <Datagrid
        title='Participants'
        onRowDoubleClick={(row: any) => {
          const rowData = row;
          navigate("participantsForm", {
            state: {
              rowData,
              ClientData,
              ProjectCohortData,
              ProjectData,
            },
          });
        }}
        tableMetaDataKey='participants-config'
        columns={columns}
        disableFilters={true}
        url={datagridUrl}
        extraButtons={
          <>
            <CustomButton
              variant='outline'
              disabled={
                !(selectedClient?.id && selectedProject && selectedCohort)
              }
              onClick={() => {
                setOpenUploadList(true);
              }}
            >
              <FiUploadCloud className='!size-5' />
              Bulk upload
            </CustomButton>
            <CustomButton
              variant='outline'
              disabled={
                !selectedClient?.id ||
                !selectedProject?.id ||
                !selectedCohort?.id
              }
              onClick={handleDownload}
            >
              <FiDownloadCloud className='size-5' />
              Export
            </CustomButton>
            <CustomButton disabled={!selectedClient?.id} variant='default'>
              <Link
                to={{ pathname: "participantsForm" }}
                state={{
                  ClientData,
                  selectedClient,
                  selectedProject,
                  selectedCohort,
                  ProjectData,
                  ProjectCohortData,
                }}
              >
                <div className='flex items-center gap-1'>
                  <Plus className='!size-5' />
                  Add New
                </div>
              </Link>
            </CustomButton>
          </>
        }
      ></Datagrid>

      {openUploadList && (
        <UploadListDialoag
          refetchQuire={datagridUrl}
          handleClose={handleClose}
          url={`/participant/upload-excel-file/${selectedClient?.id}/${selectedProject?.id}/${selectedCohort?.id}`}
          title='Participants'
          downloadURL={`participant/download/${selectedClient?.id}/${selectedProject?.nbol?.id}/${selectedProject?.id}`}
        />
      )}
      {openCohort && (
        <CohortDialoag
          handleClose={handleClose}
          refetchQuire={`/participant/get-project-cohorts/${selectedProject?.id}`}
          url={`/cohorts/${selectedProject?.id}`}
        />
      )}
      {openDeleteCohort && (
        <DeleteCohortDialoag
          CohortData={ProjectCohortData}
          handleClose={handleClose}
          refetchQuire={`/participant/get-project-cohorts/${selectedProject?.id}`}
        />
      )}
    </div>
  );
};

export default ParticipantsPage;
