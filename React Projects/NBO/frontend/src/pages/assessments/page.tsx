import AppBar from "@/components/app-bar";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import UploadPPtDialog from "@/components/upload-ppt";
import {
  AssessorColumnsInterface,
  ParticipantAssessmentColumnsInterface,
} from "@/interfaces/assessments";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { LuEye } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

const AssessmentsPage = () => {
  //---------------- COLUMS-------------------//
  const assessorColumns: ColumnDef<AssessorColumnsInterface>[] = [
    {
      header: "Actions",
      accessorKey: "actions",
      cell({ row }: { row: any }) {
        const hasQuestionnaire = !!row?.original?.quessionnaire_id;
        const isCompleted = row?.original?.participant_status === "completed";
        return (
          <div className='flex justify-start items-center gap-5'>
            {row?.original?.assessor_status === "pending" && (
              <>
                {hasQuestionnaire ? (
                  isCompleted ? (
                    row?.original?.assessor_status === "pending" && (
                      <Link
                        to={{ pathname: "/assessments/assess-now" }}
                        state={{
                          assessment:
                            row?.original?.assessment?.assessment_name,
                          participant_assesment_id: row?.original?.id,
                          participant_name:
                            row?.original?.participant?.participant_name,
                          class_id: row.original?.gr_act_part
                            ? row.original?.gr_act_part?.[0]?.participants
                                ?.cohorts?.class?.[0]?.id
                            : row.original?.participant?.cohorts?.class?.[0]
                                ?.id,
                          assesment_id: row.original?.assessment?.id,
                          assessors_id:
                            row?.original?.class_assessors?.[0]?.assessor?.id,
                          participant_id: row?.original?.participant?.id,
                          participant_id_singleGet:
                            row?.original?.participant?.id,
                          is_quesionnaire:
                            row?.original?.assessment?.is_quesionnaire,
                          cohort_id: row?.original?.participant?.cohort_id,
                          is_group_activity:
                            row?.original?.assessment?.is_group_activity,
                          client_id: row?.original?.participant?.client_id,
                          grp_act_room_id:
                            row.original?.gr_act_part?.[0]?.gr_act_rooms?.id,
                          single_get_object_id: row?.original?.id,
                          scenerio_id: row?.original?.scenerio?.id,
                          quessionnaire_id: row?.original?.quessionnaire?.id,
                          assessment_resp_id: row?.original?.as_res?.[0]?.id,
                        }}
                      >
                        <span className='text-[#2970FF]  underline cursor-pointer'>
                          Assess Now{" "}
                        </span>
                      </Link>
                    )
                  ) : (
                    <span className='text-[#94979c]  underline cursor-pointer'>
                      Participant has not submited his/her responce
                    </span>
                  )
                ) : (
                  row?.original?.assessor_status === "pending" && (
                    <Link
                      to={{ pathname: "/assessments/assess-now" }}
                      state={{
                        assessment: row?.original?.assessment?.assessment_name,
                        participant_assesment_id: row?.original?.id,
                        participant_name:
                          row?.original?.participant?.participant_name,
                        class_id: row.original?.gr_act_part
                          ? row.original?.gr_act_part?.[0]?.participants
                              ?.cohorts?.class?.[0]?.id
                          : row.original?.participant?.cohorts?.class?.[0]?.id,
                        assesment_id: row.original?.assessment?.id,
                        assessors_id:
                          row?.original?.class_assessors?.[0]?.assessor?.id,
                        participant_id: row?.original?.participant?.id,
                        participant_id_singleGet:
                          row?.original?.participant?.id,
                        is_quesionnaire:
                          row?.original?.assessment?.is_quesionnaire,
                        cohort_id: row?.original?.participant?.cohort_id,
                        is_group_activity:
                          row?.original?.assessment?.is_group_activity,
                        client_id: row?.original?.participant?.client_id,
                        grp_act_room_id:
                          row.original?.gr_act_part?.[0]?.gr_act_rooms?.id,
                        single_get_object_id: row?.original?.id,
                        scenerio_id: row?.original?.scenerio?.id,
                        quessionnaire_id: row?.original?.quessionnaire?.id,
                        assessment_resp_id: row?.original?.as_res?.[0]?.id,
                      }}
                    >
                      <span className='text-[#2970FF]  underline cursor-pointer'>
                        Assess Now{" "}
                      </span>
                    </Link>
                  )
                )}
                {/* <Link
                  to={{ pathname: "/assessments/assess-now" }}
                  state={{
                    assessment: row?.original?.assessment?.assessment_name,
                    participant_assesment_id: row?.original?.id,
                    participant_name:
                      row?.original?.participant?.participant_name,
                    class_id: row.original?.gr_act_part
                      ? row.original?.gr_act_part?.[0]?.participants?.cohorts
                          ?.class?.[0]?.id
                      : row.original?.participant?.cohorts?.class?.[0]?.id,
                    assesment_id: row.original?.assessment?.id,
                    assessors_id:
                      row?.original?.class_assessors?.[0]?.assessor?.id,
                    participant_id: row?.original?.participant?.id,
                    participant_id_singleGet: row?.original?.participant?.id,
                    is_quesionnaire: row?.original?.assessment?.is_quesionnaire,
                    cohort_id: row?.original?.participant?.cohort_id,
                    is_group_activity:
                      row?.original?.assessment?.is_group_activity,
                    client_id: row?.original?.participant?.client_id,
                    grp_act_room_id:
                      row.original?.gr_act_part?.[0]?.gr_act_rooms?.id,
                    single_get_object_id: row?.original?.id,
                    scenerio_id: row?.original?.scenerio?.id,
                    quessionnaire_id: row?.original?.quessionnaire?.id,
                    assessment_resp_id: row?.original?.as_res?.[0]?.id,
                  }}
                >
                  <span className='text-[#2970FF]  underline cursor-pointer'>
                    Assess Now{" "}
                  </span>
                </Link> */}
              </>
            )}
            {row?.original?.assessor_status === "inprogress" && (
              <Link
                to={{ pathname: "/assessments/assess-now" }}
                state={{
                  participant_assesment_id: row?.original?.id,
                  participant_name:
                    row?.original?.participant?.participant_name,
                  participant_id_singleGet: row?.original?.participant?.id,
                  class_id: row.original?.gr_act_part
                    ? row.original?.gr_act_part?.[0]?.participants?.cohorts
                        ?.class?.[0]?.id
                    : row.original?.participant?.cohorts?.class?.[0]?.id,
                  assesment_id: row.original?.assessment?.id,
                  assessment: row?.original?.assessment?.assessment_name,
                  participant_id: row?.original?.participant?.id,
                  assessors_id:
                    row?.original?.class_assessors?.[0]?.assessor?.id,
                  cohort_id: row?.original?.participant?.cohort_id,
                  is_quesionnaire: row?.original?.assessment?.is_quesionnaire,
                  is_group_activity:
                    row?.original?.assessment?.is_group_activity,
                  client_id: row?.original?.participant?.client_id,
                  grp_act_room_id:
                    row.original?.gr_act_part?.[0]?.gr_act_rooms?.id,
                  single_get_object_id: row?.original?.id,
                  scenerio_id: row?.original?.scenerio?.id,
                  quessionnaire_id: row?.original?.quessionnaire?.id,
                  assessment_resp_id: row?.original?.as_res?.[0]?.id,
                }}
              >
                <span
                  className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
                  onClick={() => {
                    // eslint-disable-next-line
                  }}
                >
                  <BiEditAlt className='text-[#006F6D] size-[14px]' />
                  Edit
                </span>
              </Link>
            )}
            {row?.original?.assessor_status === "completed" && (
              <Link
                to={{ pathname: "/assessments/assess-now" }}
                state={{
                  participant_assesment_id: row?.original?.id,
                  participant_name:
                    row?.original?.participant?.participant_name,
                  participant_id_singleGet: row?.original?.participant?.id,
                  class_id: row.original?.gr_act_part
                    ? row.original?.gr_act_part?.[0]?.participants?.cohorts
                        ?.class?.[0]?.id
                    : row.original?.participant?.cohorts?.class?.[0]?.id,
                  assesment_id: row.original?.assessment?.id,
                  assessment: row?.original?.assessment?.assessment_name,
                  cohort_id: row?.original?.participant?.cohort_id,
                  participant_id: row?.original?.participant?.id,
                  assessors_id:
                    row?.original?.class_assessors?.[0]?.assessor?.id,
                  is_quesionnaire: row?.original?.assessment?.is_quesionnaire,
                  is_group_activity:
                    row?.original?.assessment?.is_group_activity,
                  client_id: row?.original?.participant?.client_id,
                  grp_act_room_id:
                    row.original?.gr_act_part?.[0]?.gr_act_rooms?.id,
                  single_get_object_id: row?.original?.id,
                  scenerio_id: row?.original?.scenerio?.id,
                  quessionnaire_id: row?.original?.quessionnaire?.id,
                  assessment_resp_id: row?.original?.as_res?.[0]?.id,
                  status: "completed",
                }}
              >
                <span
                  className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
                  onClick={() => {
                    // eslint-disable-next-line
                  }}
                >
                  <LuEye className='text-[#006F6D] size-[14px]' />
                  View
                </span>
              </Link>
            )}
          </div>
        );
      },
    },
    {
      header: "Client",
      accessorKey: "client_name",
      cell({ row }: { row: any }) {
        return row.original?.gr_act_part
          ? row.original?.gr_act_part?.[0]?.participants?.cohorts?.class?.[0]
              ?.client?.client_name
          : row.original?.participant?.cohorts?.class?.[0]?.client
              ?.client_name || "";
      },
    },
    {
      header: "Participants",
      accessorKey: "participants",
      cell({ row }: { row: any }) {
        return row.original?.gr_act_part
          ? "Group of " + row.original?.gr_act_part?.length + " Participants"
          : row.original?.participant?.participant_name || "";
      },
    },
    {
      header: "Activity Name",
      accessorKey: "assessment_name",
      cell({ row }: { row: any }) {
        return row.original?.assessment?.assessment_name || "";
      },
    },
    {
      header: "Case",
      accessorKey: "scenario",
      cell({ row }: { row: any }) {
        return row?.original?.scenerio
          ? row.original?.scenerio?.scenerio_name
          : row?.original?.quessionnaire
            ? row?.original?.quessionnaire?.quesionnaire_name
            : "";
      },
    },
    // {
    //   header: "Room Name",
    //   accessorKey: "room_name",
    //   cell({ row }: { row: any }) {
    //     return row.original?.room?.room || "-";
    //   },
    // },
    {
      header: "Date",
      accessorKey: "date",
      cell({ row }: { row: any }) {
        return (
          moment(
            row.original?.participant?.client?.classes?.[0]?.start_date,
          ).format("DD/MM/YYYY") || ""
        );
      },
    },
  ];

  const participantColumns: ColumnDef<ParticipantAssessmentColumnsInterface>[] =
    [
      {
        header: "Activity Name",
        accessorKey: "assessment_name",
        cell({ row }: { row: any }) {
          return row?.original?.gr_act_rooms
            ? row?.original?.gr_act_rooms?.assessment?.assessment_name
            : row.original?.assessment?.assessment_name || "";
        },
      },
      {
        header: "Case",
        accessorKey: "scenario",
        cell({ row }: { row: any }) {
          // console.log(row?.original, "<-------------- row");
          const fileLocation = row.original?.scenerio?.file_location;

          return row?.original?.assessment?.assessment_name ===
            "Business Case" ? (
            <button
              className='text-green-600 underline'
              onClick={(e) => {
                e.preventDefault();
                const pdfUrl = `${process.env.REACT_APP_API_BASE_URL}${fileLocation.replace(
                  "/home/ubuntu/nbo-class/backend/public",
                  "",
                )}`;
                window.open(pdfUrl, "_blank");
              }}
            >
              {/* {row.original?.scenerio?.scenerio_name} */}
              <div className='flex gap-1 items-center'>
                <LuEye className='size-4' /> View Scenario
              </div>
            </button>
          ) : row?.original?.gr_act_rooms ? (
            row?.original?.gr_act_rooms?.scenerio?.scenerio_name
          ) : row?.original?.scenerio ? (
            row.original?.scenerio?.scenerio_name
          ) : row?.original?.quessionnaire ? (
            row?.original?.quessionnaire?.quesionnaire_name
          ) : (
            ""
          );
        },
      },
      {
        header: "Room",
        accessorKey: "room",
        cell({ row }: { row: any }) {
          return row?.original?.gr_act_rooms
            ? row?.original?.gr_act_rooms?.room?.room
            : row.original?.room?.room || "-";
        },
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell({ row }: { row: any }) {
          return (
            <div className='flex justify-start items-center gap-5'>
              {row?.original?.assessment?.is_quesionnaire &&
                row?.original?.assessment?.is_cbi === false &&
                (row?.original?.participant_status === "pending" ||
                  row?.original?.participant_status === "inprogress") && (
                  <>
                    <Link
                      to={{ pathname: "/assessments/assess-now" }}
                      state={{
                        assessment: row?.original?.assessment?.assessment_name,
                        assessors_id:
                          row?.original?.class_assessors?.[0]?.assessors_id,
                        participant_name:
                          row?.original?.participant?.participant_name,
                        cohort_id: row?.original?.participant?.cohorts?.id,
                        class_id:
                          row.original?.participant?.cohorts?.class?.[0]?.id,
                        assesment_id: row.original?.assessment?.id,
                        quessionnaire_id: row?.original?.quessionnaire?.id,
                        participant_id: row?.original?.participant?.id,
                        is_quesionnaire:
                          row?.original?.assessment?.is_quesionnaire,
                        client_id:
                          row.original?.participant?.cohorts?.class?.[0]
                            ?.client_id,
                        participant_id_singleGet:
                          row?.original?.participant?.id,
                        single_get_object_id: row?.original?.id,
                        assessment_resp_id: row?.original?.as_res?.[0]?.id,
                      }}
                    >
                      <span className='text-[#2970FF]  underline cursor-pointer'>
                        {row?.original?.participant_status === "pending" ? (
                          "Start Assessment"
                        ) : (
                          <span
                            className='flex gap-1 items-center  cursor-pointer text-[#006F6D]'
                            onClick={() => {
                              // eslint-disable-next-line
                            }}
                          >
                            <BiEditAlt className='text-[#006F6D] size-[14px]' />
                            Edit
                          </span>
                        )}
                      </span>
                    </Link>
                  </>
                )}
              {/* 
            {row?.original?.assessment?.is_quesionnaire === false &&
              (() => {
                const fullPath =
                  row?.original?.assessment?.client_assessments[0]?.scenerio
                    ?.file_location;
                const url = fullPath?.split("public").slice(-1).join("");

                const downloadUrl = `${process.env.REACT_APP_API_BASE_URL}/${url}`;

                if (row?.original?.assess_now === true) {
                  return (
                    <a
                      href={downloadUrl}
                      download
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span className='flex gap-1 items-center cursor-pointer text-[#006F6D]'>
                        <LuEye className='text-[#006F6D] size-[14px]' />
                        View Pdf
                      </span>
                    </a>
                  );
                } else {
                  return (
                    <span className='flex gap-1 items-center cursor-pointer text-[#a2aaaa]'>
                      <LuEye className='text-[#a2aaaa] size-[14px]' />
                      Download Pdf
                    </span>
                  );
                }
                  
              })()} */}

              {row?.original?.assessment?.is_cbi === true &&
                (row?.original?.participant?.cbi_status === "completed" ? (
                  <p className='flex gap-1 items-center  text-[#a2aaaa]'>
                    Assessment Completed
                  </p>
                ) : (
                  <Link
                    to={"/cbi/cbi-assessment"}
                    className='text-[#2970FF]  underline cursor-pointer'
                  >
                    {row?.original?.participant?.cbi_status === "pending"
                      ? "Start Assessment"
                      : row?.original?.participant?.cbi_status ===
                            "inprogress" ||
                          row?.original?.participant?.cbi_status === "paused"
                        ? "Continue Assessment"
                        : ""}
                  </Link>
                ))}
              {((row?.original?.assessment?.is_quesionnaire === false &&
                row?.original?.assessment?.assessment_name !==
                  "Business Case") ||
                row?.original?.gr_act_rooms) && (
                <span className='flex gap-1 items-center  text-[#a2aaaa]'>
                  Collect from assesor
                </span>
              )}

              {row?.original?.assessment?.assessment_name ===
                "Business Case" && (
                <span
                  onClick={() => {
                    setOpenUploadDialog(true);
                    setId(row?.original?.id);
                    SetFilePath(row?.original?.ppt_path);
                  }}
                  className='flex gap-1 items-center cursor-pointer text-blue-600 underline'
                >
                  {row?.original?.ppt_path !== null
                    ? "Re-Upload PPT"
                    : "Upload PPT"}
                </span>
              )}

              {row?.original?.assessment?.is_quesionnaire === true &&
                row?.original?.participant_status === "completed" &&
                !row?.original?.assessment?.is_cbi && (
                  <Link
                    to={{ pathname: "/assessments/assess-now" }}
                    state={{
                      // assessment: row?.original?.assessment?.assessment_name,
                      // participant_id: row?.original?.participant?.id,
                      // assesment_id: row.original?.assessment?.id,
                      // cohort_id: row?.original?.participant?.cohort_id,
                      // participant_name:
                      //   row?.original?.participant?.participant_name,
                      // participant_id_singleGet: row?.original?.participant?.id,
                      // class_id:
                      //   row.original?.participant?.cohorts?.class?.[0]?.client
                      //     ?.id,
                      // is_quesionnaire:
                      //   row?.original?.assessment?.is_quesionnaire,
                      // status: "completed",
                      // client_id: row?.original?.participant?.client_id,
                      // single_get_object_id: row?.original?.id,
                      // quessionnaire_id: row?.original?.quessionnaire?.id,
                      // assessment_resp_id: row?.original?.as_res?.[0]?.id,
                      assessment: row?.original?.assessment?.assessment_name,
                      assessors_id:
                        row?.original?.class_assessors?.[0]?.assessors_id,
                      participant_name:
                        row?.original?.participant?.participant_name,
                      cohort_id: row?.original?.participant?.cohorts?.id,
                      class_id:
                        row.original?.participant?.cohorts?.class?.[0]?.id,
                      assesment_id: row.original?.assessment?.id,
                      quessionnaire_id: row?.original?.quessionnaire?.id,
                      participant_id: row?.original?.participant?.id,
                      is_quesionnaire:
                        row?.original?.assessment?.is_quesionnaire,
                      client_id:
                        row.original?.participant?.cohorts?.class?.[0]
                          ?.client_id,
                      participant_id_singleGet: row?.original?.participant?.id,
                      single_get_object_id: row?.original?.id,
                      assessment_resp_id: row?.original?.as_res?.[0]?.id,
                      status: "completed",
                    }}
                  >
                    <span className='flex gap-1 items-center cursor-pointer text-blue-600'>
                      <LuEye className='text-blue-600 size-[14px]' />
                      View Submitted Response
                    </span>
                  </Link>
                )}
            </div>
          );
        },
      },
    ];

  //---------- STATE MANAGEMENT ----------------//
  const navigate = useNavigate();
  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;
  const [selectedClient, setSelectedClient] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [id, setId] = useState<any>(null);
  const [filePath, SetFilePath] = useState<string>();

  const handleUploadDialoagClose = () => {
    setOpenUploadDialog(false);
  };
  //---------------------- datagrid url ---------------//
  let datagridUrlForAssessor = `/class/participants-assessments/${user?.assessor_id}`;
  if (selectedClient?.id && selectedProject?.id && selectedCohort?.id) {
    datagridUrlForAssessor = `/class/participants-assessments/${user?.assessor_id}?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`;
  } else if (selectedClient?.id && selectedProject?.id) {
    datagridUrlForAssessor = `/class/participants-assessments/${user?.assessor_id}?client_id=${selectedClient.id}&project_id=${selectedProject.id}`;
  } else if (selectedClient?.id) {
    datagridUrlForAssessor = `/class/participants-assessments/${user?.assessor_id}?client_id=${selectedClient.id}`;
  }

  return (
    <div>
      {/* <PageHeading>Assessments</PageHeading> */}
      <AppBar
        title='Assessment'
        subTitle='Access, start, or review your assessment tasks.'
      />
      {(user?.role === "assessor" || user?.role === "admin") && (
        <div className='flex flex-wrap gap-5 mb-10'>
          <SelectCommonOptions
            handleChange={setSelectedClient}
            required={true}
            key={selectedClient?.id}
            handleDataChange={(client: ClientCreateInterface | null) => {
              setSelectedClient(client);
              localStorage.setItem("client", JSON.stringify(client));
              if (
                selectedClient &&
                selectedClient?.id !==
                  JSON.parse(localStorage.getItem("client") ?? "")?.id
              ) {
                setSelectedProject(null);
                localStorage.removeItem("project");
                localStorage.removeItem("cohort");
              }
            }}
            localStorageName='client'
            url='/client/getall-clients'
          />

          {selectedClient && (
            <SelectCommonOptions
              key={selectedProject?.id}
              handleDataChange={(project: ProjectConfigInterface | null) => {
                setSelectedProject(project);
                localStorage.setItem("project", JSON.stringify(project));
                if (
                  selectedProject &&
                  selectedProject?.id !==
                    JSON.parse(localStorage.getItem("project") ?? "")?.id
                ) {
                  setSelectedCohort(null);
                  localStorage.removeItem("cohort");
                }
              }}
              required={true}
              localStorageName='project'
              url={`/projects/client-projects/${selectedClient?.id}`}
            />
          )}
          {selectedClient && selectedProject && (
            <SelectCommonOptions
              key={selectedCohort?.id}
              handleDataChange={(cohort: CohortInterface | null) => {
                setSelectedCohort(cohort);
                localStorage.setItem("cohort", JSON.stringify(cohort));
              }}
              required={true}
              localStorageName='cohort'
              url={`/participant/get-project-cohorts/${selectedProject?.id}`}
            />
          )}
        </div>
      )}
      <Datagrid
        // onRowDoubleClick={(row: any) => {
        //   if (
        //     row?.assessor_status === "pending" &&
        //     row?.participant_status === "completed" &&
        //     !!row?.quessionnaire_id &&
        //     user?.role === "assessor"
        //   ) {
        //     navigate(`/assessments/assess-now`, {
        //       state: {
        //         assessment: row?.assessment?.assessment_name,
        //         participant_assesment_id: row?.id,
        //         participant_name: row?.participant?.participant_name,
        //         class_id: row?.gr_act_part
        //           ? row?.gr_act_part?.[0]?.participants?.cohorts?.class?.[0]?.id
        //           : row?.participant?.cohorts?.class?.[0]?.id,
        //         assesment_id: row?.assessment?.id,
        //         assessors_id: row?.class_assessors?.[0]?.assessor?.id,
        //         participant_id: row?.participant?.id,
        //         participant_id_singleGet: row?.participant?.id,
        //         is_quesionnaire: row?.assessment?.is_quesionnaire,
        //         cohort_id: row?.participant?.cohort_id,
        //         is_group_activity: row?.assessment?.is_group_activity,
        //         client_id: row?.participant?.client_id,
        //         grp_act_room_id: row?.gr_act_part?.[0]?.gr_act_rooms?.id,
        //         single_get_object_id: row?.id,
        //         scenerio_id: row?.scenerio?.id,
        //         quessionnaire_id: row?.quessionnaire?.id,
        //         assessment_resp_id: row?.as_res?.[0]?.id,
        //       },
        //     });
        //   } else if (
        //     row?.assessor_status === "pending" &&
        //     user?.role === "assessor"
        //   ) {
        //     navigate(`/assessments/assess-now`, {
        //       state: {
        //         assessment: row?.assessment?.assessment_name,
        //         participant_assesment_id: row?.id,
        //         participant_name: row?.participant?.participant_name,
        //         class_id: row?.gr_act_part
        //           ? row?.gr_act_part?.[0]?.participants?.cohorts?.class?.[0]?.id
        //           : row?.participant?.cohorts?.class?.[0]?.id,
        //         assesment_id: row?.assessment?.id,
        //         assessors_id: row?.class_assessors?.[0]?.assessor?.id,
        //         participant_id: row?.participant?.id,
        //         participant_id_singleGet: row?.participant?.id,
        //         is_quesionnaire: row?.assessment?.is_quesionnaire,
        //         cohort_id: row?.participant?.cohort_id,
        //         is_group_activity: row?.assessment?.is_group_activity,
        //         client_id: row?.participant?.client_id,
        //         grp_act_room_id: row?.gr_act_part?.[0]?.gr_act_rooms?.id,
        //         single_get_object_id: row?.id,
        //         scenerio_id: row?.scenerio?.id,
        //         quessionnaire_id: row?.quessionnaire?.id,
        //         assessment_resp_id: row?.as_res?.[0]?.id,
        //       },
        //     });
        //   } else if (
        //     row?.assessor_status === "inprogress" &&
        //     user?.role === "assessor"
        //   ) {
        //     navigate(`/assessments/assess-now`, {
        //       state: {
        //         participant_assesment_id: row?.id,
        //         participant_name: row?.participant?.participant_name,
        //         participant_id_singleGet: row?.participant?.id,
        //         class_id: row?.gr_act_part
        //           ? row?.gr_act_part?.[0]?.participants?.cohorts?.class?.[0]?.id
        //           : row?.participant?.cohorts?.class?.[0]?.id,
        //         assesment_id: row?.assessment?.id,
        //         assessment: row?.assessment?.assessment_name,
        //         participant_id: row?.participant?.id,
        //         assessors_id: row?.class_assessors?.[0]?.assessor?.id,
        //         cohort_id: row?.participant?.cohort_id,
        //         is_quesionnaire: row?.assessment?.is_quesionnaire,
        //         is_group_activity: row?.assessment?.is_group_activity,
        //         client_id: row?.participant?.client_id,
        //         grp_act_room_id: row?.gr_act_part?.[0]?.gr_act_rooms?.id,
        //         single_get_object_id: row?.id,
        //         scenerio_id: row?.scenerio?.id,
        //         quessionnaire_id: row?.quessionnaire?.id,
        //         assessment_resp_id: row?.as_res?.[0]?.id,
        //       },
        //     });
        //   } else if (
        //     row?.assessor_status === "completed" &&
        //     user?.role === "assessor"
        //   ) {
        //     navigate(`/assessments/assess-now`, {
        //       state: {
        //         participant_assesment_id: row?.id,
        //         participant_name: row?.participant?.participant_name,
        //         participant_id_singleGet: row?.participant?.id,
        //         class_id: row?.gr_act_part
        //           ? row?.gr_act_part?.[0]?.participants?.cohorts?.class?.[0]?.id
        //           : row?.participant?.cohorts?.class?.[0]?.id,
        //         assesment_id: row?.assessment?.id,
        //         assessment: row?.assessment?.assessment_name,
        //         cohort_id: row?.participant?.cohort_id,
        //         participant_id: row?.participant?.id,
        //         assessors_id: row?.class_assessors?.[0]?.assessor?.id,
        //         is_quesionnaire: row?.assessment?.is_quesionnaire,
        //         is_group_activity: row?.assessment?.is_group_activity,
        //         client_id: row?.participant?.client_id,
        //         grp_act_room_id: row?.gr_act_part?.[0]?.gr_act_rooms?.id,
        //         single_get_object_id: row?.id,
        //         scenerio_id: row?.scenerio?.id,
        //         quessionnaire_id: row?.quessionnaire?.id,
        //         assessment_resp_id: row?.as_res?.[0]?.id,
        //         status: "completed",
        //       },
        //     });
        //   } else if (
        //     user?.role === "participant" &&
        //     row?.assessment?.is_quesionnaire &&
        //     (row?.participant_status === "pending" ||
        //       row?.participant_status === "inprogress")
        //   ) {
        //     navigate("/assessments/assess-now", {
        //       state: {
        //         assessment: row?.assessment?.assessment_name,
        //         assessors_id: row?.class_assessors?.[0]?.assessors_id,
        //         participant_name: row?.participant?.participant_name,
        //         cohort_id: row?.participant?.cohort_id,
        //         class_id: row?.participant?.cohorts?.class?.[0]?.id,
        //         assesment_id: row?.assessment?.id,
        //         quessionnaire_id: row?.quessionnaire?.id,
        //         participant_id: row?.participant?.id,
        //         is_quesionnaire: row?.assessment?.is_quesionnaire,
        //         client_id: row?.participant?.client_id,
        //         participant_id_singleGet: row?.participant?.id,
        //         single_get_object_id: row?.id,
        //         assessment_resp_id: row?.as_res?.[0]?.id,
        //       },
        //     });
        //   } else if (
        //     user?.role === "participant" &&
        //     row?.assessment?.is_quesionnaire === true &&
        //     row?.participant_status === "completed"
        //   ) {
        //     navigate("/assessments/assess-now", {
        //       state: {
        //         assessment: row?.assessment?.assessment_name,
        //         participant_id: row?.participant?.id,
        //         assesment_id: row?.assessment?.id,
        //         cohort_id: row?.participant?.cohort_id,
        //         participant_name: row?.participant?.participant_name,
        //         participant_id_singleGet: row?.participant?.id,
        //         class_id: row?.participant?.cohorts?.class?.[0]?.client?.id,
        //         is_quesionnaire: row?.assessment?.is_quesionnaire,
        //         status: "completed",
        //         client_id: row?.participant?.client_id,
        //         single_get_object_id: row?.id,
        //         quessionnaire_id: row?.quessionnaire?.id,
        //         assessment_resp_id: row?.as_res?.[0]?.id,
        //       },
        //     });
        //   }
        // }}

        title='Assessments'
        disableFilters={true}
        disablePagination={user?.role === "participant" ? true : false}
        disableSearch={user?.role === "participant" ? true : false}
        tableMetaDataKey='assessments-table'
        columns={
          user?.role === "participant"
            ? participantColumns
            : user?.role === "assessor"
              ? assessorColumns
              : assessorColumns
        }
        url={
          user?.assessor_id
            ? datagridUrlForAssessor
            : `class/client-all-assessmnets-scenerio-quess/${user?.participant_id}/${user?.email}`
        }
      ></Datagrid>
      {openUploadDialog && (
        <UploadPPtDialog
          handleClose={handleUploadDialoagClose}
          refetchQuire={`class/client-all-assessmnets-scenerio-quess/${user?.participant_id}/${user?.email}`}
          url={`/class/upload-ppt`}
          title='Upload PPT'
          Id={id}
          data={filePath}
        />
      )}
    </div>
  );
};

export default AssessmentsPage;
