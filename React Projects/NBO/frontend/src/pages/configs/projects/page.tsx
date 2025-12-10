import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { ClientCreateInterface, ProjectInterface } from "@/interfaces/client";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { LuPen } from "react-icons/lu";
import ProjectConfigDialog from "../clients/components/ProjectDialoag";

const ProjectsPage = () => {
  // ------------ colums ------------//
  const ptojectColumns: ColumnDef<ProjectInterface>[] = [
    {
      header: "Client Name",
      accessorKey: "client_name",
      cell({ row }: { row: any }) {
        return row.original?.client?.client_name || "";
      },
    },
    {
      header: "Project Name",
      accessorKey: "project_name",
    },
    {
      header: "Leadership Level",
      accessorKey: "leadership_level",
      cell({ row }: { row: any }) {
        return row.original?.nbol?.leadership_level || "";
      },
    },
    {
      header: "Tentative Start Date",
      accessorKey: "start_date",
      cell({ row }: { row: any }) {
        return moment(row?.original?.start_date).format("DD/MM/YYYY") || "";
      },
    },
    {
      header: "Tentative Completion Date",
      accessorKey: "end_date",
      cell({ row }: { row: any }) {
        return moment(row?.original?.end_date).format("DD/MM/YYYY") || "";
      },
    },

    {
      header: `Action`,
      accessorKey: "action",
      enableSorting: false,
      meta: {
        disableFilters: true,
      },
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <span
              className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
              onClick={() => {
                setOpen(true);
                setSelectedRow(row?.original?.id);
              }}
            >
              <LuPen className='text-[#12B76A] size-[18px]' />
            </span>

            <DeleteItem
              endPoint={`/projects/${row?.original?.id}`}
              itemName={`${row?.original?.project_name}`}
              title='Delete Client'
              refetchUrl={[
                selectedClient?.id
                  ? `/projects/client-projects/${selectedClient?.id}`
                  : "/projects",
              ]}
            />
          </div>
        );
      },
    },
  ];

  //--------- state management --------//
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>();
  const handleDialogClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  //----------- api calls ------------------//

  return (
    <div>
      <AppBar
        title='Project Management'
        subTitle='Add, Edit and Manage Projects'
      />
      {/* <PageHeading>Projects</PageHeading> */}
      <div className=' mt-[16px]'>
        <div className='flex gap-10 mb-10 '>
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
                localStorage.removeItem("project");
                localStorage.removeItem("cohort");
              }
            }}
            localStorageName='client'
            url='/client/getall-clients'
          />{" "}
        </div>
        <Datagrid
          title='Projects'
          onRowDoubleClick={(row: any) => {
            setOpen(true);
            setSelectedRow(row?.id);
          }}
          tableMetaDataKey='client-project-config'
          disableFilters
          url={
            selectedClient?.id
              ? `/projects/client-projects/${selectedClient?.id}`
              : "/projects"
          }
          columns={ptojectColumns}
          extraButtons={
            <CustomButton
              onClick={() => setOpen(true)}
              disabled={!selectedClient}
            >
              <IoMdAdd className='!size-5' />
              Add New
            </CustomButton>
          }
        />
        {open && (
          <ProjectConfigDialog
            open={open}
            handleClose={handleDialogClose}
            id={selectedRow}
            selectedClient={selectedClient}
            refetchUrl={
              selectedClient?.id
                ? `/projects/client-projects/${selectedClient?.id}`
                : "/projects"
            }
          />
        )}
      </div>
    </div>
  );
};
export default ProjectsPage;
