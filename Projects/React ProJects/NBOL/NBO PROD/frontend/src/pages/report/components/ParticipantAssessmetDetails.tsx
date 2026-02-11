import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { AssessorColumnsInterface } from "@/interfaces/assessments";
import { ColumnDef } from "@tanstack/react-table";
import { LuEye } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ParticipantAssessmetDetails = ({
  Data,
  paricipant_id,
}: {
  Data: any;
  paricipant_id: string;
}) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log(state, "<------------ ");
  // ------------ colums ------------//
  const assessorColumns: ColumnDef<AssessorColumnsInterface>[] = [
    {
      header: "Assessment Name",
      accessorKey: "assessment_name",
      cell({ row }: { row: any }) {
        return row?.original?.gr_act_room
          ? row.original?.gr_act_room?.assessment?.assessment_name
          : row.original?.par_as?.assessment?.assessment_name || "";
      },
    },
    {
      header: "Scenario",
      accessorKey: "scenario",
      cell({ row }: { row: any }) {
        return row?.original?.gr_act_room?.scenerio
          ? row.original?.gr_act_room?.scenerio?.scenerio_name
          : row?.original?.par_as?.scenerio
            ? row.original?.par_as?.scenerio?.scenerio_name
            : row?.original?.par_as?.quessionnaire
              ? row?.original?.par_as?.quessionnaire?.quesionnaire_name
              : "";
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell({ row }: { row: any }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <Link
              to={{
                pathname: "/reports/participant-assessment-detail",
                search: "?viewOnly=true",
              }}
              state={{
                participant_assesment_id: row?.original?.gr_act_room
                  ? row?.original?.gr_act_room?.id
                  : row?.original?.par_as?.id,
                participant_name: state?.participant_name,
                participant_id_singleGet: paricipant_id,
                class_id: row.original?.class_id,
                assesment_id: row?.original?.gr_act_room
                  ? row?.original?.gr_act_room?.assessment?.id
                  : row?.original?.par_as?.assessment?.id,
                assessment: row?.original?.gr_act_room
                  ? `${row?.original?.gr_act_room?.assessment?.assessment_name} - (${row?.original?.gr_act_room?.scenerio?.scenerio_name})`
                  : `${row?.original?.par_as?.assessment?.assessment_name} - (${row?.original?.par_as?.scenerio?.scenerio_name})`,
                cohort_id: row?.original?.participant?.cohort_id,
                participant_id: paricipant_id,
                is_quesionnaire: row?.original?.par_as?.quessionnaire
                  ? true
                  : false,
                is_group_activity: row?.original?.gr_act_room ? true : false,
                client_id: row?.original?.participant?.client_id,
                grp_act_room_id: row.original?.gr_act_room?.id,
                single_get_object_id: row?.original?.par_as?.id,
                quessionnaire_id: row?.original?.par_as?.quessionnaire?.id,
                assessment_resp_id: row?.original?.id,
                status: "completed",
                type: row?.original?.gr_act_room ? "group_activity" : "normal",
              }}
            >
              <span
                className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
                onClick={() => {}}
              >
                <LuEye className='text-[#006F6D] size-[14px]' />
                View
              </span>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Datagrid
        onRowDoubleClick={(row: any) => {
          navigate("/reports/participant-assessment-detail?viewOnly=true", {
            state: {
              participant_assesment_id: row?.gr_act_room
                ? row?.gr_act_room?.id
                : row?.par_as?.id,
              participant_name: state?.participant_name,
              participant_id_singleGet: paricipant_id,
              class_id: row?.class_id,
              assesment_id: row?.gr_act_room
                ? row?.gr_act_room?.assessment?.id
                : row?.par_as?.assessment?.id,
              assessment: row?.gr_act_room
                ? `${row?.gr_act_room?.assessment?.assessment_name} - (${row?.gr_act_room?.scenerio?.scenerio_name})`
                : `${row?.par_as?.assessment?.assessment_name} - (${row?.par_as?.scenerio?.scenerio_name})`,
              cohort_id: row?.participant?.cohort_id,
              participant_id: paricipant_id,
              is_quesionnaire: row?.par_as?.quessionnaire ? true : false,
              is_group_activity: row?.gr_act_room ? true : false,
              client_id: row?.participant?.client_id,
              grp_act_room_id: row?.gr_act_room?.id,
              single_get_object_id: row?.par_as?.id,
              quessionnaire_id: row?.par_as?.quessionnaire?.id,
              assessment_resp_id: row?.id,
              status: "completed",
              type: row?.gr_act_room ? "group_activity" : "normal",
            },
          });
        }}
        disableFilters={true}
        tableMetaDataKey='participant-assessments-details'
        columns={assessorColumns}
        data={Data?.assessmResponse}
      ></Datagrid>
    </div>
  );
};

export default ParticipantAssessmetDetails;
