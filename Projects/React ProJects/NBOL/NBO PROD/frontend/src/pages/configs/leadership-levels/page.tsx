import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { useQuery } from "@/hooks/useQuerry";
import { ClientCreateInterface } from "@/interfaces/client";
import { NbolLeadershipLevelInterface } from "@/interfaces/common";
import { LeaderShipLevelInterface } from "@/interfaces/leadership-level";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { LuPen } from "react-icons/lu";
import { Link } from "react-router-dom";
import NbolDialog from "./components/NbolDialog";

const LeadershipLevelsPage = () => {
  //--------------- colums -------------//
  const Nbolcolumns: ColumnDef<LeaderShipLevelInterface>[] = [
    {
      header: "Leadership Levels",
      accessorKey: "leadership_level",
      cell({ row }) {
        return (
          <Link
            to={`/leadership-levels-configuration/${row?.original?.id}`}
            className='text-[#3B7FE6] font-medium underline'
          >
            {row?.original?.leadership_level}
          </Link>
        );
      },
    },

    {
      header: `Action`,
      accessorKey: "action",
      enableSorting: false,
      meta: {
        disableFilters: true,
      },
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <span
              className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
              onClick={() => {
                // eslint-disable-next-line
                setOpenLeadershipDialog(true);
                setSelectedNbolLeadershipRow(row?.original?.id);
                setSelectedRowData(row?.original);
              }}
            >
              <LuPen className='text-[#12B76A] size-[18px]' />
            </span>
            {/* <Separator
              orientation='vertical'
              className='!h-[15px] text-red-500'
            /> */}

            <DeleteItem
              endPoint={`/nbol-levels/${row?.original?.id}`}
              itemName={`${row?.original?.leadership_level}`}
              title='Delete Client Role Levels'
              refetchUrl={["/nbol-levels"]}
            />
          </div>
        );
      },
    },
  ];
  // const Clientcolumns: ColumnDef<ClientLeaderShipLevelInterface>[] = [
  //   {
  //     header: "Client Role Levels",
  //     accessorKey: "role",
  //   },
  //   {
  //     header: "Linked To NBOL Leadership Levels",
  //     accessorKey: "linked_to_nbol_leadership_levels",
  //     cell({ row }: { row: any }) {
  //       return row.original?.nbol?.leadership_level || "";
  //     },
  //   },
  //   {
  //     header: `Action`,
  //     accessorKey: "action",
  //     enableSorting: false,
  //     meta: {
  //       disableFilters: true,
  //     },
  //     cell({ row }) {
  //       return (
  //         <div className='flex justify-start items-center '>
  //           <DeleteItem
  //             endPoint={`/client-role/${row?.original?.id}`}
  //             itemName={`${row?.original?.role}`}
  //             title='Delete Client Role Levels'
  //             refetchUrl={[`/client-role/${selectedClient?.id}`]}
  //           />
  //         </div>
  //       );
  //     },
  //   },
  // ];

  //-------------- state handleling -----------------------//

  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] =
    useState<ClientCreateInterface | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [selectedNbolLeadershipRow, setSelectedNbolLeadershipRow] = useState<
    string | null
  >(null);
  const [openLeadershipDialog, setOpenLeadershipDialog] = useState(false);
  // const [tabValue, setTabValue] = useState<any>("0");
  // const [openUploadDialog, setOpenUploadDialog] = useState(false);

  //----------- api calls -------------//

  const { data: NbolLeadershipData } = useQuery<NbolLeadershipLevelInterface[]>(
    {
      queryKey: [`/nbol-levels`],
      select: (data: any) => data?.data?.data?.rows,
      enabled: true,
    },
  );

  //---------------- handle close functions ---------------//
  const handleClose = () => {
    setOpen(false);
  };

  const handleNbolDialogClose = () => {
    setOpenLeadershipDialog(false);
    setSelectedNbolLeadershipRow(null);
    setSelectedRowData(null);
  };

  // const handleUploadDialoagClose = () => {
  //   setOpenUploadDialog(false);
  // };

  return (
    <div>
      {/* <PageHeading>Leadership Levels</PageHeading> */}
      <AppBar
        title='Leadership Levels '
        subTitle='Add, Edit and Manage Leadership Levels'
      />
      {/* <CustomTab
        setValue={setTabValue}
        tabs={[
          { label: "NBOL", value: 0 },
          { label: "Client", value: 1 },
        ]}
        value={tabValue}
        className='flex items-center'
      /> */}

      {/* {tabValue == 0 && (
        <> */}
      <div className='mt-8'>
        <Datagrid
          title='Leadership Levels'
          onRowDoubleClick={(row: any) => {
            setOpenLeadershipDialog(true);
            setSelectedNbolLeadershipRow(row?.id);
            setSelectedRowData(row);
          }}
          tableMetaDataKey='leadership-levels-nbol-config'
          disableFilters
          columns={Nbolcolumns}
          url={"/nbol-levels"}
          extraButtons={
            <>
              <CustomButton onClick={() => setOpenLeadershipDialog(true)}>
                <Plus />
                Add New
              </CustomButton>
            </>
          }
        ></Datagrid>
      </div>
      {/* </>
      )} */}

      {/* {tabValue == 1 && (
        <>
          <div className='flex gap-5 mt-8 mb-10'>
            <SelectCommonOptions
              handleChange={setSelectedClient}
              required={true}
              handleDataChange={(client: ClientCreateInterface | null) => {
                setSelectedClient(client);
                localStorage.setItem("client", JSON.stringify(client));
              }}
              localStorageName='client'
              url='/client/getall-clients'
            />
          </div>
          <Datagrid
            tableMetaDataKey='leadership-levels-client-config'
            columns={Clientcolumns}
            url={selectedClient ? `/client-role/${selectedClient?.id}` : ""}
            disableFilters
            extraButtons={
              <>
                {selectedClient && (
                  <>
                    <CustomButton
                      variant='outline'
                      onClick={() => setOpenUploadDialog(true)}
                    >
                      <Upload />
                      Upload Role Levels
                    </CustomButton>

                    <CustomButton onClick={() => setOpen(true)}>
                      <Plus />
                      Add New
                    </CustomButton>
                  </>
                )}
              </>
            }
          ></Datagrid>
        </>
      )} */}

      {openLeadershipDialog && (
        <NbolDialog
          open={openLeadershipDialog}
          handleNbolDialogClose={handleNbolDialogClose}
          id={selectedNbolLeadershipRow ? selectedNbolLeadershipRow : undefined}
          row={selectedRowData}
        />
      )}

      {/* {openUploadDialog && (
        <UploadListDialoag
          handleClose={handleUploadDialoagClose}
          refetchQuire={`/client-role/${selectedClient?.id}`}
          url={`/client-role/upload-excel-file/${selectedClient?.id}`}
          title='Role Levels'
          nbolLeaderShipData={NbolLeadershipData}
          showNbolDropdown={true}
          downloadURL='client-role/download'
        />
      )} */}
    </div>
  );
};

export default LeadershipLevelsPage;
