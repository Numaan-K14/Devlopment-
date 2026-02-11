import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { UserInterface } from "@/interfaces/login";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { LuPen } from "react-icons/lu";
import UsersDialog from "./components/usersDialog";

const UsersPage = () => {
  const columns: ColumnDef<UserInterface>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell({ row }: { row: any }) {
        return (
          <div
            className={` !h-[28px] !flex text-[14px] capitalize items-center rounded-[5px] !py-[2px] !px-[8px] ${row?.original?.role.startsWith("admin") ? "bg-[#ccf4e063] text-[#00bb6d]  !w-[100px] justify-center" : row?.original?.role.startsWith("assessor") ? "bg-[#f4f0cc7e] text-[#998b10]  !w-[100px] justify-center" : "bg-[#CCE3F463] text-[#0071BB] !w-[100px] justify-center"} `}
          >
            {row?.original?.role}
          </div>
        );
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
                setSelectedRow(row?.original);
              }}
            >
              <LuPen className='text-[#12B76A] size-[18px]' />
            </span>
            {/* <Separator
              orientation='vertical'
              className='!h-[15px] text-red-500'
            /> */}

            <DeleteItem
              endPoint={`/user/${row?.original?.id}`}
              itemName={`${row?.original?.name}`}
              title='Delete User'
              refetchUrl={["/user"]}
            />
          </div>
        );
      },
    },
  ];

  //-------- state management --------//
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>();

  const handleClose = () => {
    setSelectedRow([]);
    setOpen(false);
  };
  return (
    <div>
      {/* <PageHeading>Users</PageHeading> */}
      <AppBar title={`User Management`} subTitle='Add, Edit and Manage Users' />
      <div className='mt-6'>
        <Datagrid
          title='Users'
          onRowDoubleClick={(row: any) => {
            setOpen(true);
            setSelectedRow(row);
          }}
          disableFilters={true}
          tableMetaDataKey='user-config'
          url='/user'
          columns={columns}
          extraButtons={
            <>
              <CustomButton variant='default' onClick={() => setOpen(true)}>
                <Plus />
                Add New
              </CustomButton>
            </>
          }
        />
        {open && (
          <UsersDialog
            open={open}
            handleClose={handleClose}
            refetchQuire={"/user"}
            selectedUser={selectedRow}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
