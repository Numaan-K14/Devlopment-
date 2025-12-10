import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect } from "react";

export function ParticipantPop({ open, setOpen, label, SaveButton, AddUser }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // localStorage.setItem("Participant Data :", JSON.stringify(data));
    AddUser(data); //data sends to parent
    setOpen(false);
    reset();
  };

  //Reset Data When Close
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  // ----------------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{label}</DialogTitle>

          <DialogDescription></DialogDescription>
        </DialogHeader>
        <button
          className="absolute right-4 top-4 text-muted-foreground hover:text-black"
          onClick={() => {
            setOpen(false);
            reset();
          }}
        >
          <X strokeWidth={2.25} />
        </button>
        <hr className="border-b-0 border-[#D5D7DA] w-full" />
        {/* ------Form------------- */}
        <form className="py-10 px-8 grid grid-cols-3 gap-8">
          {/* -------NAME=-------- */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Enter Name
            </label>
            <input
              {...register("name", {
                required: "Please Enter Name",
              })}
              className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
              placeholder="Enter Your Name"
            />
            {errors.Name && (
              <span className="text-xs text-red-600">
                {errors.Name.message}
              </span>
            )}
          </div>
          {/* ------Mail=-------- */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="Enter Your Mail"
              {...register("email", { required: "Please Enter Mail" })}
              className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
            />
          </div>
          {/* -------Employee ID=-------- */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Employee ID
            </label>
            <input
              type="number"
              placeholder="Enter Your ID"
              {...register("employeeId", { required: "Please Enter ID" })}
              className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
            />
          </div>
          {/* -------Department-------- */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Department
            </label>
            <input
              placeholder="Enter Your Department"
              {...register("department", {
                required: "Please Enter Department",
              })}
              className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
            />
          </div>
          {/* -------Leadership Level(DPDWN)=-------- */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Leadership Level
            </label>
            <select
              {...register("leadershipLevel")}
              className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
            >
              <option>--Select Option--</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
        </form>
        {/* ----------------------------------------- */}
        <hr className="border-t border-[#D5D7DA] w-full" />
        <DialogFooter className="flex justify-end gap-3 px-8 pb-6">
          <DialogClose asChild>
            <button
              onClick={() => reset()}
              className="bg-white hover:bg-[#e8e9ec] text-[#414651] border border-[#D5D7DA] rounded-md px-8 py-2.5 focus:ring-2 focus:ring-[#e8e9ec]"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-[#0b2e79] text-white rounded-md px-8 py-2.5 focus:ring-2 focus:ring-[#04173f] hover:bg-[#04173f]"
          >
            {SaveButton}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --------------------------------------------------------
// import { useForm } from "react-hook-form";
// import { X } from "lucide-react";
// export function Participant({ label, SaveButton }) {
//   const {
//     register,
//     handleSubmit,

//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => console.log(data);
//   return (
//     <>
//       <div className="w-[55%]  border">
//         <div className="flex justify-between">
//           <h1 className="text-[#181D27] text-lg font-bold leading-7 p-6">
//             {label}
//           </h1>
//           <button>
//             <X strokeWidth={2.25} />
//           </button>
//         </div>
//         <hr className="border-b border-[#D5D7DA] w-full" />

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="py-12 px-8 grid grid-cols-3 gap-8"
//         >
//           {/* --------Name------------ */}
//           <div>
//             <label className="block text-[#414651] text-sm font-medium leading-5 mb-1.5">
//               Enter Name
//             </label>
//             <input
//               placeholder="Enter Your Name"
//               {...register("Students_Fullname", {
//                 required: "Please Enter Enter Name",
//               })}
//               className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5"
//             />
//             {errors.Students_Fullname && (
//               <span className="text-xs text-red-600">
//                 {errors.Students_Fullname.message}
//               </span>
//             )}
//           </div>
//           {/* -------Email------------ */}
//           <div>
//             <label className=" block text-[#414651] text-sm font-medium leading-5 mb-1.5">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="Enter Your Mail"
//               {...register("Mail", {
//                 required: "Please Enter Mail",
//               })}
//               className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5"
//             />
//             {errors.Mail && (
//               <span className="text-xs text-red-600">
//                 {errors.Mail.message}
//               </span>
//             )}
//           </div>
//           {/* -------Employee ID------------ */}
//           <div>
//             <label className="block text-[#414651] text-sm font-medium leading-5 mb-1.5">
//               Employee ID
//             </label>
//             <input
//               type="number"
//               placeholder="Enter Your ID"
//               {...register("ID", {
//                 required: "Please Enter ID",
//               })}
//               className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5"
//             />
//             {errors.ID && (
//               <span className="text-xs text-red-600">{errors.ID.message}</span>
//             )}
//           </div>
//           {/* ---------Department------------ */}
//           <div>
//             <label className="block text-[#414651] text-sm font-medium leading-5 mb-1.5">
//               Department
//             </label>
//             <input
//               placeholder="Enter Your Department"
//               {...register("Department", {
//                 required: "Please Enter Department",
//               })}
//               className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5"
//             />
//             {errors.Department && (
//               <span className="text-xs text-red-600">
//                 {errors.Department.message}
//               </span>
//             )}
//           </div>
//           {/* --------------------- */}
//           {/* ---------Leadership Level------------ */}
//           <div>
//             <label className="text-[#414651] text-sm font-medium leading-5 flex mb-1.5">
//               Leadership Level
//             </label>

//             <select
//               {...register("Department")}
//               className="outline outline-[#D5D7DA] rounded-md px-3 py-2.5 w-full"
//             >
//               <option value="A">A</option>
//               <option value="B">B</option>
//               <option value="C">C</option>
//               <option value="D">D</option>
//             </select>
//           </div>
//         </form>
//         {/* ---------Footer------------ */}
//         <hr className="border-t border-[#D5D7DA] w-full" />
//         <div className="flex justify-end gap-3 p-4 ">
//           <button className="bg-white text-[#414651] font-semibold leading-5 border border-[#D5D7DA] rounded-md px-8 py-2.5 cursor-pointer hover:bg-[#f7f6f6] transition-all">
//             Cancel
//           </button>
//           <button className="bg-[#3B7FE6] text-white font-semibold leading-5 border border-[#D5D7DA] rounded-md px-8 py-2.5 cursor-pointer hover:bg-[#3b7fe694] transition-all">
//             {SaveButton}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// name: "Olivia Rhye",
//       employeeId: "EMP001",
//       email: "olivia@untitledui.com",
//       department: "Engineering",
//       leadershipLevel: "Leading the Organization",
//       dateAdded: "1/12/2025",
//       status: "Active",
