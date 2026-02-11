import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { CompetiencyInterface } from "@/interfaces/competency";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { LuPen } from "react-icons/lu";
import { Link } from "react-router-dom";
import CompetenciesDialog from "../competencies/components/CompetenciesDialog";

const NbolCompetenciesPage = () => {
  // ------------ colums ------------//
  const Nbolcolumns: ColumnDef<CompetiencyInterface>[] = [
    {
      header: "Leadership Levels",
      accessorKey: "leadership_level",
      cell({ row }) {
        return (
          <Link
            to={`/competencies-configuration/${row?.original?.nbol_leadership_level?.id}`}
            className='text-[#3B7FE6] underline'
          >
            {row?.original?.nbol_leadership_level?.leadership_level}
          </Link>
        );
      },
    },
    {
      header: "Competency",
      accessorKey: "competency",
    },

    {
      header: "Action",
      accessorKey: "Action",
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <span
              className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
              onClick={() => {
                setOpen(true);
                setSelectedRowData(row?.original);
              }}
            >
              <LuPen className='text-[#12B76A] size-[18px]' />
            </span>

            <DeleteItem
              endPoint={`/competency/${row?.original?.id}`}
              itemName={`${row?.original?.competency}`}
              title='Delete Competency'
              refetchUrl={[
                `/competency/nbol-leadership-level-nbol-filter/${selectedLeadershipLevel?.id}`,
              ]}
            />
          </div>
        );
      },
    },
  ];

  //-------- state management --------//
  const [open, setOpen] = useState(false);
  const [forClient, setForClient] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [selectedLeadershipLevel, setSelectedLeadershipLevel] =
    useState<any>(null);

  //-------- handle functions ---------//
  const handleClose = () => {
    setOpen(false);
    setSelectedRowData(null);
    setForClient(false);
  };

  return (
    <div>
      <AppBar
        title='Competency Management'
        subTitle='Add, Edit and Manage Competencies'
      />

      <div className='flex gap-6 mt-[16px]  mb-10'>
        <SelectCommonOptions
          handleChange={setSelectedLeadershipLevel}
          required={true}
          handleDataChange={(item: any | null) => {
            setSelectedLeadershipLevel(item);
            localStorage.setItem("leadership-level", JSON.stringify(item));
          }}
          localStorageName='leadership-level'
          url='/nbol-levels'
        />
      </div>
      <Datagrid
        title='Competencies'
        onRowDoubleClick={(row: any) => {
          setOpen(true);
          setSelectedRowData(row);
        }}
        tableMetaDataKey='competency-config'
        columns={Nbolcolumns}
        disableFilters
        url={
          selectedLeadershipLevel
            ? `/competency/nbol-leadership-level-nbol-filter/${selectedLeadershipLevel?.id}`
            : ""
        }
        extraButtons={
          <>
            {selectedLeadershipLevel && (
              <CustomButton onClick={() => setOpen(true)} variant='default'>
                <IoMdAdd />
                Add New
              </CustomButton>
            )}
          </>
        }
      />

      {open && (
        <CompetenciesDialog
          open={open}
          setOpen={setOpen}
          handleClose={handleClose}
          leadershipLevelId={selectedLeadershipLevel?.id}
          row={selectedRowData}
          refetchURL={`/competency/nbol-leadership-level-nbol-filter/${selectedLeadershipLevel?.id}`}
          forClient={forClient}
        />
      )}
    </div>
  );
};

export default NbolCompetenciesPage;
