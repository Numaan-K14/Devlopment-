import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import ParticipantDialog from "./components/participant-dialog";

const ParticipantConfig = () => {
  const columns: ColumnDef<any>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Employee ID",
      accessorKey: "employee_ID",
    },
    {
      header: "Email address",
      accessorKey: "email_address",
    },
    {
      header: "Department",
      accessorKey: "department",
    },
    {
      header: "Leadership Level",
      accessorKey: "leadership_level",
    },
    {
      header: "Date Added",
      accessorKey: "date_added",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell({ row }) {
        return (
          <DeleteItem
            endPoint={`/assessors/${row?.original?.id}`}
            itemName={`${row?.original?.assessor_name}`}
            title='Delete Assessors'
            refetchUrl={["/assessors"]}
          />
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

  const [open, setOpen] = useState(false);

  return (
    <div className=''>
      <AppBar
        showNav={false}
        title='Participant Management'
        subTitle='Add, Edit and Manage Interview Participants'
      />
      <div className='mt-6'>
        <Datagrid
          columns={columns}
          disableFilters
          title='Participants'
          disableSearch
          extraButtons={
            <>
              <CustomButton variant='outline'>
                <FiUploadCloud className='!size-5' />
                Bulk upload
              </CustomButton>

              <CustomButton variant='default' onClick={() => setOpen(true)}>
                <div className='flex items-center gap-1'>
                  <Plus className='!size-5' />
                  Add New
                </div>
              </CustomButton>
            </>
          }
        />

        {open && <ParticipantDialog handleClose={setOpen} />}
      </div>
    </div>
  );
};

export default ParticipantConfig;
