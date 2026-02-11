import { ConfirmDialog } from "@/components";
import AppBar from "@/components/app-bar";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { Separator } from "@/components/ui/separator";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { LuEye } from "react-icons/lu";
import { MdOutlineFileDownload } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SingleClassReport = () => {
  //--------- state management --------//
  const { state } = useLocation();
  const naviget = useNavigate();
  const [participantId, setParticipantId] = useState();
  const [data, setData] = useState<any>({});
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/report/admin-status/${participantId}`, data),
    onSuccess(data) {
      setOpen(false);
      toast.success(data.data.message || "");
      queryClient.refetchQueries({
        queryKey: [`/report/all-class-reports-part/${state?.classId}`],
        exact: false,
      });
    },
  });

  // ------------ colums ------------//
  const columns: ColumnDef<any>[] = [
    {
      header: "Participant Name",
      accessorKey: "participant_name",
      cell({ row }) {
        return row?.original?.participant?.participant_name;
      },
    },
    {
      header: "Reports",
      accessorKey: "reports",
      cell({ row }) {
        return "Report 1";
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            {user?.role === "assessor" &&
              (row?.original?.assessor_status !== "completed" ? (
                <Link
                  to={"/reports/report-edit"}
                  state={{
                    participant_name:
                      row?.original?.participant?.participant_name,
                    classId: row?.original?.classes?.[0]?.id,
                    ParticipantId: row?.original?.part_id,
                    assessor_status: row?.original?.assessor_status,
                  }}
                >
                  <span
                    className={`flex gap-1 items-center cursor-pointer  ${row?.original?.assessor_status !== "completed" ? "text-[#006F6D]" : " text-[#a2aaaa]"}`}
                  >
                    <BiEditAlt
                      className={` ${row?.original?.assessor_status !== "completed" ? "text-[#006F6D]" : " text-[#a2aaaa]"}size-[14px]`}
                    />
                    Edit
                  </span>
                </Link>
              ) : (
                <span
                  className={`flex gap-1 items-center cursor-pointer  ${row?.original?.assessor_status !== "completed" ? "text-[#006F6D]" : " text-[#a2aaaa]"}`}
                >
                  <BiEditAlt
                    className={` ${row?.original?.assessor_status !== "completed" ? "text-[#006F6D]" : " text-[#a2aaaa]"}size-[14px]`}
                  />
                  Edit
                </span>
              ))}
            {user?.role === "admin" &&
              (row?.original?.admin_status !== "accepted" ? (
                <>
                  <span
                    className={`flex gap-1 items-center cursor-pointer  ${row?.original?.assessor_status === "completed" ? "text-[#155EEF]" : " text-[#a2aaaa]"}`}
                    onClick={() => {
                      if (row?.original?.assessor_status === "completed") {
                        setParticipantId(row?.original?.part_id);
                        naviget(
                          `/report-ui/${row?.original?.part_id}?onlyView=true`,
                        );
                      }
                    }}
                  >
                    <LuEye
                      className={` ${row?.original?.assessor_status === "completed" ? "text-[#155EEF]" : " text-[#a2aaaa]"}size-[14px]`}
                    />
                    Preview
                  </span>

                  <Separator
                    orientation='vertical'
                    className='!h-[15px] text-red-500'
                  />

                  <span
                    className={`flex gap-1 items-center cursor-pointer  ${row?.original?.assessor_status === "completed" && row?.original?.admin_status !== "accepted" ? "text-[#006F6D]" : " text-[#a2aaaa]"}`}
                    onClick={() => {
                      if (
                        row?.original?.assessor_status === "completed" &&
                        row?.original?.admin_status !== "accepted"
                      ) {
                        setParticipantId(row?.original?.part_id);
                        setOpen(true);
                        setData({
                          admin_status: "accepted",
                          admin_name: user?.name,
                        });
                      }
                    }}
                  >
                    <FaCheck
                      className={` ${row?.original?.assessor_status === "completed" && row?.original?.admin_status !== "accepted" ? "text-[#006F6D]" : " text-[#a2aaaa]"}size-[14px]`}
                    />
                    Accept
                  </span>

                  <Separator
                    orientation='vertical'
                    className='!h-[15px] text-red-500'
                  />

                  {row?.original?.assessor_status == "completed" ? (
                    <Link
                      to={"/reports/report-edit"}
                      state={{
                        participant_name:
                          row?.original?.participant?.participant_name,
                        classId: row?.original?.classes?.[0]?.id,
                        ParticipantId: row?.original?.part_id,
                        assessor_status: row?.original?.assessor_status,
                      }}
                    >
                      <span
                        className={`flex gap-1 items-center cursor-pointer   text-[#006F6D]`}
                      >
                        <BiEditAlt className={`  text-[#006F6D] size-[14px]`} />
                        Edit
                      </span>
                    </Link>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                row?.original?.admin_status === "accepted" && (
                  <span
                    className='flex gap-1 items-center cursor-pointer text-[#155EEF]'
                    onClick={() => {
                      setSelectedParticipant(row?.original?.part_id);
                      onDownload();
                    }}
                  >
                    {DownloadPending &&
                    selectedParticipant === row?.original?.part_id ? (
                      <Loader2 className='animate-spin w-4 h-4 text-[#155EEF]' />
                    ) : (
                      <MdOutlineFileDownload className='text-[#155EEF] size-[14px]' />
                    )}
                    <span>
                      {DownloadPending &&
                      selectedParticipant === row?.original?.part_id
                        ? "Preparing..."
                        : "Download"}
                    </span>
                  </span>
                )
              ))}
          </div>
        );
      },
    },
  ];

  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;
  const [open, setOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const { mutate: download, isPending: DownloadPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.get(
        `/report/report-download/${selectedParticipant}`,
      );
      return response.data;
    },
    onSuccess: (res) => {
      setSelectedParticipant(null);
      const url = res?.data?.file_path.split("/").slice(1).join("/");
      const link = document.createElement("a");
      link.href = `${process.env.REACT_APP_API_BASE_URL}/${url}`;
      link.target = "__blank";
      link.click();
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
      setSelectedParticipant(null);
    },
  });

  const onDownload = () => {
    download();
  };
  return (
    <div>
      {/* <PageHeading>Report</PageHeading> */}
      <AppBar
        title='Report Management'
        subTitle='Edit and Manage Participants Reports'
      />

      {(user?.role === "assessor" || user?.role === "admin") && (
        <div>
          <>
            <Datagrid
              title='Report'
              onRowDoubleClick={(row: any) => {
                if (
                  row?.admin_status === "accepted" &&
                  user?.role === "admin"
                ) {
                  setSelectedParticipant(row?.part_id);
                  onDownload();
                } else if (
                  user?.role === "assessor" &&
                  row?.assessor_status !== "completed"
                ) {
                  naviget("/reports/report-edit", {
                    state: {
                      participant_name: row?.participant?.participant_name,
                      classId: row?.classes?.[0]?.id,
                      ParticipantId: row?.part_id,
                      assessor_status: row?.assessor_status,
                    },
                  });
                }
              }}
              url={
                state?.classId &&
                `/report/all-class-reports-part/${state?.classId}`
              }
              disableFilters={true}
              tableMetaDataKey='report-table'
              columns={columns}
            />
          </>
        </div>
      )}
      {open && (
        <ConfirmDialog
          confirmMessage='Are you sure you want to submit ?'
          title={
            <span className='flex gap-3 items-center'>
              <FiAlertCircle className='size-10 text-[#FFAE43]' />
              Confirm Submission ?
            </span>
          }
          onClose={() => setOpen(false)}
          onConfirm={() => mutate(data)}
        />
      )}
    </div>
  );
};

export default SingleClassReport;
