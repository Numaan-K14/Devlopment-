// import { CustomDialog } from "@/components";
// import CustomButton from "@/components/button";
// import CustomInput from "@/components/inputs/custom-input";
// import { DialogFooter } from "@/components/ui/dialog";
// import { Form, Formik } from "formik";
// import { useState } from "react";

// const ScheduleDetailsDialog = ({
//   handleClose,
//   data,
// }: {
//   handleClose: any;
//   data: any;
// }) => {
//   const [initialValues, setInitialValues] = useState({
//     client_name: "",
//     class_name: "",
//     job_grade: "",
//     date: "",
//     time: "",
//     facility: "",
//     room_no: "",
//     assessment_name: "",
//     total_participants: "",
//   });
//   return (
//     <div>
//       <CustomDialog title={"Details"} className='!max-w-[1116px]'>
//         <Formik
//           initialValues={initialValues}
//           enableReinitialize
//           onSubmit={() => {}}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               <div className='pb-10 flex flex-wrap gap-14 '>
//                 <div className='flex gap-6 '>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput name='client_name' label='Client Name' />
//                   </div>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput name='class_name' label='Class Name' />
//                   </div>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput name='job_grade' label='Job Grade ' />
//                   </div>
//                 </div>
//                 <div className='flex gap-6 '>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput name='date' label='Date' />
//                   </div>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput name='time' label='Time' />
//                   </div>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput name='facility' label='Facility' />
//                   </div>
//                 </div>
//                 <div className='flex gap-6 '>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput name='room_no' label='Room No.' />
//                   </div>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput
//                       name='assessment_name'
//                       label='Assessment Name'
//                     />
//                   </div>
//                   <div className='!w-[335px] !h-[48px]'>
//                     <CustomInput
//                       name='total_participants'
//                       label='Total No. of Participants'
//                     />
//                   </div>
//                 </div>
//                 <div className='!w-[335px] !h-[48px] mb-10'>
//                   <CustomInput name='assessors' label='Assessors' />
//                 </div>
//               </div>
//               <DialogFooter className='py-4 mt-[-25px] px-6 border-t'>
//                 <div className='flex justify-end items-center gap-5'>
//                   <CustomButton onClick={() => handleClose(false)}>
//                     Close
//                   </CustomButton>
//                 </div>
//               </DialogFooter>
//             </Form>
//           )}
//         </Formik>
//       </CustomDialog>
//     </div>
//   );
// };

// export default ScheduleDetailsDialog;
import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { DialogFooter } from "@/components/ui/dialog";

const ScheduleDetailsDialog = ({ onClose, data, handleEventClick }: any) => {
  return (
    <CustomDialog title={"Classes on this Day"} className='!max-w-[1116px]'>
      <div className='mb-7 max-h-[400px] flex flex-wrap  gap-3 overflow-y-auto '>
        {data?.map((event: any, idx: number) => (
          <div
            key={idx}
            className='border rounded-xl p-3 w-[300px] hover:bg-gray-100 cursor-pointer bg-gray-50 shadow-sm'
            onClick={() => handleEventClick(event)}
          >
            <p className='text-sm font-medium'>
              Project: {event?.project_name || "-"}
            </p>
            <p className='text-sm'>Client: {event?.client_name || "-"}</p>
          </div>
        ))}
      </div>
      <DialogFooter className='py-4 mt-[-25px] px-6 border-t'>
        <div className='flex justify-end items-center gap-5'>
          <CustomButton onClick={() => onClose(false)}>Close</CustomButton>
        </div>
      </DialogFooter>
    </CustomDialog>
  );
};

export default ScheduleDetailsDialog;
