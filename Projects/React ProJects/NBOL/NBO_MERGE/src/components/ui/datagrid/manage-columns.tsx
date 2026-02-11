// import CustomButton from "@/components/button";
// import { Dialog } from "../dialog";
// import { Column } from "@tanstack/react-table";
// import { useState } from "react";
// import CustomInput from "@/components/inputs/custom-input";

// const ManageColumns = ({
//   columns,
//   onSave,
//   columnOrder,
// }: {
//   columns: Column<any>[];
//   onSave: (
//     columnVisibility: Record<string, boolean>,
//     columnOrder: string[]
//   ) => void;
//   columnOrder: string[];
// }) => {
//   const [updatedColumns, setUpdatedColumns] = useState<any[]>(() => {
//     let orderedCols: any[] = [];

//     if (columnOrder?.length) {
//       columnOrder.forEach((i: string) => {
//         columns?.forEach((item) => {
//           if (item.id === i) {
//             orderedCols.push({
//               id: item.id,
//               header: item.columnDef?.header as string,
//               visibility: item.getIsVisible(),
//             });
//           }
//         });
//       });
//     } else {
//       columns?.forEach((item) => {
//         orderedCols.push({
//           id: item.id,
//           header: item.columnDef?.header as string,
//           visibility: item.getIsVisible(),
//         });
//       });
//     }

//     return orderedCols;
//   });

//   const toggleAllColumns = () => {
//     setUpdatedColumns((prev) =>
//       prev.map((item) => ({ ...item, visibility: true }))
//     );
//   };

//   const toggleVisibilityHandler = (index: number, visibility: boolean) => {
//     setUpdatedColumns((prev) => {
//       let arr = JSON.parse(JSON.stringify(prev));
//       arr[index] = {
//         ...prev[index],
//         visibility,
//       };
//       return arr;
//     });
//   };

//   const reorderColumns = (indexA: number, demote: boolean = false) => {
//     setUpdatedColumns((prev) => {
//       let arr = JSON.parse(JSON.stringify(prev));
//       let indexB = demote ? indexA + 1 : indexA - 1;
//       let element = arr[indexB];
//       arr[indexB] = arr[indexA];
//       arr[indexA] = element;
//       return arr;
//     });
//   };

//   const onSaveChanges = (onClose: VoidFunction) => {
//     let columnVisibility: Record<string, boolean> = {};
//     let columnOrder: string[] = [];
//     for (const column of updatedColumns) {
//       columnVisibility[column.id] = column.visibility;
//       columnOrder.push(column.id);
//     }
//     onSave(columnVisibility, columnOrder);
//     onClose();
//   };

//   const ResetToDefault = (onClose: VoidFunction) => {
//     toggleAllColumns();
//     let columnVisibility: Record<string, boolean> = {};
//     let columnOrder: string[] = [];
//     for (const column of updatedColumns) {
//       columnVisibility[column.id] = true;
//     }
//     onSave(columnVisibility, columnOrder);
//     onClose();
//   };

//   return (
//     <Dialog
//       title={"Manage Columns"}
//       button={
//         <div>
//           <CustomButton
//             variant="outline"
//             className="border-[#BEC8D0] rounded px-4 h-10 text-neutral-600 hidden md:flex w-max"
//           >
//             <span>Manage Columns</span>
//           </CustomButton>
//         </div>
//       }
//       maxWidth="lg"
//       footer={(dialogProps: any) => {
//         const { onClose } = dialogProps;
//         return (
//           <div className="flex justify-end items-center">
//             <CustomButton onClick={onClose} variant="outline">
//               Close
//             </CustomButton>
//             <CustomButton
//               onClick={() => ResetToDefault(onClose)}
//               variant="outline"
//             >
//               Reset To Default
//             </CustomButton>
//             <CustomButton onClick={() => onSaveChanges(onClose)}>
//               Save Changes
//             </CustomButton>
//           </div>
//         );
//       }}
//     >
//       {() => {
//         return (
//           <div className="h-[calc(100%_-_71px)]">
//             <div className="px-4">
//               <div className="flex justify-between items-end mb-4">
//                 <h6 className="text-primary-text uppercase">Visible Columns</h6>
//                 <button className="me-2" onClick={() => toggleAllColumns()}>
//                   Show All Columns
//                 </button>
//               </div>
//               <div className="overflow-auto mb-5">
//                 <table className="w-full">
//                   <thead className="bg-secondary">
//                     <tr>
//                       <th
//                         className="py-2 font-medium text-start px-2 border-b"
//                         style={{ width: "50%", minWidth: "150px" }}
//                       >
//                         Column Header Name
//                       </th>
//                       <th
//                         className="py-2 font-medium text-start px-2 border-b"
//                         style={{ width: "15%", minWidth: "50px" }}
//                       >
//                         Order
//                       </th>
//                       <th
//                         className="py-2 font-medium text-start px-2 border-b"
//                         style={{ width: "35%" }}
//                       >
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {updatedColumns?.map((column, index: number) => (
//                       <tr key={column.id}>
//                         <td className="px-2 py-1 text-secondary-text font-normal border-b">
//                           {column.header}
//                         </td>
//                         <td className="px-2 py-1 text-secondary-text font-normal border-b">
//                           {index + 1}
//                         </td>
//                         <td className="px-2 py-1 text-secondary-text font-normal border-b">
//                           <div className="flex justify-start items-center gap-5">
//                             <CustomInput
//                               type="checkbox"
//                               // checked={column.visibility}
//                               onChange={(_: any, value: boolean) =>
//                                 toggleVisibilityHandler(index, value)
//                               }
//                               name="checkbox"
//                             />

//                             <div className="border-r py-3 mx-3"></div>

//                             {index !== 0 && (
//                               <>
//                                 <button
//                                   onClick={() => reorderColumns(index)}
//                                   className="block md:hidden"
//                                 >
//                                   ⬆
//                                 </button>
//                                 <button
//                                   className="me-2 border-0 md:flex hidden"
//                                   onClick={() => reorderColumns(index)}
//                                 >
//                                   Promote
//                                 </button>
//                               </>
//                             )}
//                             {index + 1 !== columns?.length && (
//                               <>
//                                 <button
//                                   onClick={() => reorderColumns(index, true)}
//                                   className="block md:hidden"
//                                 >
//                                   ⬇
//                                 </button>
//                                 <button
//                                   className="me-2 border-0 md:flex hidden"
//                                   onClick={() => reorderColumns(index, true)}
//                                 >
//                                   Demote
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         );
//       }}
//     </Dialog>
//   );
// };
// export default ManageColumns;
