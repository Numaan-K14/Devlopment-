import { Plus } from "lucide-react";
import { useState } from "react";
import { ParticipantPop } from "../Popups/ParticipantPop";
import { DataTableDemo } from "@/components/custom/DataTableDemo";
import { ParticipantCount, Uploadbtn } from "@/components/custom/UIElements";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { AlertPopUp } from "../Popups/AlertPopUp";

export function Participants() {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // Columns
  const columns = [
    { key: "name", label: "Name" },
    { key: "employeeId", label: "Employee ID" },
    { key: "email", label: "Email address" },
    { key: "department", label: "Department" },
    { key: "leadershipLevel", label: "Leadership Level" },
    { key: "dateAdded", label: "Date Added" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex justify-between items-center gap-2">
          <FiEdit2
            className="cursor-pointer text-[#12B76A] h-5 w-5"
            onClick={() => setEdit(true)}
          />
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

  // Initial Table Data
  const [tableData, setTableData] = useState([
    {
      id: crypto.randomUUID(),
      name: "Olivia Rhye",
      employeeId: "EMP001",
      email: "olivia@untitledui.com",
      department: "Engineering",
      leadershipLevel: "Leading the Organization",
      dateAdded: "1/12/2025",
      status: "Active",
    },
    {
      id: crypto.randomUUID(),
      name: "Phoenix Baker",
      employeeId: "EMP002",
      email: "phoenix@untitledui.com",
      department: "Product",
      leadershipLevel: "Leading Self",
      dateAdded: "15/10/2024",
      status: "Active",
    },
    {
      id: crypto.randomUUID(),
      name: "Lana Steiner",
      employeeId: "EMP003",
      email: "lana@untitledui.com",
      department: "Product",
      leadershipLevel: "Leading Others",
      dateAdded: "01/01/2024",
      status: "Active",
    },
    {
      id: crypto.randomUUID(),
      name: "Demi Wilkinson",
      employeeId: "EMP004",
      email: "demi@untitledui.com",
      department: "Product",
      leadershipLevel: "Leading Self",
      dateAdded: "10/12/2025",
      status: "Active",
    },
    {
      id: crypto.randomUUID(),
      name: "Candice Wu",
      employeeId: "EMP005",
      email: "candice@untitledui.com",
      department: "Product",
      leadershipLevel: "Leading Self",
      dateAdded: "23/11/2023",
      status: "Active",
    },
  ]);

  // Add New User
  function AddUser(formData) {
    const newRow = {
      id: crypto.randomUUID(),
      name: formData.name,
      employeeId: formData.employeeId,
      email: formData.email,
      department: formData.department,
      leadershipLevel: formData.leadershipLevel,
      dateAdded: new Date().toLocaleDateString("en-GB"),
      status: "Active",
    };

    setTableData((prev) => [...prev, newRow]);
  }

  // function AddUser() {
  //   const data = JSON.parse(localStorage.getItem("Participant Data :"));
  //   const newRow = {
  //     ...data,
  //     dateAdded: new Date().toLocaleDateString("en-GB"),
  //     status: "Active",
  //   };
  //   setTableData((prev) => [...prev, newRow]);
  // }

  // useEffect(() => {
  //   const saved = JSON.parse(localStorage.getItem("ParticipantTable"));
  //   if (saved) setTableData(saved);
  // }, []);

  // function AddUser() {
  //   const data = JSON.parse(localStorage.getItem("Participant Data :"));

  //   const newRow = {
  //     ...data,
  //     dateAdded: new Date().toLocaleDateString("en-GB"),
  //     status: "Active",
  //   };

  //   setTableData((prev) => {
  //     const updated = [...prev, newRow];
  //     localStorage.setItem("ParticipantTable", JSON.stringify(updated));
  //     return updated;
  //   });
  // }

  // Status badge style
  const getStatusBadge = (status) => {
    if (status === "Active") return "bg-[#ECFDF3] text-[#027A48]";
  };

  return (
    <>
      <header className="flex justify-between items-center p-8">
        <div>
          <h1 className="text-[#181D27] font-semibold text-3xl">
            Participant Management
          </h1>
          <p className="text-base text-[#535862]">
            Add, Edit and Manage Interview Participants
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          disabled={open}
          className="font-semibold text-sm bg-white border-2 border-[#D5D7DA] py-2 px-4 rounded-lg flex gap-1 items-center hover:bg-[#ececec] disabled:opacity-0"
        >
          <Plus className="h-5 w-5" />
          Add Participant
        </button>
      </header>
      <hr className="border-b border-[#cfd2d4] w-full" />
      {/* ParticipantPop for add new*/}
      <ParticipantPop
        open={open}
        setOpen={setOpen}
        label="Add New Participant"
        SaveButton="Add Participant"
        AddUser={AddUser}
      />
      {/* ParticipantPop for edit*/}
      <ParticipantPop
        open={edit}
        setOpen={setEdit}
        label="Edit Participant"
        SaveButton="Save Participant"
        AddUser={AddUser}
      />
      <AlertPopUp
        setTableData={setTableData}
        open={openDelete}
        setOpen={setOpenDelete}
        deleteId={deleteId}
        DeleteIcon="DeleteIcon"
        heading="Delete Participant"
        Paragraph="Are you sure you want to delete this Participant? This action cannot be undone."
        cancel="Cancel"
        action="Delete"
      />

      <div className="bg-white rounded-xl shadow m-6">
        <div className="flex justify-between items-center">
          <ParticipantCount label="Participants" count={tableData.length} />
          <Uploadbtn label="Bulk Upload" />
        </div>

        <DataTableDemo
          columns={columns}
          data={tableData}
          getStatusBadge={getStatusBadge}
          count={tableData.length}
        />
      </div>
    </>
  );
}
