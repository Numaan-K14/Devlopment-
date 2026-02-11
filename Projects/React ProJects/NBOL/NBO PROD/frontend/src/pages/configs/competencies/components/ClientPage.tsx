import CustomButton from "@/components/button";
import ConflictChip from "@/components/conflict-chip";
import { DeleteItem } from "@/components/delete-item";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import UploadListDialoag from "@/components/uploadList-dialoag";
import { useQuery } from "@/hooks/useQuerry";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { ClientCompetiencyInterface } from "@/interfaces/competency";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { LuPen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import CompetenciesDialog from "./CompetenciesDialog";
import LinkNbolCompetiencyDialog from "./LinkNbolCompetiency";

const ClientPage = () => {
  // ------------ colums ------------//
  const Clientcolumns: ColumnDef<ClientCompetiencyInterface>[] = [
    {
      header: "Leadership Levels",
      accessorKey: "leadership_level",
      cell({ row }) {
        return <p>{row?.original?.nbol_leadership_level?.leadership_level}</p>;
      },
    },
    {
      header: "Competencies",
      accessorKey: "competency",
    },
    {
      header: "Competencies Type",
      accessorKey: "competency_type",
      cell({ row }) {
        return (
          <ConflictChip title={row?.original.client_id ? "Client" : "NBOL"} />
        );
      },
    },
    {
      header: "Action",
      accessorKey: "Action",
      cell({ row }) {
        const delet_id = row?.original?.nbol_client_competencies.length
          ? row?.original?.nbol_client_competencies?.[0]?.id
          : row?.original?.id;
        return (
          <div className='flex justify-start items-center gap-5'>
            <span
              className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
              onClick={() => {
                setOpen(true);
                setSelectedRowData(row?.original);
              }}
            >
              <LuPen className='text-[#12B76A] size-[18px]' />
            </span>

            <DeleteItem
              endPoint={`/competency/${delet_id}`}
              itemName={`${row?.original?.competency}`}
              title='Delet Client Competency'
              refetchUrl={[
                `/competency/nbol-leadership-level-nbol-client-filter/${selectedProject?.nbol?.id}/${selectedClient?.id}`,
              ]}
            />
          </div>
        );
      },
    },
  ];

  //--------- state management --------//
  const navigate = useNavigate();
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [forClient, setForClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  //-------- handle functions ---------//
  const handleClose = () => {
    setOpen(false);
    setSelectedRowData(null);
    setForClient(false);
  };

  const handleUploadDialoagClose = () => {
    setOpenUploadDialog(false);
  };

  //-------- api call ---------//
  const { data: NbolLeadershipData } = useQuery<any>({
    queryKey: [`/nbol-levels`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  return (
    <div>
      <div className='flex gap-6 mt-[16px] mb-10'>
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
        />{" "}
        {selectedClient && (
          <div>
            <SelectCommonOptions
              required={true}
              key={selectedProject?.id}
              handleDataChange={(project: ProjectConfigInterface | null) => {
                setSelectedProject(project);
                localStorage.setItem("project", JSON.stringify(project));
                if (
                  selectedProject &&
                  selectedProject?.id !==
                    JSON.parse(localStorage.getItem("project") ?? "")?.id
                ) {
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
      </div>
      <Datagrid
        title='Client Competencies'
        onRowDoubleClick={(row: any) => {
          setOpen(true);
          setSelectedRowData(row);
        }}
        tableMetaDataKey='competency-client-config'
        url={
          selectedClient && selectedProject
            ? `/competency/nbol-leadership-level-nbol-client-filter/${selectedProject?.nbol?.id}/${selectedClient?.id}`
            : ""
        }
        columns={Clientcolumns}
        disableFilters
        extraButtons={
          <>
            <CustomButton
              variant='outline'
              disabled={!selectedClient}
              onClick={() => setOpenUploadDialog(true)}
            >
              <img src='/icons/Fetch-upload.svg' alt='upload' />
              Upload Competencies
            </CustomButton>
            <CustomButton
              disabled={!selectedClient && !selectedProject}
              variant='outline'
              onClick={() => setOpenLinkDialog(true)}
            >
              <img src='/icons/import.svg' alt='import' />
              Import NBOL Competencies
            </CustomButton>
            <CustomButton
              disabled={!selectedClient && !selectedProject}
              onClick={() => (setOpen(true), setForClient(true))}
            >
              <IoMdAdd className='!size-5' />
              Add New
            </CustomButton>
          </>
        }
      />
      {open && (
        <CompetenciesDialog
          handleClose={handleClose}
          leadershipLevelId={selectedProject?.nbol?.id}
          row={selectedRowData}
          refetchURL={`/competency/nbol-leadership-level-nbol-client-filter/${selectedProject?.nbol?.id}/${selectedClient?.id}`}
          clientId={selectedClient?.id}
          forClient={forClient}
          open={open}
          setOpen={setOpen}
        />
      )}
      {openUploadDialog && (
        <UploadListDialoag
          handleClose={handleUploadDialoagClose}
          refetchQuire={
            selectedClient && selectedProject
              ? `/competency/nbol-leadership-level-nbol-client-filter/${selectedProject?.nbol?.id}/${selectedClient?.id}`
              : ""
          }
          url={`/competency/upload-excel-file/${selectedClient?.id}`}
          title='Competencies'
          nbolLeaderShipData={NbolLeadershipData}
          showNbolDropdown={true}
          downloadURL='competency/download'
        />
      )}
      {openLinkDialog && (
        <LinkNbolCompetiencyDialog
          setOpen={setOpenLinkDialog}
          ClientId={selectedClient?.id}
          NbolId={selectedProject?.nbol?.id}
          ProjectId={selectedProject?.id}
          refetchQuire={`/competency/nbol-leadership-level-nbol-client-filter/${selectedProject?.nbol?.id}/${selectedClient?.id}`}
        />
      )}
    </div>
  );
};

export default ClientPage;
