import { DataTableDemo } from "@/components/custom/DataTableDemo";
import { ParticipantCount, Uploadbtn } from "@/components/custom/UIElements";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { SIdeDrawer } from "../Popups/SIdeDrawer";
import { AlertPopUp } from "../Popups/AlertPopUp";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
export function Competency() {
  const [open, setOpen] = useState(false);
  //  const [edit, setEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { register } = useForm();
  const CompetencyForm = useForm();
  const onSubmit = (data) => {
    console.log("CompetencyFormData :", data);
    CompetencyForm.reset();
    // AddUser(data);
  };
  const getStatusBadge = (status) => {
    if (status === "Active") return "bg-[#ECFDF3] text-[#027A48]";
  };
  const column = [
    { key: "name", label: "Name" },
    { key: "expectedbehavior", label: "Expected Behavior" },
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
  const competencies = [
    {
      index: "1",
      name: "Inspirational Leadership and Decision-Making",
      expectedbehavior: "4",
      status: "Active",
      action: "-",
    },
    {
      index: "2",
      name: "Strategic Vision and Insight",
      expectedbehavior: "5",
      status: "Active",
      action: "-",
    },
    {
      index: "3",
      name: "Business Acumen and Financial Stewardship",
      expectedbehavior: "4",
      status: "Active",
      action: "-",
    },
    {
      index: "4",
      name: "Collaborative Influence and Stakeholder Engagement",
      expectedbehavior: "5",
      status: "Active",
      action: "-",
    },
    {
      index: "5",
      name: "Talent Development and Inclusion",
      expectedbehavior: "5",
      status: "Active",
      action: "-",
    },
    {
      index: "6",
      name: "Innovation and Transformation Leadership",
      expectedbehavior: "5",
      status: "Active",
      action: "-",
    },
  ];

  return (
    <div>
      <header className="flex justify-between items-center p-8">
        <div>
          <h1 className="text-[#181D27] font-semibold text-3xl ">
            Competency Management
          </h1>
          <p className="text-base text-[#535862]">
            Define competencies and expected behaviors for interviews
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="font-semibold text-sm bg-white border-2 border-[#D5D7DA] py-2 px-4 rounded-lg flex gap-1 items-center  hover:bg-[#ececec] "
        >
          <Plus className="h-5 w-5" />
          Add Competency
        </button>
      </header>
      <AlertPopUp
        setTableData={competencies}
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
        heading="Add Competency"
        form={CompetencyForm}
        onSubmit={onSubmit}
      >
        <>
          <form className="grid gap-4 p-7">
            <div>
              <label className="block mb-3 text-[#414651] text-sm font-medium leading-5">
                Competency Name
              </label>
              <input
                type="text"
                {...CompetencyForm.register("Competency_Name")}
                className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block mb-3 text-[#414651] text-sm font-medium leading-5">
                Description
              </label>
              <textarea
                placeholder="Enter a description..."
                {...CompetencyForm.register("description")}
                className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md placeholder:text-[#667085] h-20 w-full"
              />
            </div>

            <div>
              <label className="block mb-3 text-[#414651] text-sm font-medium leading-5">
                Core Question
              </label>
              <textarea
                placeholder="What If ?"
                {...CompetencyForm.register("Core_Question")}
                className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md placeholder:text-[#667085] h-20 w-full mb-32"
              />
            </div>
          </form>
        </>
      </SIdeDrawer>

      <hr className="border-b border-[#cfd2d4] w-full" />
      <Tabs className="my-6" defaultValue="Competencies">
        <TabsList className="flex justify-center items-center">
          <TabsTrigger
            value="Competencies"
            className="text-[#414651] font-semibold text-sm leading-4 py-2 px-66.875 cursor-pointer"
          >
            Competencies
          </TabsTrigger>
          <TabsTrigger
            value="Weightage"
            className="text-[#414651] font-semibold text-sm leading-4 py-2 px-66.875 cursor-pointer"
          >
            Weightage
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Competencies">
          <div className="bg-white rounded-lg shadow m-6">
            <div className="flex justify-between items-center ">
              <ParticipantCount
                label="Competencies"
                count={competencies.length}
              />
              <Uploadbtn label="Bulk Upload" />
            </div>
            <DataTableDemo
              columns={column}
              getStatusBadge={getStatusBadge}
              data={competencies}
              count={competencies.length}
            />
          </div>
        </TabsContent>
        <TabsContent value="Weightage">
          <div className="bg-white rounded-lg shadow-md m-6">
            <h1 className="font-semibold text-lg leading-4 text-[#181D27] py-5 px-6">
              Weightage Management
            </h1>
            <hr className="border-b border-[#E9EAEB] w-full" />

            <form
              // onChange={handleSubmit(onSubmit)}
              className="py-10 px-8 grid grid-cols-3 gap-8"
            >
              {/* ------1=-------- */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Strategic Vision and Insight
                </label>
                <input
                  defaultValue="3"
                  type="number"
                  {...register("Strategic Vision and Insight")}
                  className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
                />
              </div>
              {/* ----------2------------ */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Inspirational Leadership and Decision-Making
                </label>
                <input
                  defaultValue="4"
                  type="number"
                  {...register("Inspirational Leadership and Decision-Making")}
                  className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
                />
              </div>
              {/* ----------3------------ */}

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Business Acumen and Financial Stewardship
                </label>
                <input
                  defaultValue="4"
                  type="number"
                  {...register("Business Acumen and Financial Stewardship")}
                  className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
                />
              </div>
              {/* ----------4------------ */}

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Collaborative Influence and Stakeholder Engagement
                </label>
                <input
                  defaultValue="4"
                  type="number"
                  {...register(
                    "Collaborative Influence and Stakeholder Engagement"
                  )}
                  className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
                />
              </div>
              {/* ----------5------------ */}

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Talent Development and Inclusion
                </label>
                <input
                  defaultValue="4"
                  type="number"
                  {...register("Talent Development and Inclusion")}
                  className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
                />
              </div>
              {/* ----------6------------ */}

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Innovation and Transformation Leadership
                </label>
                <input
                  defaultValue="3"
                  type="number"
                  {...register("Innovation and Transformation Leadership")}
                  className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
                />
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
