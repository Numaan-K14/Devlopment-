import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { ClientInfoInterface } from "@/interfaces/client";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { LuPen } from "react-icons/lu";
import ClientConfigDialog from "./components/ClientDialog";

const ClientsPage = () => {
  // ------------ colums ------------//
  const clientInfoColumns: ColumnDef<ClientInfoInterface>[] = [
    {
      header: "Client Name",
      accessorKey: "client_name",
      cell({ row }: { row: any }) {
        return row.original?.is_360_client
          ? row?.original?.nbol_client_name
          : row?.original?.client_name;
      },
    },
    {
      header: "Client Contact Person",
      accessorKey: "contact_persons",
      cell({ row }: { row: any }) {
        return row.original?.contact_persons?.[0]?.name || "";
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
            {/* <Separator
              orientation='vertical'
              className='!h-[15px] text-red-500'
            /> */}

            <DeleteItem
              endPoint={`/client/${row?.original?.id}`}
              itemName={`${row?.original?.client_name}`}
              title='Delete Client'
              refetchUrl={["/client"]}
            />
          </div>
        );
      },
    },
  ];

  //--------- state management --------//

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  //-------- handle functions ---------//

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  return (
    <div>
      {/* <PageHeading>Client</PageHeading> */}
      <AppBar
        title='Client Management'
        subTitle='Add, Edit and Manage Clients'
      />
      <div className='mt-6'>
        <Datagrid
          title='Client'
          onRowDoubleClick={(row: any) => {
            setOpen(true);
            setSelectedRow(row?.id);
          }}
          tableMetaDataKey='client-config'
          disableFilters
          url='/client'
          columns={clientInfoColumns}
          extraButtons={
            <CustomButton variant='default' onClick={() => setOpen(true)}>
              <IoMdAdd className='!size-5' />
              Add New
            </CustomButton>
          }
        />
        {open && (
          <ClientConfigDialog
            open={open}
            handleClose={handleDialogClose}
            id={selectedRow}
          />
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
