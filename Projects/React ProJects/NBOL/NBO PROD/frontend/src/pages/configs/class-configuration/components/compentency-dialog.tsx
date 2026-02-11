import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { DialogFooter } from "@/components/ui/dialog";
import { CompetiencyInterface } from "@/interfaces/competency";
import { ColumnDef } from "@tanstack/react-table";

const CompetaencyDialog = ({
  handleClose,
  compitaincyData,
}: {
  handleClose: (item: boolean) => void;
  compitaincyData: any;
}) => {
  // ------------ colums ------------//
  const columns: ColumnDef<CompetiencyInterface>[] = [
    {
      header: "Competency",
      accessorKey: "competency",
      cell({ row }: { row: any }) {
        return row?.original?.competency_id
          ? row?.original?.competency_id?.competency
          : row.original?.competency || "";
      },
    },
  ];

  return (
    <div>
      <CustomDialog 
      title={"Marked Competencies"} 
      className={"max-w-[1116px] "}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose(false);
        }}
      >
        <div className='mt-[-40px]'>
          <Datagrid
            tableMetaDataKey='class-config-competency'
            columns={columns}
            disableFilters
            disableSearch
            data={compitaincyData}
          />
        </div>

        <DialogFooter className='py-4 mt-[-25px] px-6 border-t'>
          <div className='flex justify-end items-center gap-5'>
            <CustomButton onClick={() => handleClose(false)}>
              Close
            </CustomButton>
          </div>
        </DialogFooter>
      </CustomDialog>
    </div>
  );
};

export default CompetaencyDialog;
