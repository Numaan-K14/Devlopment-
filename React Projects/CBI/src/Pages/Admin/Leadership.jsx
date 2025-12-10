import { DataTableDemo } from "@/components/custom/DataTableDemo";
import { ParticipantCount, Uploadbtn } from "@/components/custom/UIElements";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SIdeDrawer } from "../Popups/SIdeDrawer";
import { useForm } from "react-hook-form";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { AlertPopUp } from "../Popups/AlertPopUp";

export function Leadership() {
  const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  const columns = [
    { key: "name", label: "Name" },
    { key: "Description", label: "Description" },
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
     {
          key: "actions",
          label: "",
          render: (row) => (
            <div className="flex justify-between items-center gap-2">
              <FiEdit2 className="cursor-pointer text-[#12B76A] h-5 w-5" />
              <RiDeleteBinLine
                className="cursor-pointer text-[#F04438] h-5 w-5"
                // onClick={() => HandleDelete(row.id)}
                onClick={() => {
                  setOpenDelete(true);
                  setDeleteId(row.id);
                }}
              />
            </div>
          ),
        },
  ];
  const Leadership = [
    {
      index: "1",
      name: "Leading Self",
      Description:
        "Focus on individual contributions, learning, and aligning personal goals with organisational objectives.",
      participants: "43",
      status: "Active",
    },
    {
      index: "2",
      name: "Leading Others",
      Description:
        "Involves managing and developing teams, driving team performance, and ensuring alignment with organisational goals.",
      participants: "23",
      status: "Active",
    },
    {
      index: "3",
      name: "Leading Managers",
      Description:
        "Focus on overseeing managers, aligning departmental goals with organisational strategy, and building leadership capabilities.",
      participants: "34",
      status: "Active",
    },
    {
      index: "4",
      name: "Leading Organization",
      Description:
        "Involves driving organisational vision, fostering collaboration across departments, and making high-level strategic decisions.",
      participants: "55",
      status: "Active",
    },
  ];
  const getStatusBadge = (status) => {
    if (status == "Active") return "bg-[#ECFDF3] text-[#027A48]";
  };

  const LeadershipForm = useForm();
  const onSubmit = (data) => {
    console.log("LeadershipFormData :", data);
    LeadershipForm.reset();
  };
  return (
    <>
      <header className="flex justify-between items-center p-8">
        <div>
          <h1 className="text-[#181D27] font-semibold text-3xl ">
            Leadership Level Management
          </h1>
          <p className="text-base text-[#535862]">
            Define organizational hierarchy and competency expectations
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="font-semibold text-sm bg-white border-2 border-[#D5D7DA] py-2 px-4 rounded-lg flex gap-1 items-center  hover:bg-[#ececec] "
        >
          <Plus className="h-5 w-5" />
          Add Leadership Level
        </button>
      </header>
      <AlertPopUp
        setTableData={Leadership}
        open={openDelete}
        setOpen={setOpenDelete}
        deleteId={deleteId}
        DeleteIcon="DeleteIcon"
        heading="Delete Participant"
        Paragraph="Are you sure you want to delete this Participant? This action cannot be undone."
        cancel="Cancel"
        action="Delete"
      />
      <SIdeDrawer
        open={open}
        setOpen={setOpen}
        heading="Add Leadership Level"
        form={LeadershipForm}
        onSubmit={onSubmit}
      >
        <>
          <form className="grid gap-4 p-7">
            <div>
              <label className="block mb-3 text-[#414651] text-sm font-medium leading-5">
                Leadership Level Name
              </label>
              <input
                type="text"
                {...LeadershipForm.register("Competency_Name")}
                className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block mb-3 text-[#414651] text-sm font-medium leading-5">
                Description
              </label>
              <textarea
                placeholder="Enter a description..."
                {...LeadershipForm.register("description")}
                className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md placeholder:text-[#667085] h-20 w-full"
              />
            </div>
          </form>
        </>
      </SIdeDrawer>
      <hr className="border-b border-[#cfd2d4] w-full" />
      <div className="bg-white rounded-lg shadow m-6">
        <div className="flex justify-between items-center">
          <ParticipantCount
            label="Leadership Levels"
            count={Leadership.length}
          />
          <Uploadbtn label="Upload Participants" />
        </div>
        <DataTableDemo
          columns={columns}
          data={Leadership}
          getStatusBadge={getStatusBadge}
          count={Leadership.length}
        />
      </div>
    </>
  );
}
