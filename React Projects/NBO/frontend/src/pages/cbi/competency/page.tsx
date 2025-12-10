import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import CompetencyDrawer from "./components/CompetencyDrawer";

const CompetencyConfig = () => {
  const columns: ColumnDef<any>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Expected Behavior",
      accessorKey: "Expected Behavior",
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
        title='Competency Management'
        subTitle='Define competencies and expected behaviors for interviews'
      />
      <div className='mt-6'>
        <Datagrid
          columns={columns}
          disableFilters
          title='Competencies'
          disableSearch
          extraButtons={
            <>
              <CustomButton variant='outline'>
                <FiUploadCloud className='!size-5' />
                Bulk upload
              </CustomButton>
              <CustomButton variant='outline' onClick={() => setOpen(true)}>
                <FiUploadCloud className='!size-5' />
                Add
              </CustomButton>
            </>
          }
        />
        {
          <CompetencyDrawer
            handleClose={setOpen}
            leadershipLevelId=''
            open={open}
            setOpen={setOpen}
          />
        }
      </div>
    </div>
  );
};

export default CompetencyConfig;
