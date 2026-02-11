import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import CustomTab from "@/components/custom-tab";
import { DeleteItem } from "@/components/delete-item";
import CustomSwitch from "@/components/inputs/custom-switch";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import UploadListDialoag from "@/components/uploadList-dialoag";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { AssessorsInterface } from "@/interfaces/assessors";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { LuPen } from "react-icons/lu";
import { toast } from "sonner";
import AssessorsDialoag from "./components/AssessorsDialoag";
import EngagementsPage from "./components/EngagementsPage";

const AssessorsPage = () => {
  // ------------ colums ------------//
  const columns: ColumnDef<AssessorsInterface>[] = [
    {
      header: "Name",
      accessorKey: "assessor_name",
    },
    {
      header: "Email Id",
      accessorKey: "email",
    },
    // {
    //   header: "Credentials",
    //   accessorKey: "credential",
    // },
    {
      header: "Status",
      accessorKey: "status",
      cell({ row }: { row: any }) {
        const status = row?.original?.status;
        return (
          <div className='flex gap-2'>
            {row?.original?.status === true ? "Active" : "Inactive"}

            <CustomSwitch
              className=''
              defaultChecked={status || false}
              checked={status}
              onChange={(e) => {
                setSelectedRow(row?.original?.id);
                mutate({
                  assessor_name: row?.original?.assessor_name || "",
                  email: row?.original?.email || "",
                  credential: row?.original?.credential || "",
                  status: e,
                });
              }}
            />
          </div>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "Action",
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
                setSelectedRowData(row?.original);
              }}
            >
              <LuPen className='text-[#12B76A] size-[18px]' />
            </span>

            <DeleteItem
              endPoint={`/assessors/${row?.original?.id}`}
              itemName={`${row?.original?.assessor_name}`}
              title='Delete Assessors'
              refetchUrl={["/assessors"]}
            />
          </div>
        );
      },
    },
  ];

  //--------- state management --------//
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [openUploadList, setOpenUploadList] = useState(false);

  //-------- handle functions ---------//
  const handleClose = () => {
    setOpen(false);
    setOpenUploadList(false);
    setSelectedRow(null);
    setSelectedRowData(null);
  };

  //-------- api call ---------//
  const { mutate } = useMutation({
    mutationFn: (data: any) => axios.put(`/assessors/${selectedRow}`, data),
    onSuccess(data: any) {
      toast.success(data.data.msg || "Successful");
      handleClose();
      queryClient.refetchQueries({
        queryKey: [`/assessors`],
      });
    },
  });
  const [tabValue, setTabValue] = useState<any>("0");

  return (
    <div>
      <AppBar
        title='Assessors Management'
        subTitle='Add, Edit and Manage Assessors'
      />
      <CustomTab
        setValue={setTabValue}
        tabs={[
          { label: "Assessors", value: 0 },
          { label: "Engagements", value: 1 },
        ]}
        value={tabValue}
        className='flex items-center justify-center'
      />
      {tabValue == 0 && (
        <Datagrid
          title='Assessors'
          onRowDoubleClick={(row: any) => {
            setOpen(true);
            setSelectedRow(row?.id);
            setSelectedRowData(row);
          }}
          disableFilters={true}
          tableMetaDataKey='assessors-config'
          columns={columns}
          url='/assessors'
          extraButtons={
            <>
              <CustomButton
                variant='outline'
                onClick={() => {
                  setOpenUploadList(true);
                }}
              >
                <Upload />
                Upload Assessor
              </CustomButton>
              <CustomButton variant='default' onClick={() => setOpen(true)}>
                <Plus />
                Add New
              </CustomButton>
            </>
          }
        ></Datagrid>
      )}
      {tabValue == 1 && <EngagementsPage />}
      {open && (
        <AssessorsDialoag
          handleClose={handleClose}
          id={selectedRow}
          row={selectedRowData}
          open={open}
        />
      )}
      {openUploadList && (
        <UploadListDialoag
          refetchQuire={`/assessors`}
          handleClose={handleClose}
          url={`assessors/upload-excel-file/`}
          title='Assessor'
          downloadURL={`assessors/download`}
        />
      )}
    </div>
  );
};

export default AssessorsPage;
