import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import UploadListDialoag from "@/components/uploadList-dialoag";
import { ClientCreateInterface } from "@/interfaces/client";
import { FacilityInterface } from "@/interfaces/facility";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { LuPen } from "react-icons/lu";
import FacilitiesForm from "./components/FacilitiesForm";

const FacilitiesPage = () => {
  //---------- colums --------------//
  const columns: ColumnDef<FacilityInterface>[] = [
    {
      header: "Facilities name",
      accessorKey: "facility_name",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
    {
      header: "Rooms",
      accessorKey: "room",
      cell({ row }: { row: any }) {
        return (
          row.original?.room?.map((item: any) => item?.room)?.join(", ") || ""
        );
      },
    },
    {
      header: "Action",
      accessorKey: "Action",
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <span
              className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
              onClick={() => {
                setOpen(true);
                setSelectedRow(row?.original);
              }}
            >
              <LuPen className='text-[#12B76A] size-[18px]' />
            </span>

            <DeleteItem
              endPoint={`/facility/${row?.original?.id}`}
              itemName={`${row?.original?.facility_name}`}
              title='Delete Facility'
              refetchUrl={[`/facility/${selectedClient?.id}`]}
            />
          </div>
        );
      },
    },
  ];

  //-------- state management --------//
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>();

  //---------- handle functions ---------//
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  const handleUploadDialoagClose = () => {
    setOpenUploadDialog(false);
  };

  return (
    <div>
      <AppBar
        title='Facility Management'
        subTitle='Add, Edit and Manage Facilities'
      />
      {/* <PageHeading>Facilities</PageHeading> */}
      <div className='flex  gap-10 mt-[16px] mb-10'>
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
        />
      </div>
      <Datagrid
        title='Facilities'
        onRowDoubleClick={(row: any) => {
          setOpen(true);
          setSelectedRow(row);
        }}
        tableMetaDataKey='facility-config'
        columns={columns}
        disableFilters={true}
        url={selectedClient?.id ? `/facility/${selectedClient?.id}` : ""}
        extraButtons={
          <div className='flex flex-col sm:flex-row gap-3'>
            <CustomButton
              variant='outline'
              onClick={() => setOpenUploadDialog(true)}
              disabled={!selectedClient}
            >
              <FiUploadCloud className='!size-5' />
              Bulk Upload
            </CustomButton>
            <CustomButton
              variant='default'
              disabled={!selectedClient}
              onClick={() => setOpen(true)}
            >
              <Plus className='!size-5' />
              Add New
            </CustomButton>
          </div>
        }
      ></Datagrid>

      {open && (
        <FacilitiesForm
          open={open}
          handleClose={handleClose}
          projectId={selectedClient?.id}
          facility={selectedRow}
          refetchQuire={`/facility/${selectedClient?.id}`}
        />
      )}

      {openUploadDialog && (
        <UploadListDialoag
          handleClose={handleUploadDialoagClose}
          refetchQuire={`/facility/${selectedClient?.id}`}
          url={`/facility/upload-excel-file/${selectedClient?.id}`}
          title='Facility'
          downloadURL='facility/download'
        />
      )}
    </div>
  );
};

export default FacilitiesPage;
