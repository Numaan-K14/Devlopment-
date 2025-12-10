import { ButtonFooter, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import ConflictChip from "@/components/conflict-chip";
import { CustomLoader } from "@/components/custom-loader";
import AlertComponent from "@/components/error-alert";
import { DatePickerWithRange } from "@/components/inputs";
import CustomSelect from "@/components/inputs/custom-select";
import SuccessDialog from "@/components/SuccessDialog";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { AssessorsInterface } from "@/interfaces/assessors";
import { ClassColumeInterface } from "@/interfaces/class";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { CompetiencyInterface } from "@/interfaces/competency";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { format } from "date-fns";
import CompetaencyDialog from "pages/configs/class-configuration/components/compentency-dialog";
import GroupActivityDetailsDialoag from "pages/configs/class-configuration/components/group-activity-dialoag";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { BiEditAlt } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DetailsUpdateDialoag from "../components/details-update-dialoag";

const SingleConfiguredClasses = () => {
  //----------- colums --------------//
  const columns: ColumnDef<ClassColumeInterface>[] = [
    {
      header: "Assessment Name",
      accessorKey: "assessment_name",
      cell({ row }: { row: any }) {
        return (
          <span className='flex items-center gap-2'>
            {row.original?.assessment?.display_name}
          </span>
        );
      },
    },
    {
      header: "Competency List",
      accessorKey: "competency",
      cell({ row }: { row: any }) {
        return (
          <p
            className='underline text-[#2970FF] cursor-pointer'
            onClick={() => {
              setOpenCompetiencyDialog(true);
            }}
          >
            Marked Competencies
          </p>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell({ row }: { row: any }) {
        return (
          <ConflictChip
            title={
              conflictRowKeys.includes(row?.original?.id)
                ? "Conflict"
                : "No Conflict"
            }
          />
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
              className={`flex gap-1 items-center cursor-pointer text-[#006F6D]
              } `}
              onClick={() => {
                setSelectedAssesment(row?.original);
                setSelectedAssesmentName(
                  row?.original?.assessment?.display_name,
                );
                if (row?.original?.assessment?.is_quesionnaire === true) {
                  setIsQuesionnaireTrue(true);
                }
                if (
                  formData?.[row?.original?.id] &&
                  formData[row?.original?.id]
                ) {
                  setUpdateData(formData[row?.original?.id]);
                  if (row?.original?.assessment?.is_group_activity === true) {
                    setGroupActivityDialogOpen(true);
                  } else {
                    setOpen(true);
                  }
                } else if (
                  facilityData &&
                  rowData?.client &&
                  !formData?.[row?.original?.id]
                ) {
                  if (row?.original?.assessment?.is_group_activity === true) {
                    setGroupActivityDialogOpen(true);
                  } else {
                    setOpen(true);
                  }
                }
              }}
            >
              <BiEditAlt className={` text-[#006F6D] size-[14px]`} />
              Edit
            </span>
            {/* )} */}
          </div>
        );
      },
    },
  ];

  const { state } = useLocation();
  const navigate = useNavigate();
  const rowData = state?.data;

  //-------- state management --------//
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [groupActivityDialogOpen, setGroupActivityDialogOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [data, setData] = useState<any>();
  const [updateData, setUpdateData] = useState<any>();
  const [assesmentData, setAssesmentData] = useState<any>();
  const [facilityData, setFacilityData] = useState<any>();
  const [selectedAssesment, setSelectedAssesment] = useState<any>();
  const [selectedAssesmentName, setSelectedAssesmentName] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [openCompetiencyDialog, setOpenCompetiencyDialog] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: rowData?.start_date,
    to: rowData?.end_date,
  });
  const [conflicts, setConflicts] = useState<any[]>();
  const [isQuesionnaireTrue, setIsQuesionnaireTrue] = useState<any>();
  const [conflictRowKeys, setConflictRowKeys] = useState<string[]>([]);
  const [isGroupActivity, setIsGroupActivity] = useState<string>();
  const [isQuesionnaire, setIsQuesionnaire] = useState<string>();
  const [quesionnaireId, setQuesionnaireId] = useState<string>();
  const [assessorsConflicts, setAssessorsConflicts] = useState<any[]>([]);
  const [backendAssessorsConflicts, setBackendAssessorsConflicts] = useState<
    any[]
  >([]);
  const [backendError, setBackendError] = useState<string>("");

  //------------ API CALLS ----------//

  const { data: Data } = useQuery<any>({
    queryKey: [
      `assessment/class-configration-details/${rowData?.client?.id}/${rowData?.cohort?.id}`,
    ],
    select: (data: any) => data?.data?.data?.rows[0],
    enabled: !!rowData?.client?.id && !!rowData?.cohort?.id,
  });

  const { data: CompiteancyData } = useQuery<CompetiencyInterface[]>({
    queryKey: [`/competency/client-all-competencies/${rowData?.client?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!rowData?.client?.id,
  });

  const { data: ClientData } = useQuery<ClientCreateInterface[]>({
    queryKey: ["/client/getall-clients"],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  const { data: ProjectData } = useQuery<ProjectConfigInterface[]>({
    queryKey: [`/projects/client-projects/${rowData?.client?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!rowData?.client?.id,
  });

  const { data: CohortData } = useQuery<CohortInterface[]>({
    queryKey: [`/participant/get-project-cohorts/${rowData?.project?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!rowData?.project?.id,
  });

  const { data: AssessorsData } = useQuery<AssessorsInterface[]>({
    queryKey: [`/assessors/active-assessors`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/class/${rowData?.client?.id}/${rowData?.cohort?.id}`, data),
    onSuccess: (data) => {
      toast.success(data.data.msg || "Successfully Created Class!");

      setSuccessDialog(true);
      setDate(undefined);
      setFacilityData(null);
      navigate(-1);
      setAssessorsConflicts([]);
      queryClient.refetchQueries({ queryKey: [""] });
    },
    onError: (
      data: AxiosError<{ assessorsConflicts: any[]; message: string }>,
    ) => {
      toast.error(data?.message || "Assessor Conflict Detected!");
      if (data?.response?.data.assessorsConflicts) {
        let accessorConflictsKey: any[] = Object.keys(
          data?.response?.data.assessorsConflicts,
        );
        let backendAssessorsConflicts: any = [];
        for (let key of accessorConflictsKey) {
          data?.response?.data.assessorsConflicts[key]?.map((item: any) =>
            backendAssessorsConflicts.push(item?.assessorName),
          );
        }
        setBackendAssessorsConflicts(backendAssessorsConflicts);
        if (data?.response?.data.assessorsConflicts) {
          setAssessorsConflicts((prevKeys) => [
            ...prevKeys,
            ...backendAssessorsConflicts,
          ]);
        }
      } else if (data?.response?.data?.message) {
        setBackendError(data?.response?.data?.message);
        toast.error(data?.response?.data?.message || "Conflict Detected!");
      }
    },
  });

  const { mutate: saveAsDraftMutate, isPending: saveAsDraftLoading } =
    useMutation({
      mutationFn: (data: any) => axios.post(`/class/class-draft`, data),
      onSuccess: (data) => {
        toast.success(data.data.msg || "Successfully Saved Class As Draft !");
        navigate(-1);
        setDate(undefined);
        setFacilityData(null);
        setAssessorsConflicts([]);
        queryClient.refetchQueries({ queryKey: [state?.refetchUrl] });
      },
      onError: (resp: any) => {
        toast.error(resp?.response?.data?.message || "Something went wrong!");
      },
    });

  //------HANDLE CLOSE FUNCTIONS ----------//

  useEffect(() => {
    if (Data) {
      const groupActivity = Data?.assessments.filter((item: any) => {
        return item?.is_group_activity === true;
      });
      setIsGroupActivity(
        groupActivity[0]?.client_assessments?.map((i: any) => i?.id),
      );
    }
    if (Data) {
      const groupActivity = Data?.assessments.filter((item: any) => {
        return item?.is_quesionnaire === true;
      });
      setIsQuesionnaire(groupActivity[0]?.id);
      setQuesionnaireId(groupActivity[0]?.ClientAssessments?.quesionnaire_id);
    }
  }, [Data]);

  const handleClose = () => {
    setOpen(false);
    setGroupActivityDialogOpen(false);
    setSelectedAssesment(null);
    setSelectedAssesmentName(null);
    setIsQuesionnaireTrue(false);
    setUpdateData(null);
  };

  const handleCompetencyDialog = () => {
    setOpenCompetiencyDialog(false);
  };

  //--------- logic -----------//
  const [childToParentMap, setChildToParentMap] = useState<
    Record<string, string>
  >({});

  const [scenarioIdsStore, setScenarioIdsStore] = useState<
    Record<string, string>
  >({});

  const [quessionnaireIsStore, setQuessionnaireIsStore] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setData(Data);
    const assessmentData = Data?.assessments?.flatMap(
      (assessment: any) => assessment?.client_assessments || [],
    );

    const mapping: Record<string, string> = {};
    if (Data) {
      Data.assessments.forEach((assessment: any) => {
        assessment?.client_assessments?.forEach((client: any) => {
          mapping[client?.id] = assessment?.id;
        });
      });

      setChildToParentMap(mapping);
    }

    const scenarioIdMapping: Record<string, string> = {};
    if (Data) {
      Data.assessments.forEach((assessment: any) => {
        assessment?.client_assessments?.forEach((client: any) => {
          scenarioIdMapping[client?.id] = client?.scenerio_id;
        });
      });

      setScenarioIdsStore(scenarioIdMapping);
    }

    const quessionnaireIsMapping: Record<string, string> = {};
    if (Data) {
      Data.assessments.forEach((assessment: any) => {
        assessment?.client_assessments?.forEach((client: any) => {
          quessionnaireIsMapping[client?.id] = client?.quesionnaire_id;
        });
      });

      setQuessionnaireIsStore(quessionnaireIsMapping);
    }

    const processAssessmentNames = (data: any[]) => {
      const nameCountMap: Record<string, number> = {};
      const nameIndexMap: Record<string, number> = {};

      return data?.map((item) => {
        const originalName = item?.assessment?.assessment_name ?? "Unnamed";

        nameCountMap[originalName] = (nameCountMap[originalName] || 0) + 1;

        if (!nameIndexMap[originalName]) {
          nameIndexMap[originalName] = 1;
        } else {
          nameIndexMap[originalName]++;
        }

        const count = nameCountMap[originalName];

        return {
          ...item,
          assessment: {
            ...item.assessment,
            display_name:
              count > 1
                ? `${originalName} ${nameIndexMap[originalName]}`
                : originalName,
          },
        };
      });
    };

    const tableData = processAssessmentNames(assessmentData);

    setAssesmentData(tableData);
  }, [Data]);

  /// ------------ handle functions ------------///
  const handleFormSubmit = (formdata: any) => {
    let tempData = { ...formData, ...formdata };
    setFormData(tempData);
    setConflictRowKeys([]);
    setIsQuesionnaireTrue(false);
    handleLaunchLogic(tempData);
  };

  const handleSuccessDialogClose = () => {
    setFormData([]);
  };

  //--------  stop functionality for reloading the page -------------//
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      alert("Page is being refreshed!");
      event.preventDefault();
      event.returnValue = "";
    };
    const handlePopState = () => {
      alert("Back or forward button pressed!");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  //-------------- time overlaping check function ------------//
  const isTimeOverlapping = (
    startA: string,
    endA: string,
    startB: string,
    endB: string,
  ) => {
    const toMinutes = (t: any) => {
      const [h, m] = t ? t.split(":").map(Number) : "";
      return h * 60 + m;
    };

    const aStart = toMinutes(startA);
    const aEnd = toMinutes(endA);
    const bStart = toMinutes(startB);
    const bEnd = toMinutes(endB);

    return aStart < bEnd && bStart < aEnd;
  };

  //-------------- handle launch logic function --------------//
  const handleLaunchLogic = (rawData: any, isSubmit?: boolean) => {
    try {
      let keys = Object.keys(rawData);
      let errors: any[] = [];
      let allData: any[] = [];

      let roomTimeConflict: Record<
        string,
        { start: string; end: string; assessmentId: any }[]
      > = {};
      let assessorTimeConflict: Record<
        string,
        { start: string; end: string; assessmentId: any }[]
      > = {};
      let participantTimeConflict: Record<
        string,
        { start: string; end: string; assessmentId: any }[]
      > = {};

      for (let key of keys) {
        if (key !== isQuesionnaire) {
          rawData[key]?.forEach((item: any, index: number) => {
            allData.push({ ...item, rowKey: key, index });
          });
        }
      }

      for (let data of allData) {
        const formatTime = (t: string | Date) =>
          t instanceof Date
            ? `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`
            : t;

        const startTime = formatTime(data.startTime);
        const endTime = formatTime(data.endTime);

        // ----- Check Room Conflicts -----
        const roomId = data.room_name?.id;

        if (roomId) {
          if (!roomTimeConflict[roomId]) roomTimeConflict[roomId] = [];

          const conflictSlot = roomTimeConflict[roomId].find((slot) =>
            isTimeOverlapping(slot.start, slot.end, startTime, endTime),
          );

          if (conflictSlot) {
            setConflictRowKeys((prev) => [...new Set([...prev, data.rowKey])]);

            const conflictingAssessmentName =
              assesmentData.find((a: any) => a.id === conflictSlot.assessmentId)
                ?.assessment?.display_name || "Unknown";

            const currentAssessmentName =
              assesmentData.find((a: any) => a.id === data.rowKey)?.assessment
                ?.display_name || "Current";

            errors.push({
              type: "room",
              id: roomId,
              startTime,
              endTime,
              conflictingWith: conflictingAssessmentName,
              currentAssessment: currentAssessmentName,
              isGroupActivity: isGroupActivity?.includes(data?.rowKey),
            });
          } else {
            roomTimeConflict[roomId].push({
              start: startTime,
              end: endTime,
              assessmentId: data.rowKey, 
            });
          }
        }

        // ----- Check Participant Conflicts -----
        const participants = Array.isArray(data.participant_name)
          ? data.participant_name
          : [data.participant_name];

        for (const participant of participants) {
          const id = participant?.id;
          if (!participantTimeConflict[id]) participantTimeConflict[id] = [];

          const conflictSlot = participantTimeConflict[id].find((slot) =>
            isTimeOverlapping(slot.start, slot.end, startTime, endTime),
          );

          if (conflictSlot) {
            setConflictRowKeys((prev) => [...new Set([...prev, data.rowKey])]);

            const conflictingAssessmentName =
              assesmentData.find((a: any) => a.id === conflictSlot.assessmentId)
                ?.assessment?.display_name || "Unknown";

            const currentAssessmentName =
              assesmentData.find((a: any) => a.id === data.rowKey)?.assessment
                ?.display_name || "Current";

            errors.push({
              type: "participant",
              id,
              startTime,
              endTime,
              conflictingWith: conflictingAssessmentName,
              currentAssessment: currentAssessmentName,
            });
          } else {
            participantTimeConflict[id].push({
              start: startTime,
              end: endTime,
              assessmentId: data.rowKey,
            });
          }
        }

        // ----- Check Assessor Conflicts -----
        const assessors = Array.isArray(data.assessor_name)
          ? data.assessor_name
          : [data.assessor_name];

        for (const assessor of assessors) {
          const id = assessor?.id;
          if (!assessorTimeConflict[id]) assessorTimeConflict[id] = [];

          const conflictSlot = assessorTimeConflict[id].find((slot) =>
            isTimeOverlapping(slot.start, slot.end, startTime, endTime),
          );

          if (conflictSlot) {
            setConflictRowKeys((prev) => [...new Set([...prev, data.rowKey])]);

            const conflictingAssessmentName =
              assesmentData.find((a: any) => a.id === conflictSlot.assessmentId)
                ?.assessment?.display_name || "Unknown";

            const currentAssessmentName =
              assesmentData.find((a: any) => a.id === data.rowKey)?.assessment
                ?.display_name || "Current";

            errors.push({
              type: "assessor",
              id,
              startTime,
              endTime,
              conflictingWith: conflictingAssessmentName,
              currentAssessment: currentAssessmentName,
            });
          } else {
            assessorTimeConflict[id].push({
              start: startTime,
              end: endTime,
              assessmentId: data.rowKey,
            });
          }
        }
      }

      setConflicts(errors);

      // ----- Submit Data -----
      if (!errors.length && isSubmit) {
        const formattedData = {
          facility_id: facilityData?.id,
          start_date: date?.from ? format(date.from, "yyyy-MM-dd") : null,
          end_date: date?.to ? format(date.to, "yyyy-MM-dd") : null,
          quessionnaire_id: quesionnaireId ?? null,
          class_assessments: Object.entries(rawData).map(
            ([assessment_id, participants]) => ({
              assessment_id: childToParentMap[assessment_id],
              class_competencies: CompiteancyData?.map((compi: any) => ({
                competency_id: compi?.id,
              })),
              scenerio_id: scenarioIdsStore[assessment_id],
              quessionnaire_id: quessionnaireIsStore[assessment_id],
              participant_assessment: isGroupActivity?.includes(assessment_id)
                ? undefined
                : (participants as any[]).map((participant: any) => ({
                    email: participant.participant_name?.email,
                    participant_id: participant.participant_name?.id,
                    room_id: participant.room_name?.id,
                    class_assessors: participant?.assessor_name?.map(
                      (i: any) => ({
                        assessor_id: i?.id,
                      }),
                    ),
                    start_time: participant.startTime,
                    end_time: participant.endTime,
                    break: participant?.break,
                  })),
              part_gr_act_room: isGroupActivity?.includes(assessment_id)
                ? (participants as any[]).map((participant: any) => ({
                    room_id: participant.room_name?.id,
                    part_gr_act: participant?.participant_name?.map(
                      (par: any) => ({
                        email: par?.email,
                        participant_id: par?.id,
                      }),
                    ),
                    assessor_id: participant?.assessor_name?.id,
                    start_time: participant.startTime,
                    end_time: participant.endTime,
                  }))
                : undefined,
            }),
          ),
        };

        mutate(formattedData);
      }
    } catch (error) {
      console.error("Launch Error:", error);
    }
  };

  const handleSaveAsDraftLaunchLogic = (rawData: any, isSubmit?: boolean) => {
    try {
      // ----- Submit Data -----
      if (isSubmit) {
        const formattedData = {
          client_id: rowData?.client?.id,
          cohort_id: rowData?.cohort?.id,
          project_id: rowData?.project?.id,
          facility_id: facilityData?.id,
          start_date: date?.from ? format(date.from, "yyyy-MM-dd") : null,
          end_date: date?.to ? format(date.to, "yyyy-MM-dd") : null,
          quessionnaire_id: quesionnaireId ?? null,
          class_data: rawData,
        };

        saveAsDraftMutate(formattedData);
      }
    } catch (error) {
      console.error("Launch Error:", error);
    }
  };

  useEffect(() => {
    if (rowData?.class_data) {
      setFormData(rowData?.class_data);
    }
    if (Data?.assessments) {
      handleLaunchLogic(rowData?.class_data, false);
    }
  }, [rowData?.class_data, Data?.assessments]);

  useEffect(() => {
    if (rowData?.facility && Array.isArray(Data?.facilities)) {
      const matchedFacility = Data.facilities.find(
        (item: any) => item.id === rowData.facility.id,
      );

      if (matchedFacility) {
        setFacilityData(matchedFacility);
      }
    }
  }, [rowData?.facility, Data?.facilities]);

  return (
    <div>
      <PageHeading>Update {rowData?.cohort?.cohort_name} Class</PageHeading>
      <div className='flex gap-5 flex-wrap mb-8'>
        <CustomSelect
          required
          value={rowData?.client}
          className='w-[494.33px] h-[48px]'
          label='Select Client'
          getOptionLabel={(item) => item?.client_name}
          getOptionValue={(item) => item?.id}
          options={ClientData || []}
          disabled={true}
          onChange={(item) => {
            setSelectedClient(item);
          }}
        />

        <CustomSelect
          required
          value={rowData?.project}
          className='w-[494.33px] h-[48px]'
          label='Select Project'
          getOptionLabel={(item) => item?.project_name}
          getOptionValue={(item) => item?.id}
          options={ProjectData || []}
          disabled={true}
        />

        <CustomSelect
          required
          className='w-[494.33px] h-[48px]'
          label='Select Cohort'
          getOptionLabel={(item) => item?.cohort_name}
          getOptionValue={(item) => item?.id}
          options={CohortData || []}
          value={rowData?.cohort}
          disabled={true}
        />

        <CustomSelect
          required
          className='w-[494.33px] h-[48px]'
          label='Select Facility'
          getOptionLabel={(item) => item?.facility_name}
          getOptionValue={(item) => item?.id}
          options={Data?.facilities || []}
          value={rowData?.facility}
          onChange={(item) => {
            setFacilityData(item);
          }}
        />

        <DatePickerWithRange
          fromDate={new Date()}
          required
          label='Class Start & End Date'
          value={date}
          onChange={setDate}
        />
      </div>
      {assessorsConflicts?.length ? (
        <div className='!h-[100px] overflow-y-auto'>
          {assessorsConflicts?.map((item: any) => {
            return (
              <AlertComponent
                message={item + " is occupied for selected date"}
                type='destructive'
                className='!w-full'
              />
            );
          })}
        </div>
      ) : (
        ""
      )}
      <div className='pb-10'>
        {rowData?.client &&
        rowData?.project &&
        rowData?.cohort &&
        !assesmentData?.length ? (
          <CustomLoader />
        ) : (
          <Datagrid
            columns={columns}
            tableMetaDataKey='class-config'
            disableFilters
            data={assesmentData}
          />
        )}
      </div>
      <ButtonFooter>
        <div className='flex gap-4 justify-end'>
          <CustomButton variant='outline' onClick={() => navigate(-1)}>
            Back
          </CustomButton>
          <CustomButton
            isPending={isPending}
            variant='outline'
            onClick={() => {
              handleSaveAsDraftLaunchLogic(formData, true);
            }}
          >
            Save as draft
          </CustomButton>
          <CustomButton
            isPending={isPending}
            onClick={() => {
              handleLaunchLogic(formData, true);
            }}
            disabled={
              !(formData && date?.from && date?.to) ||
              isPending ||
              (conflicts && conflicts?.length > 0)
            }
          >
            Launch Class
          </CustomButton>
        </div>
      </ButtonFooter>
      {open && (
        <DetailsUpdateDialoag
          handleClose={handleClose}
          data={data}
          handleFormSubmit={handleFormSubmit}
          selectedAssesment={selectedAssesment?.id}
          selectedAssesmentName={selectedAssesmentName}
          facilityData={facilityData}
          updateData={updateData}
          conflicts={conflicts}
          isQuesionnaire={isQuesionnaireTrue}
        />
      )}
      {groupActivityDialogOpen && (
        <GroupActivityDetailsDialoag
          handleClose={handleClose}
          data={data}
          handleFormSubmit={handleFormSubmit}
          selectedAssesment={selectedAssesment?.id}
          facilityData={facilityData}
          updateData={updateData}
          conflicts={conflicts}
          assesmentData={assesmentData}
          assessorsData={AssessorsData}
        />
      )}

      {openCompetiencyDialog && (
        <CompetaencyDialog
          compitaincyData={CompiteancyData}
          handleClose={handleCompetencyDialog}
        />
      )}

      {successDialog && (
        <SuccessDialog
          setOpen={setSuccessDialog}
          handleClose={handleSuccessDialogClose}
          titile='New CLASS Launched Successfully'
          message='Great job! New CLASS has been Launched successfully and is ready to go!'
        />
      )}
    </div>
  );
};

export default SingleConfiguredClasses;
