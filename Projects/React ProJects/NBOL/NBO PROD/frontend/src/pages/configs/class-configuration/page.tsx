import { ButtonFooter, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import ConflictChip from "@/components/conflict-chip";
import { CustomLoader } from "@/components/custom-loader";
import AlertComponent from "@/components/error-alert";
import { DatePickerWithRange } from "@/components/inputs";
import CustomSelect from "@/components/inputs/custom-select";
import SelectCommonOptions from "@/components/inputs/select-client";
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
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { BiEditAlt } from "react-icons/bi";
import { GiSettingsKnobs } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CompetaencyDialog from "./components/compentency-dialog";
import DetailsDialoag from "./components/details-dialoag";
import GroupActivityDetailsDialoag from "./components/group-activity-dialoag";

const ClassConfigurationPage = () => {
  // ------------ colums ------------//
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
      cell({ row }) {
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
          <>
            <ConflictChip
              title={
                conflictRowKeys.includes(row?.original?.id)
                  ? "Conflict"
                  : "No Conflict"
              }
            />
          </>
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
            {!formData?.[row?.original?.id] && (
              <p
                className={` ${facilityData && selectedClient && !formData?.[row?.original?.id] ? "text-[#006F6D]" : "text-gray-400"} flex gap-1 items-center   cursor-pointer`}
                onClick={() => {
                  setSelectedAssesment(row?.original);
                  setSelectedAssesmentName(
                    row?.original?.assessment?.display_name,
                  );
                  if (row?.original?.assessment?.is_quesionnaire === true) {
                    setIsQuesionnaireTrue(true);
                  }
                  if (
                    facilityData &&
                    selectedClient &&
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
                <GiSettingsKnobs />
                Configure
              </p>
            )}
            {formData?.[row?.original?.id] && (
              <span
                className={`flex gap-1 items-center cursor-pointer ${
                  formData?.[row?.original?.id] && formData[row?.original?.id]
                    ? "text-[#006F6D]"
                    : "text-gray-400"
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
                  }
                }}
              >
                <BiEditAlt
                  className={` ${formData?.[row?.original?.id] ? "text-[#006F6D]" : "text-gray-400"} size-[14px]`}
                />
                Edit
              </span>
            )}
          </div>
        );
      },
    },
  ];

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
  const [date, setDate] = useState<DateRange>();
  const [conflicts, setConflicts] = useState<any[]>();
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const [isQuesionnaireTrue, setIsQuesionnaireTrue] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();
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

  const { data: Data, isFetching } = useQuery<any>({
    queryKey: [
      `assessment/class-configration-details/${selectedClient?.id}/${selectedCohort?.id}`,
    ],
    select: (data: any) => data?.data?.data?.rows[0],
    enabled: !!selectedClient && !!selectedCohort,
  });

  const { data: CompiteancyData } = useQuery<CompetiencyInterface[]>({
    queryKey: [`/competency/client-all-competencies/${selectedClient?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/class/${selectedClient?.id}/${selectedCohort?.id}`, data),
    onSuccess: (data) => {
      toast.success(data.data.msg || "Successfully Created Class!");
      setSuccessDialog(true);
      navigate("/draft-schedule");
      setDate(undefined);
      setFacilityData(null);
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
        navigate("/draft-schedule");
        setDate(undefined);
        setFacilityData(null);
        setAssessorsConflicts([]);
        queryClient.refetchQueries({ queryKey: [""] });
      },
      onError: (resp: any) => {
        toast.error(resp?.response?.data?.message || "Something went wrong!");
      },
    });

  const { data: AssessorsData } = useQuery<AssessorsInterface[]>({
    queryKey: [`/assessors/active-assessors`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  //-------- useEffect hook ----------//

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

  //------HANDLE CLOSE FUNCTIONS ----------//
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

  //---------  logic -------------//
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
    setAssesmentData(assessmentData);

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

  const navigate = useNavigate();
  const [clientProjects, setClientProjects] = useState<any[]>([]);

  const isTimeOverlapping = (
    startA: string,
    endA: string,
    startB: string,
    endB: string,
  ) => {
    const toMinutes = (t: any) => {
      const [h, m] = t ? t?.split(":").map(Number) : "";
      return h * 60 + m;
    };

    const aStart = toMinutes(startA);
    const aEnd = toMinutes(endA);
    const bStart = toMinutes(startB);
    const bEnd = toMinutes(endB);

    return aStart < bEnd && bStart < aEnd;
  };

  //--------------- class launch logic ---------------//
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
              assessmentId: data.rowKey, // rowKey is the assessment_id
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
              scenerio_id: scenarioIdsStore[assessment_id],
              quessionnaire_id: quessionnaireIsStore[assessment_id],
              class_competencies: CompiteancyData?.map((compi: any) => ({
                competency_id: compi?.id,
              })),
              participant_assessment: isGroupActivity?.includes(assessment_id)
                ? undefined
                : (participants as any[]).map((participant: any) => ({
                    email: participant?.participant_name?.email,
                    participant_id: participant?.participant_name?.id,
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
  //------------ class save of draft logic ---------------//
  const handleSaveAsDraftLaunchLogic = (rawData: any, isSubmit?: boolean) => {
    try {
      // ----- Submit Data -----
      if (isSubmit) {
        const formattedData = {
          client_id: selectedClient?.id,
          cohort_id: selectedCohort?.id,
          project_id: selectedProject?.id,
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
  return (
    <div>
      <PageHeading>Create New Class</PageHeading>
      <div className='flex gap-5 flex-wrap mb-8'>
        <SelectCommonOptions
          key={selectedClient?.id}
          handleChange={setSelectedClient}
          required={true}
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
          <div>
            <SelectCommonOptions
              required={true}
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
              onOptionsLoaded={(projects) => setClientProjects(projects)}
              localStorageName='project'
              url={`/projects/client-projects/${selectedClient?.id}`}
            />
            {clientProjects.length === 0 && (
              <p
                className='text-[#528BFF] underline text-[13px] mt-2 cursor-pointer'
                onClick={() => navigate("/project-configuration")}
              >
                Add New
              </p>
            )}
          </div>
        )}

        {selectedClient && selectedProject && (
          <SelectCommonOptions
            required={true}
            key={selectedCohort?.id}
            handleDataChange={(cohort: CohortInterface | null) => {
              setSelectedCohort(cohort);
              localStorage.setItem("cohort", JSON.stringify(cohort));
            }}
            localStorageName='cohort'
            url={`/participant/get-project-cohorts/${selectedProject?.id}`}
          />
        )}

        {selectedClient && selectedProject && selectedCohort && (
          <div>
            <CustomSelect
              required
              className='w-[494.33px] h-[48px]'
              label='Select Facility'
              getOptionLabel={(item) => item?.facility_name}
              getOptionValue={(item) => item?.id}
              options={Data?.facilities || []}
              onChange={(item) => {
                setFacilityData(item);
                setFormData(null);
              }}
            />
            {Data?.facilities?.length === 0 && (
              <p
                className='text-[#528BFF] underline text-[13px] mt-2 cursor-pointer'
                onClick={() => navigate("/facilities-configuration")}
              >
                Add New
              </p>
            )}
          </div>
        )}
        {selectedClient &&
          selectedProject &&
          selectedCohort &&
          facilityData && (
            <DatePickerWithRange
              fromDate={new Date()}
              required
              label='Class Start & End Date'
              value={date}
              onChange={setDate}
            />
          )}
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
        {selectedClient &&
          selectedProject &&
          selectedCohort &&
          (isFetching && !assesmentData?.length ? (
            <CustomLoader />
          ) : (
            <Datagrid
              columns={columns}
              tableMetaDataKey='class-config'
              disableFilters
              disableSearch
              data={assesmentData}
            />
          ))}
      </div>
      <ButtonFooter>
        <div className='flex gap-4 justify-end'>
          <CustomButton variant='outline'>Cancel</CustomButton>
          <CustomButton
            isPending={saveAsDraftLoading}
            disabled={saveAsDraftLoading}
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
              (conflicts && conflicts?.length
                ? conflicts?.filter((item) => !item?.isGroupActivity)?.length >
                  0
                : false)
            }
          >
            Launch Class
          </CustomButton>
        </div>
      </ButtonFooter>
      {open && (
        <DetailsDialoag
          handleClose={handleClose}
          data={data}
          handleFormSubmit={handleFormSubmit}
          selectedAssesment={selectedAssesment?.id}
          selectedAssesmentName={selectedAssesmentName}
          facilityData={facilityData}
          updateData={updateData}
          conflicts={conflicts}
          isQuesionnaire={isQuesionnaireTrue}
          assessorsData={AssessorsData}
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

export default ClassConfigurationPage;
