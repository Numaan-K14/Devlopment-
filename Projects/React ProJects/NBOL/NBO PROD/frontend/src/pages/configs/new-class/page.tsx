import { ButtonFooter, PageHeading } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import CheckBoxAutocomplete from "@/components/checkbox-autocomplet";
import { DatePickerWithRange } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import TimeRangePicker from "@/components/inputs/range-time-picker";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { axios } from "@/config/axios";
import { useQuery } from "@/hooks/useQuerry";
import { AssessorsInterface } from "@/interfaces/assessors";
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { CompetiencyInterface } from "@/interfaces/competency";
import { FacilityInterface } from "@/interfaces/facility";
import { ParticipantsInterface } from "@/interfaces/participants";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import DetailsDialoag from "./components/details-dialoag";
import ScheduleSectionContainer from "./components/schedule-section-container";

const NewClassConfig = () => {
  //----------- Draft colume -----------------//
  const draftColumns: ColumnDef<any>[] = [
    {
      header: "Assessment Name",
      accessorKey: "assessmentName",
      cell({ row }) {
        return row?.original?.assessment_name;
      },
    },
    {
      header: "Action",
      accessorKey: "Action",
      cell({ row }) {
        return (
          <span
            className={`flex gap-1 items-center cursor-pointer text-[#006F6D] `}
            onClick={() => {
              setOpen(true);
              setRowData(row?.original);
            }}
          >
            <FaEye className={` text-[#006F6D]  size-[14px]`} />
            View
          </span>
        );
      },
    },
  ];

  //----------- state management ------------//
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [assessorConflict, setAssessorConflict] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const [questionnaireId, setQuestionnaireId] = useState<string[]>([]);
  const [rowData, setRowData] = useState<any>();
  const [normalAssessDuration, setNormalAssessDuration] = useState<any>(30);
  const [shortBreakDuration, setShortBreakDuration] = useState<any>(15);
  const [grpActAssessDuration, setGrpActAssessDuration] = useState<any>(30);
  const [cbiAssessDuration, setCbiAssessDuration] = useState<any>(30);
  const [welocomSetionDuration, setWelocomSetionDuration] = useState<any>(30);
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange>();
  const [facilityData, setFacilityData] = useState<any>();
  const [classData, setClassData] = useState<any>();
  const [breaks, setBreaks] = useState<any>([]);
  const navigate = useNavigate();
  const defaultStart = new Date();
  defaultStart.setHours(9, 0, 0, 0); // 09:00 AM

  const defaultEnd = new Date();
  defaultEnd.setHours(18, 0, 0, 0); // 06:00 PM
  const [initialValues] = useState<any>({
    start: { from: "", to: "" },
    facility_id: "",
    assessorIds: [],
    participantIds: [],
    assessmentIds: [],
    // break_between_activities: 5,
    start_time: "",
    end_time: "",
    day_start_time: defaultStart,
    day_end_time: defaultEnd,
    duration_of_each_activity: 30,
    group_activity_duration: 30,
    cbi_activity_duration: 30,
    welcome_sess_duration: 15,
    short_break_duration: 15,
  });
  // console.log(facilityData, "  <---------- facilityData");
  //------------------- Get API Call ----------------------//
  const { data: FacilityData } = useQuery<FacilityInterface[]>({
    queryKey: [`/facility/${selectedClient?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient?.id,
  });

  const { data: AssessorsData } = useQuery<AssessorsInterface[]>({
    queryKey: [`/assessors/active-assessors`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  const { data: CompiteancyData } = useQuery<CompetiencyInterface[]>({
    queryKey: [`/competency/client-all-competencies/${selectedClient?.id}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient,
  });

  const { data: AssessmentData } = useQuery<any>({
    queryKey: [`/class/${selectedCohort?.id}/cohort-assesm-scenerio`],
    select: (data: any) => data?.data?.data,
    enabled: !!selectedCohort,
  });

  const { data: ParticipantData } = useQuery<ParticipantsInterface[]>({
    queryKey: [
      `/participant/participant-filter?client_id=${selectedClient?.id}&project_id=${selectedProject?.id}&cohort_id=${selectedCohort?.id}`,
    ],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient && !!selectedCohort && !!selectedCohort,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(
        `/class/${selectedClient?.id}/${selectedCohort?.id}/auto-schedule`,
        data,
      ),
    onSuccess(data) {
      setClassData(data?.data?.data?.schedule);
      localStorage.setItem("data", JSON.stringify(data?.data?.data?.schedule));
      toast.success("Successful");
    },
    onError(data: any) {
      toast.error(data?.response?.data?.message);
    },
  });

  const { mutate: launchClassMutate, isPending: launchClassPending } =
    useMutation({
      mutationFn: (data: any) =>
        axios.post(`/class/${selectedClient?.id}/${selectedCohort?.id}`, data),
      onSuccess(data) {
        toast.success(data.data.msg || "Successfully Created Class!");
        navigate("/draft-schedule");
      },
      onError(data: any) {
        toast.error(data?.response?.data?.message);
        setAssessorConflict(data?.response?.data?.assessorsConflicts);
      },
    });

  const { mutate: softLaunchClassMutate, isPending: softLaunchClassPending } =
    useMutation({
      mutationFn: (data: any) =>
        axios.post(
          `/class/pre-schedule/${selectedClient?.id}/${selectedCohort?.id}`,
          data,
        ),
      onSuccess(data) {
        const formattedBreaks = breaks?.map((item: any) => {
          const mergeDate = (dateStr: string, timeStr: string) => {
            if (!timeStr) return "";

            const date = new Date(dateStr);
            const time = new Date(timeStr);

            // Combine selected date + picked time (local)
            const combined = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              time.getHours(),
              time.getMinutes(),
              time.getSeconds(),
            );

            // Convert to UTC ISO string
            return combined.toISOString();
          };

          return {
            class_date: item.date,
            first_br_st: mergeDate(item.date, item.first_break_start_time),
            first_br_en: mergeDate(item.date, item.first_break_end_time),
            second_br_st: mergeDate(item.date, item.second_break_start_time),
            second_br_en: mergeDate(item.date, item.second_break_end_time),
            lunch_br_st: mergeDate(item.date, item.lunch_break_start_time),
            lunch_br_en: mergeDate(item.date, item.lunch_break_end_time),
          };
        });
        const formattedData = {
          client_id: selectedClient?.id,
          project_id: selectedProject?.id,
          cohort_id: selectedCohort?.id,
          facility_id: facilityData?.id,
          start_date: classData?.startDate
            ? format(classData?.startDate, "yyyy-MM-dd")
            : null,
          end_date: classData?.endDate
            ? format(classData?.endDate, "yyyy-MM-dd")
            : null,
          normal_assess_duration: Number(normalAssessDuration) || 30,
          grp_act_assess_duration: Number(grpActAssessDuration) || 30,
          cbi_assess_duration: Number(cbiAssessDuration) || 30,
          welcome_sess_duration: Number(welocomSetionDuration) || 15,
          short_break_duration: Number(shortBreakDuration) || 15,
          cbi_assessment_id:
            AssessmentData?.find((assess: any) => assess?.is_cbi === true)
              ?.id || null,

          cbi_quessionnaire_id:
            AssessmentData?.find((assess: any) => assess?.is_cbi === true)
              ?.client_assessments?.[0]?.quesionnaire_id || null,
          class_breaks: formattedBreaks,
          schedule_data: classData?.scenarios,
          quessionnaire_id: questionnaireId ?? undefined,
        };

        saveAsDraftMutate(formattedData);
      },
      onError(data: any) {
        toast.error(data?.response?.data?.message);
        setAssessorConflict(data?.response?.data?.assessorsConflicts);
      },
    });

  const { mutate: saveAsDraftMutate, isPending: saveAsDraftPending } =
    useMutation({
      mutationFn: (data: any) => axios.post(`/class/schedule-draft`, data),
      onSuccess(data) {
        toast.success(data.data.msg || "Successfully Created Class!");
        navigate("/draft-schedule");
      },
    });

  //------------- YUP Validations ----------------//
  const ValidationSchema = Yup.object().shape({
    facility_id: Yup.object().required("Facility is required"),

    participantIds: Yup.array()
      .of(Yup.object().required())
      .min(1, "At least one participant is required")
      .required("Participants are required"),

    // break_between_activities: Yup.number()
    //   .min(0, "Must be 0 or more")
    //   .required("Break duration is required"),

    duration_of_each_activity: Yup.number()
      .min(1, "Must be at least 1 minute")
      .required("Activity duration is required"),

    group_activity_duration: Yup.number()
      .min(1, "Must be at least 1 minute")
      .required("Group Activity duration is required"),
    cbi_activity_duration: Yup.number()
      .min(1, "Must be at least 1 minute")
      .required("Group Activity duration is required"),
    welcome_sess_duration: Yup.number()
      .min(1, "Must be at least 1 minute")
      .required("duration is required"),
    short_break_duration: Yup.number()
      .min(1, "Must be at least 1 minute")
      .required("duration is required"),

    day_start_time: Yup.string().required("Day start time is required"),
    day_end_time: Yup.string().required("Day end time is required"),

    // daily_breaks: Yup.array().of(
    //   Yup.object().shape({
    //     date: Yup.string().required(),
    //     first_break_start_time: Yup.string().required(
    //       "First break start is required",
    //     ),
    //     first_break_end_time: Yup.string().required(
    //       "First break end is required",
    //     ),
    //     second_break_start_time: Yup.string().required(
    //       "Second break start is required",
    //     ),
    //     second_break_end_time: Yup.string().required(
    //       "Second break end is required",
    //     ),
    //     lunch_break_start_time: Yup.string().required(
    //       "Lunch break start is required",
    //     ),
    //     lunch_break_end_time: Yup.string().required(
    //       "Lunch break end is required",
    //     ),
    //   }),
    // ),

    ...(AssessmentData || []).reduce((acc: any, item: any) => {
      console.log(item, "<------- yup validation item");
      acc[item.id] = Yup.object().shape({
        assessors:
          item?.assessment_name === "CBI"
            ? Yup.object().notRequired()
            : Yup.array()
                .of(Yup.object().required())
                .min(
                  1,
                  `At least one assessor for ${item.assessment_name} is required`,
                )
                .required(),
        facility_id:
          item.is_quesionnaire || item?.assessment_name === "CBI"
            ? Yup.mixed().notRequired()
            : item?.assessment_name === "Business Case"
              ? Yup.array()
                  .of(Yup.object().required())
                  .min(
                    1,
                    `At least one room for ${item.assessment_name} is required`,
                  )
                  .required()
              : Yup.object().required("Room is required"),
        // sequence: Yup.number()
        //   .typeError("Sequence must be a number")
        //   .required("Sequence is required"),
      });
      return acc;
    }, {}),
  });

  //----------------- reload stop function -----------------/
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

  //--------------- getting quetioner id from the assessment data for sending in the launch logic ------------------//
  useEffect(() => {
    if (AssessmentData) {
      const questionnaireId = AssessmentData.flatMap((assessment: any) =>
        assessment?.client_assessments
          ?.map((item: any) => item?.quesionnaire_id)
          ?.filter(Boolean),
      );
      setQuestionnaireId(questionnaireId);
    }
  }, [AssessmentData]);

  //---------------- handle launch function ----------------//
  const handleLaunchLogic = (launchData: any, values: any) => {
    console.log(values, "<-------------- lalalalalal");
    // const formattedBreaks = Object.values(
    //   launchData?.dailyBreaks?.reduce((acc: any, item: any) => {
    //     if (!acc[item.date]) {
    //       acc[item.date] = {
    //         class_date: item.date,
    //         first_br_st: "",
    //         first_br_en: "",
    //         second_br_st: "",
    //         second_br_en: "",
    //         lunch_br_st: "",
    //         lunch_br_en: "",
    //       };
    //     }

    //     if (item.type === "first_break") {
    //       acc[item.date].first_br_st = item.startTime;
    //       acc[item.date].first_br_en = item.endTime;
    //     }

    //     if (item.type === "second_break") {
    //       acc[item.date].second_br_st = item.startTime;
    //       acc[item.date].second_br_en = item.endTime;
    //     }

    //     if (item.type === "lunch_break") {
    //       acc[item.date].lunch_br_st = item.startTime;
    //       acc[item.date].lunch_br_en = item.endTime;
    //     }

    //     return acc;
    //   }, {}) || {},
    // );
    const classBreaks = launchData?.dailyBreaks.map((b: any) => ({
      ...b,
      wlc_sess_st: launchData?.welcomeSession?.startTime,
      wlc_sess_en: launchData?.welcomeSession?.endTime,
      ending_sess_st: launchData?.endingSession?.startTime,
      ending_sess_en: launchData?.endingSession?.endTime,
    }));
    const formattedData = {
      facility_id: facilityData?.id,
      project_id: selectedProject?.id,
      start_date: classData?.startDate
        ? format(classData?.startDate, "yyyy-MM-dd")
        : null,
      end_date: classData?.endDate
        ? format(classData?.endDate, "yyyy-MM-dd")
        : null,
      quessionnaire_id: questionnaireId ?? undefined,
      class_breaks: classBreaks,
      normal_assess_duration: Number(values?.duration_of_each_activity) || 30,
      grp_act_assess_duration: Number(values?.group_activity_duration) || 30,
      cbi_assess_duration: Number(values?.cbi_activity_duration) || 30,
      welcome_sess_duration: Number(values?.welcome_sess_duration) || 15,
      short_break_duration: Number(values?.short_break_duration) || 15,
      cbi_assessment_id:
        AssessmentData?.find((assess: any) => assess?.is_cbi === true)?.id ||
        undefined,

      cbi_quessionnaire_id:
        AssessmentData?.find((assess: any) => assess?.is_cbi === true)
          ?.client_assessments?.[0]?.quesionnaire_id || undefined,

      class_assessments: launchData?.scenarios?.map((singleParData: any) => {
        const {
          assessment_id,
          is_group_activity,
          is_quesionnaire,
          participantSchedules,
          groups,
        } = singleParData;

        return {
          assessment_id,
          scenerio_id: !is_quesionnaire
            ? singleParData?.groups?.length
              ? singleParData?.groups?.[0]?.participants?.[0]?.scenarioId
              : singleParData?.participantSchedules?.[0]?.scenarioId
            : null,
          quessionnaire_id: is_quesionnaire
            ? singleParData?.participantSchedules?.[0]?.questionnaireId
            : null,
          class_competencies:
            CompiteancyData?.map((compi: any) => ({
              competency_id: compi?.id,
            })) ?? [],

          participant_assessment: !is_group_activity
            ? participantSchedules.map((p: any) => ({
                participant_id: p.participantId,
                email: "",
                room_id: p.roomId ? p.roomId : null,
                class_assessors: p.assessorIds.map((id: string) => ({
                  assessor_id: id,
                })),
                start_time: p.startTime,
                end_time: p.endTime,
                break: null,
              }))
            : undefined,

          part_gr_act_room: is_group_activity
            ? groups?.map((group: any) => ({
                room_id: group?.roomId,
                assessor_id: group?.assessorId,
                start_time: group?.startTime,
                end_time: group?.endTime,
                part_gr_act: group?.participants?.map((par: any) => ({
                  participant_id: par?.participantId,
                })),
              }))
            : undefined,
        };
      }),
    };
    // return console.log(formattedData, "---------------- formattedData");
    launchClassMutate(formattedData);
  };

  const handleSaveAsDraft = (data: any, values: any) => {
    const formattedBreaks = values.daily_breaks.map((item: any) => {
      const mergeDate = (dateStr: string, timeStr: string) => {
        if (!timeStr) return "";

        const date = new Date(dateStr);
        const time = new Date(timeStr);

        // Combine selected date + picked time (local)
        const combined = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
        );

        // Convert to UTC ISO string
        return combined.toISOString();
      };

      return {
        class_date: item.date,
        first_br_st: mergeDate(item.date, item.first_break_start_time),
        first_br_en: mergeDate(item.date, item.first_break_end_time),
        second_br_st: mergeDate(item.date, item.second_break_start_time),
        second_br_en: mergeDate(item.date, item.second_break_end_time),
        lunch_br_st: mergeDate(item.date, item.lunch_break_start_time),
        lunch_br_en: mergeDate(item.date, item.lunch_break_end_time),
      };
    });
    const formattedData = {
      client_id: selectedClient?.id,
      project_id: selectedProject?.id,
      cohort_id: selectedCohort?.id,
      facility_id: facilityData?.id,
      normal_assess_duration: Number(values?.duration_of_each_activity) || 30,
      grp_act_assess_duration: Number(values?.group_activity_duration) || 30,
      cbi_assess_duration: Number(values?.cbi_activity_duration) || 30,
      welcome_sess_duration: Number(values?.welcome_sess_duration) || 15,
      short_break_duration: Number(values?.short_break_duration) || 15,

      cbi_assessment_id:
        AssessmentData?.find((assess: any) => assess?.is_cbi === true)?.id ||
        null,

      cbi_quessionnaire_id:
        AssessmentData?.find((assess: any) => assess?.is_cbi === true)
          ?.client_assessments?.[0]?.quesionnaire_id || null,
      class_breaks: formattedBreaks,
      start_date: classData?.startDate
        ? format(classData?.startDate, "yyyy-MM-dd")
        : null,
      end_date: classData?.endDate
        ? format(classData?.endDate, "yyyy-MM-dd")
        : null,
      schedule_data: classData?.scenarios,
      quessionnaire_id: questionnaireId ?? undefined,
    };
    saveAsDraftMutate(formattedData);
  };

  const handelSoftLaunch = (softLaunchData: any, values: any) => {
    console.log(softLaunchData, "<------- softla");
    // const formattedBreaks = softLaunchData.dailyBreaks.map((item: any) => {
    //   const mergeDate = (dateStr: string, timeStr: string) => {
    //     if (!timeStr) return "";

    //     const date = new Date(dateStr);
    //     const time = new Date(timeStr);

    //     const combined = new Date(
    //       date.getFullYear(),
    //       date.getMonth(),
    //       date.getDate(),
    //       time.getHours(),
    //       time.getMinutes(),
    //       time.getSeconds(),
    //     );

    //     return combined.toISOString();
    //   };

    //   return {
    //     class_date: item.date,
    //     first_br_st: mergeDate(item.date, item.first_break_start_time),
    //     first_br_en: mergeDate(item.date, item.first_break_end_time),
    //     second_br_st: mergeDate(item.date, item.second_break_start_time),
    //     second_br_en: mergeDate(item.date, item.second_break_end_time),
    //     lunch_br_st: mergeDate(item.date, item.lunch_break_start_time),
    //     lunch_br_en: mergeDate(item.date, item.lunch_break_end_time),
    //   };
    // });

    // const formattedBreaks = Object.values(
    //   softLaunchData?.dailyBreaks?.reduce((acc: any, item: any) => {
    //     if (!acc[item.date]) {
    //       acc[item.date] = {
    //         class_date: item.date,
    //         first_br_st: "",
    //         first_br_en: "",
    //         second_br_st: "",
    //         second_br_en: "",
    //         lunch_br_st: "",
    //         lunch_br_en: "",
    //       };
    //     }

    //     if (item.type === "first_break") {
    //       acc[item.date].first_br_st = item.startTime;
    //       acc[item.date].first_br_en = item.endTime;
    //     }

    //     if (item.type === "second_break") {
    //       acc[item.date].second_br_st = item.startTime;
    //       acc[item.date].second_br_en = item.endTime;
    //     }

    //     if (item.type === "lunch_break") {
    //       acc[item.date].lunch_br_st = item.startTime;
    //       acc[item.date].lunch_br_en = item.endTime;
    //     }

    //     return acc;
    //   }, {}) || {},
    // );
    const classBreaks = softLaunchData?.dailyBreaks.map((b: any) => ({
      ...b,
      wlc_sess_st: softLaunchData?.welcomeSession?.startTime,
      wlc_sess_en: softLaunchData?.welcomeSession?.endTime,
      ending_sess_st: softLaunchData?.endingSession?.startTime,
      ending_sess_en: softLaunchData?.endingSession?.endTime,
    }));

    const formattedData = {
      facility_id: facilityData?.id,
      project_id: selectedProject?.id,
      start_date: classData?.startDate
        ? format(classData?.startDate, "yyyy-MM-dd")
        : null,
      end_date: classData?.endDate
        ? format(classData?.endDate, "yyyy-MM-dd")
        : null,
      class_breaks: classBreaks,
      quessionnaire_id: questionnaireId ?? undefined,
      normal_assess_duration: Number(values?.duration_of_each_activity) || 30,
      grp_act_assess_duration: Number(values?.group_activity_duration) || 30,
      cbi_assess_duration: Number(values?.cbi_activity_duration) || 30,
      welcome_sess_duration: Number(values?.welcome_sess_duration) || 15,

      short_break_duration: Number(values?.short_break_duration) || 15,
      cbi_assessment_id:
        AssessmentData?.find((assess: any) => assess?.is_cbi === true)?.id ||
        undefined,

      cbi_quessionnaire_id:
        AssessmentData?.find((assess: any) => assess?.is_cbi === true)
          ?.client_assessments?.[0]?.quesionnaire_id || undefined,
      class_assessments: softLaunchData?.scenarios
        ?.filter((singleParData: any) =>
          singleParData?.participantSchedules?.some((p: any) =>
            p?.assessmentName.includes("Business Case"),
          ),
        )
        ?.map((singleParData: any) => {
          const {
            assessment_id,
            is_group_activity,
            is_quesionnaire,
            participantSchedules,
            groups,
          } = singleParData;

          return {
            assessment_id,
            scenerio_id: !is_quesionnaire
              ? groups?.length
                ? groups?.[0]?.participants?.[0]?.scenarioId
                : participantSchedules?.[0]?.scenarioId
              : null,
            quessionnaire_id: is_quesionnaire
              ? participantSchedules?.[0]?.questionnaireId
              : null,
            class_competencies:
              CompiteancyData?.map((compi: any) => ({
                competency_id: compi?.id,
              })) ?? [],
            participant_assessment: !is_group_activity
              ? participantSchedules
                  .filter((p: any) =>
                    p?.assessmentName.includes("Business Case"),
                  )
                  .map((p: any) => ({
                    participant_id: p.participantId,
                    email: "",
                    room_id: p.roomId ?? null,
                    class_assessors: p.assessorIds.map((id: string) => ({
                      assessor_id: id,
                    })),
                    start_time: p.startTime,
                    end_time: p.endTime,
                    break: null,
                  }))
              : undefined,
          };
        }),
    };
    // return console.log(formattedData, ",-------- formattedData");
    softLaunchClassMutate(formattedData, values);
  };

  return (
    <div>
      <AppBar
        title='Generate Schedule'
        subTitle='Generate class schedule based on your configuration'
      />
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        validateOnMount
        enableReinitialize
        onSubmit={(values) => {
          // console.log(values, "----------------- valus");
          // const scenarioIds = AssessmentData?.flatMap((item: any) =>
          //   item?.client_assessments
          //     ?.map((ca: any) => ca?.scenerio_id)
          //     .filter(Boolean),
          // );

          // console.log(scenarioIds, "<-------- scenarioIds");

          // const questionnaireIds = AssessmentData?.flatMap((item: any) =>
          //   item?.client_assessments
          //     ?.map((ca: any) => ca?.quesionnaire_id)
          //     .filter(Boolean),
          // );

          const scenarioIds =
            AssessmentData?.flatMap((item: any) =>
              item?.is_cbi
                ? []
                : item?.client_assessments
                    ?.map((ca: any) => ca?.scenerio_id)
                    .filter(Boolean),
            ) ?? [];

          console.log(scenarioIds, "<-------- scenarioIds");

          const questionnaireIds =
            AssessmentData?.flatMap((item: any) =>
              item?.is_cbi
                ? []
                : item?.client_assessments
                    ?.map((ca: any) => ca?.quesionnaire_id)
                    .filter(Boolean),
            ) ?? [];

          console.log(questionnaireIds, "<------------- questionnaireIds");

          // AssessmentId -> Scenario/Ques Ids
          const assessmentToScenarioOrQues = AssessmentData?.reduce(
            (acc: Record<string, string[]>, item: any) => {
              item?.client_assessments?.forEach((ca: any) => {
                const scenarioOrQuesId = ca?.scenerio_id || ca?.quesionnaire_id;
                if (scenarioOrQuesId) {
                  if (!acc[item.id]) acc[item.id] = [];
                  acc[item.id].push(scenarioOrQuesId);
                }
              });
              return acc;
            },
            {},
          );

          // Scenario/Ques Id -> AssessorIds
          const assessment_assessor_mapping = Object.keys(values)
            .filter((key) => /^[\w-]{36}$/.test(key))
            .reduce((acc: Record<string, string[]>, assessmentId: string) => {
              const scenarioOrQuesIds =
                assessmentToScenarioOrQues[assessmentId] || [];
              const assessorIds =
                (values as any)[assessmentId]?.assessors?.map(
                  (assessor: any) => assessor.id,
                ) || [];

              scenarioOrQuesIds.forEach((sqId: any) => {
                if (!acc[sqId]) acc[sqId] = [];
                acc[sqId].push(...assessorIds);
              });

              return acc;
            }, {});

          // ===== room_assessment_mapping =====
          // const room_assessment_mapping = Object.keys(values).reduce(
          //   (acc: Record<string, string[]>, assessmentId: string) => {
          //     console.log(values[assessmentId]?.facility_id,"<------ values[assessmentId]?.facility_id")
          //     const roomId =  values[assessmentId]?.facility_id?.id;
          //     const scenarioOrQuesIds =
          //       assessmentToScenarioOrQues[assessmentId] || [];

          //     if (roomId) {
          //       scenarioOrQuesIds.forEach((sqId: any) => {
          //         if (questionnaireIds?.includes(sqId)) return;

          //         if (!acc[roomId]) acc[roomId] = [];
          //         acc[roomId].push(sqId);
          //       });
          //     }
          //     return acc;
          //   },
          //   {},
          // );

          const room_assessment_mapping = Object.keys(values).reduce(
            (acc: Record<string, string[]>, assessmentId: string) => {
              const facility = values[assessmentId]?.facility_id;

              const roomIds = Array.isArray(facility)
                ? facility.map((item: any) => item?.id).filter(Boolean)
                : facility?.id
                  ? [facility.id]
                  : [];

              const scenarioOrQuesIds =
                assessmentToScenarioOrQues[assessmentId] || [];

              roomIds.forEach((roomId: string) => {
                if (!roomId) return;

                scenarioOrQuesIds.forEach((sqId: any) => {
                  if (questionnaireIds?.includes(sqId)) return;

                  if (!acc[roomId]) acc[roomId] = [];
                  acc[roomId].push(sqId);
                });
              });

              return acc;
            },
            {},
          );

          // ===== activity_sequence =====
          // const activity_sequence = Object.keys(values)
          //   .reduce(
          //     (
          //       acc: { scenarioId: string; order: number }[],
          //       assessmentId: string,
          //     ) => {
          //       const order = values[assessmentId]?.sequence;
          //       const scenarioOrQuesIds =
          //         assessmentToScenarioOrQues[assessmentId] || [];

          //       scenarioOrQuesIds.forEach((sqId: string) => {
          //         acc.push({ scenarioId: sqId, order });
          //       });

          //       return acc;
          //     },
          //     [],
          //   )
          //   .sort((a, b) => a.order - b.order); // sort by sequence
          const mergeDate = (dateStr: string, timeStr: string) => {
            if (!timeStr) return "";

            const date = new Date(dateStr);
            const time = new Date(timeStr);

            const combined = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              time.getHours(),
              time.getMinutes(),
              time.getSeconds(),
            );

            return combined.toISOString();
          };
          const formattedBreaks = values.daily_breaks.map((item: any) => {
            return {
              date: item.date,
              first_break_start_time: mergeDate(
                item.date,
                item.first_break_start_time,
              ),
              first_break_end_time: mergeDate(
                item.date,
                item.first_break_end_time,
              ),
              second_break_start_time: mergeDate(
                item.date,
                item.second_break_start_time,
              ),
              second_break_end_time: mergeDate(
                item.date,
                item.second_break_end_time,
              ),
              lunch_break_start_time: mergeDate(
                item.date,
                item.lunch_break_start_time,
              ),
              lunch_break_end_time: mergeDate(
                item.date,
                item.lunch_break_end_time,
              ),
            };
          });

          const data = {
            // ===== BASIC CONFIGURATION ===== //
            start_date: moment(values?.start?.from).format("YYYY-MM-DD"),
            end_date: moment(values?.start?.to).format("YYYY-MM-DD"),
            facility_id: values?.facility_id?.id,

            // ===== PARTICIPANTS & ACTIVITIES ===== //
            participantIds: values?.participantIds?.map((item: any) => item.id),
            scenarioIds,
            questionnaireIds,

            // ===== TIMING CONFIGURATION ===== //
            duration_of_each_activity: values?.duration_of_each_activity,
            group_activity_duration: values?.group_activity_duration,
            short_break_duration: values?.short_break_duration,
            welcome_sess_duration: values?.welcome_sess_duration || 15,
            // break_between_activities: values?.break_between_activities,
            // daily_breaks: formattedBreaks,

            daily_start_time: moment(
              mergeDate(values?.start?.from, values?.day_start_time),
            ).format("HH:mm"),
            daily_end_time: moment(
              mergeDate(values?.start?.from, values?.day_end_time),
            ).format("HH:mm"),

            // ===== GROUP CONFIGURATION ===== //
            assessment_assessor_mapping,

            // ===== ROOM ASSIGNMENT MAPPING ===== //
            room_assessment_mapping: room_assessment_mapping,

            // ===== ACTIVITY SEQUENCING ===== //
            // activity_sequence: activity_sequence,

            project_id: selectedProject?.id,
          };
          // return console.log(data, "<----------------- DATA");
          mutate(data);
        }}
      >
        {({ values, errors, setFieldValue, resetForm }) => (
          console.log(values, ",------------ values"),
          (
            <Form>
              {
                <div>
                  <div className='flex flex-col gap-5 flex-wrap mt-[16px]'>
                    <div className='mb-5'>
                      {/* <PageHeading className='mb-4'>
                      Client Configuration
                    </PageHeading> */}
                      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5'>
                        <SelectCommonOptions
                          handleChange={setSelectedClient}
                          required={true}
                          handleDataChange={(
                            client: ClientCreateInterface | null,
                          ) => {
                            setSelectedClient(client);
                            setClassData([]);
                            localStorage.setItem(
                              "client",
                              JSON.stringify(client),
                            );
                            if (
                              selectedClient &&
                              selectedClient?.id !==
                                JSON.parse(localStorage.getItem("client") ?? "")
                                  ?.id
                            ) {
                              setSelectedProject(null);
                              localStorage.removeItem("project");
                              localStorage.removeItem("cohort");
                            }
                          }}
                          // className='!w-[362.25px]'
                          className='!w-full'
                          localStorageName='client'
                          url='/client/getall-clients'
                        />

                        {selectedClient && (
                          <div>
                            <SelectCommonOptions
                              required={true}
                              handleDataChange={(
                                project: ProjectConfigInterface | null,
                              ) => {
                                setSelectedProject(project);
                                setClassData([]);
                                localStorage.setItem(
                                  "project",
                                  JSON.stringify(project),
                                );
                                resetForm();
                                if (
                                  selectedProject &&
                                  selectedProject?.id !==
                                    JSON.parse(
                                      localStorage.getItem("project") ?? "",
                                    )?.id
                                ) {
                                  setSelectedCohort(null);
                                  localStorage.removeItem("cohort");
                                }
                              }}
                              onOptionsLoaded={(projects) =>
                                setClientProjects(projects)
                              }
                              localStorageName='project'
                              url={`/projects/client-projects/${selectedClient?.id}`}
                              // className='!w-[362.25px]'
                              className='!w-full'
                            />
                            {clientProjects.length === 0 && (
                              <p
                                className='text-[#528BFF] underline text-[13px] mt-2 cursor-pointer'
                                onClick={() =>
                                  navigate("/project-configuration")
                                }
                              >
                                Add New
                              </p>
                            )}
                          </div>
                        )}

                        {selectedClient && selectedProject && (
                          <>
                            <SelectCommonOptions
                              required={true}
                              handleDataChange={(
                                cohort: CohortInterface | null,
                              ) => {
                                setSelectedCohort(cohort);
                                setClassData([]);
                                localStorage.setItem(
                                  "cohort",
                                  JSON.stringify(cohort),
                                );
                                setFieldValue("participantIds", []);
                                resetForm();
                              }}
                              localStorageName='cohort'
                              url={`/participant/get-project-cohorts/${selectedProject?.id}`}
                              // className='!w-[362.25px]'
                              className='!w-full'
                            />
                            {clientProjects.length === 0 && (
                              <p
                                className='text-[#528BFF] underline text-[13px] mt-2 cursor-pointer'
                                onClick={() =>
                                  navigate("/project-configuration")
                                }
                              >
                                Add New
                              </p>
                            )}
                          </>
                        )}
                        {selectedClient &&
                          selectedProject &&
                          selectedCohort && (
                            <div>
                              <CustomSelect
                                required
                                // value={facilityData}
                                // className='!w-[362.25px] h-[48px]'
                                className='!w-full h-[48px]'
                                label='Select Facility'
                                getOptionLabel={(item) => item?.facility_name}
                                getOptionValue={(item) => item?.id || null}
                                options={FacilityData || []}
                                name='facility_id'
                                onChange={(item) => {
                                  // console.log(item, "<-------------- item");
                                  setFacilityData(item);
                                }}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  {/* 
                  <ScheduleSectionContainer
                    title='Participant Configuration'
                    className='mb-4'
                  >
                    <CheckBoxAutocomplete
                      required
                      className='!w-[362.25px]'
                      label='Select Participants'
                      levels={ParticipantData || []}
                      name='participantIds'
                      onChange={(item: any) => {}}
                    />
                  </ScheduleSectionContainer> */}
                  {ParticipantData ? (
                    <ScheduleSectionContainer
                      title='Participant Configuration'
                      className='mb-4'
                      extraButton={
                        <Link to={"/participant-configuration"}>
                          <div className='text-[#3B7FE6] font-normal  cursor-pointer'>
                            Manage Participant
                          </div>
                        </Link>
                      }
                    >
                      <div className='hidden'>
                        <CheckBoxAutocomplete
                          required
                          className='!w-[362.25px]  '
                          label='Select Participants '
                          levels={ParticipantData || []}
                          name='participantIds'
                          onChange={(item: any) => {}}
                          allSelect
                        />
                      </div>

                      <div className='flex gap-2'>
                        {ParticipantData &&
                          ParticipantData?.map((item: any) => (
                            <div className='border border-[#D5D7DA] rounded-full py-[2px] px-3'>
                              {item?.participant_name}
                            </div>
                          ))}
                      </div>
                    </ScheduleSectionContainer>
                  ) : null}

                  {/* <div className='flex flex-col mb-5'>
                  <PageHeading className='mb-4'>
                    Participant Configuration
                  </PageHeading>
                  <div className='flex gap-5 mb-5 flex-wrap'>
                    <CheckBoxAutocomplete
                      required
                      className='!w-[362.25px] '
                      label='Select Participants'
                      levels={ParticipantData || []}
                      name='participantIds'
                      onChange={(item: any) => {}}
                    />
                  </div>
                </div> */}

                  {AssessmentData?.length > 0 && (
                    <div className='mt-5 mb-5'>
                      <ScheduleSectionContainer title='Assessment Scheduler'>
                        <div className='flex flex-col gap-5'>
                          {(() => {
                            const relevantAssessments =
                              AssessmentData?.filter(
                                (item: any) => item?.assessment_name !== "CBI",
                              ) || [];
                            const firstActivityId = relevantAssessments[0]?.id;
                            const secondActivityId = relevantAssessments[1]?.id;

                            const updateSubsequentActivities = (
                              firstAssessors: any[] = [],
                              secondAssessors: any[] = [],
                            ) => {
                              const combinedAssessors = [
                                ...firstAssessors,
                                ...secondAssessors,
                              ];
                              // Remove duplicates based on ID
                              const uniqueAssessors = Array.from(
                                new Map(
                                  combinedAssessors.map((item) => [
                                    item.id,
                                    item,
                                  ]),
                                ).values(),
                              );

                              relevantAssessments
                                .slice(2)
                                .forEach((activity: any) => {
                                  setFieldValue(
                                    `${activity.id}.assessors`,
                                    uniqueAssessors,
                                  );
                                });
                            };

                            return AssessmentData?.map(
                              (item: any, index: number) => {
                                if (item?.assessment_name === "CBI")
                                  return null;

                                let availableAssessors = AssessorsData || [];
                                let handleChange = undefined;

                                if (item.id === firstActivityId) {
                                  const secondActivityAssessors =
                                    values[secondActivityId]?.assessors || [];
                                  availableAssessors =
                                    availableAssessors.filter(
                                      (assessor) =>
                                        !secondActivityAssessors.some(
                                          (selected: any) =>
                                            selected.id === assessor.id,
                                        ),
                                    );
                                  handleChange = (newVal: any) => {
                                    updateSubsequentActivities(
                                      newVal,
                                      secondActivityAssessors,
                                    );
                                  };
                                } else if (item.id === secondActivityId) {
                                  const firstActivityAssessors =
                                    values[firstActivityId]?.assessors || [];
                                  availableAssessors =
                                    availableAssessors.filter(
                                      (assessor) =>
                                        !firstActivityAssessors.some(
                                          (selected: any) =>
                                            selected.id === assessor.id,
                                        ),
                                    );
                                  handleChange = (newVal: any) => {
                                    updateSubsequentActivities(
                                      firstActivityAssessors,
                                      newVal,
                                    );
                                  };
                                }

                                return (
                                  <div className='!h-[124px]' key={item.id}>
                                    <PageHeading
                                      variant='secondary'
                                      className='mb-2'
                                    >
                                      {item?.assessment_name}
                                    </PageHeading>
                                    <div className='flex flex-wrap gap-5 mb-2'>
                                      <CheckBoxAutocomplete
                                        required
                                        className='!w-[362.25px]  !rounded-[8px]'
                                        label={`Select assessor `}
                                        levels={availableAssessors}
                                        name={`${item.id}.assessors`}
                                        onChange={handleChange}
                                      />

                                      {!item?.is_quesionnaire &&
                                        (item?.assessment_name ===
                                        "Business Case" ? (
                                          <CheckBoxAutocomplete
                                            key={`${item.id}.facility_id`}
                                            required
                                            className='!w-[362.25px] !rounded-[8px] '
                                            label='Select Room'
                                            levels={facilityData?.room || []}
                                            name={`${item.id}.facility_id`}
                                          />
                                        ) : (
                                          <CustomSelect
                                            key={item?.id}
                                            required
                                            className='!w-[362.25px] h-[48px]'
                                            label='Select Room'
                                            getOptionLabel={(item) =>
                                              item?.room
                                            }
                                            getOptionValue={(item) =>
                                              item?.id || null
                                            }
                                            options={facilityData?.room || []}
                                            name={`${item.id}.facility_id`}
                                          />
                                        ))}
                                    </div>
                                  </div>
                                );
                              },
                            );
                          })()}
                        </div>
                      </ScheduleSectionContainer>
                      {/* <PageHeading className='mb-4'>
                      Assessment Scheduler
                    </PageHeading> */}

                      {/* <div className='flex flex-col gap-5 mb-10'>
                      {AssessmentData?.map((item: any, index: number) => {
                        return item?.assessment_name !== "CBI" ? (
                          <div className='!h-[124px]'>
                            <PageHeading variant='secondary' className='mb-2'>
                              {item?.assessment_name}
                            </PageHeading>
                            <div className='flex flex-wrap gap-5 mb-2'>
                              <CheckBoxAutocomplete
                                required
                                className='!w-[362.25px] '
                                label={`Select assessor `}
                                levels={AssessorsData || []}
                                name={`${item.id}.assessors`}
                              />

                              {!item?.is_quesionnaire &&
                                (item?.assessment_name === "Business Case" ? (
                                  <CheckBoxAutocomplete
                                    key={`${item.id}.facility_id`}
                                    required
                                    className='!w-[362.25px] '
                                    label='Select Room'
                                    levels={facilityData?.room || []}
                                    name={`${item.id}.facility_id`}
                                  />
                                ) : (
                                  <CustomSelect
                                    key={item?.id}
                                    required
                                    className='!w-[362.25px] h-[48px]'
                                    label='Select Room'
                                    getOptionLabel={(item) => item?.room}
                                    getOptionValue={(item) => item?.id || null}
                                    options={facilityData?.room || []}
                                    name={`${item.id}.facility_id`}
                                  />
                                ))}
                              
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div> */}
                    </div>
                  )}

                  <div className='flex flex-col mb-20'>
                    <ScheduleSectionContainer
                      title='Time Configuration'
                      className=''
                    >
                      <div className='flex gap-5 flex-wrap'>
                        {/* <CustomInput
                        name='break_between_activities'
                        className='!w-[362.25px] h-[48px]'
                        label='Break between activities (min)'
                        type='number'
                        onWheel={(e) => e.currentTarget.blur()}
                      /> */}
                        <CustomInput
                          name='duration_of_each_activity'
                          className='!w-[345.25px] h-[48px]'
                          label='Duration of each activity (min)'
                          type='number'
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setNormalAssessDuration(e?.target?.value)
                          }
                        />
                        <CustomInput
                          name='group_activity_duration'
                          className='!w-[345.25px] h-[48px]'
                          label='Duration of group activity (min)'
                          type='number'
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setGrpActAssessDuration(e?.target?.value)
                          }
                        />

                        <CustomInput
                          name='cbi_activity_duration'
                          className='!w-[345.25px] h-[48px]'
                          label='Duration of CBI activity (min)'
                          type='number'
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setCbiAssessDuration(e?.target?.value)
                          }
                        />
                        <CustomInput
                          name='welcome_sess_duration'
                          className='!w-[345.25px] h-[48px]'
                          label='Duration of wlecome and closure session (min)'
                          type='number'
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setWelocomSetionDuration(e?.target?.value)
                          }
                        />
                        <CustomInput
                          name='short_break_duration'
                          className='!w-[345.25px] h-[48px]'
                          label='Short Break Duration (min)'
                          type='number'
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setShortBreakDuration(e?.target?.value)
                          }
                        />

                        {selectedClient &&
                          selectedProject &&
                          selectedCohort && (
                            <DatePickerWithRange
                              fromDate={new Date()}
                              required
                              label='Class Start and end date'
                              value={date}
                              name='start'
                              buttonClassName='!w-[345.25px]'
                              className='!w-[345.25px] h-[48px]'
                              onChange={(range) => {
                                setDate(range);
                                if (range?.from && range?.to) {
                                  const startDate = new Date(range.from);
                                  const endDate = new Date(range.to);
                                  const totalDays =
                                    (endDate.getTime() - startDate.getTime()) /
                                      (1000 * 60 * 60 * 24) +
                                    1;

                                  const rows = Array.from(
                                    { length: totalDays },
                                    (_, index) => {
                                      const currentDate = new Date(startDate);
                                      currentDate.setDate(
                                        startDate.getDate() + index + 1,
                                      );
                                      return {
                                        date: currentDate
                                          .toISOString()
                                          .split("T")[0],
                                        first_break_start_time: "",
                                        first_break_end_time: "",
                                        second_break_start_time: "",
                                        second_break_end_time: "",
                                        lunch_break_start_time: "",
                                        lunch_break_end_time: "",
                                      };
                                    },
                                  );

                                  setFieldValue("daily_breaks", rows);
                                }
                              }}
                            />
                          )}
                        <TimeRangePicker
                          label='Day start and end time'
                          startTimeName='day_start_time'
                          endTimeName='day_end_time'
                        />
                      </div>
                    </ScheduleSectionContainer>
                    {/* {values?.start?.from && values?.start?.to && (
                      <ScheduleSectionContainer
                        title='Break Configuration'
                        className='mt-5 '
                      > */}
                    {/* <div className='flex gap-5 flex-wrap'>
                        {values.daily_breaks?.length > 0 && (
                          <table className='w-full border '>
                            <thead>
                              <tr className='h-[60px] bg-[#EFF4FF]'>
                                <th className='border p-2'>Date</th>
                                <th className='border p-2'>Break 1</th>
                                <th className='border p-2'>Break 2</th>
                                <th className='border p-2'>Lunch Break</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.daily_breaks.map(
                                (row: any, index: number) => (
                                  <tr
                                    key={index}
                                    className='h-[60px] text-center'
                                  >
                                    <td className='border p-2 !h-[60px] '>
                                      {row.date}
                                    </td>
                                    <td className='border p-2'>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.first_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.first_break_end_time`}
                                        timeIntervals={15}
                                      />
                                    </td>
                                    <td className='border items-center p-2'>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.second_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.second_break_end_time`}
                                        timeIntervals={15}
                                      />
                                    </td>
                                    <td className='border p-2'>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.lunch_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.lunch_break_end_time`}
                                      />
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        )}
                      </div> */}

                    {/* bellow is the working code  */}
                    {/* <div className='flex gap-5 flex-wrap w-full'>
                          {values.daily_breaks?.length > 0 && (
                            <div className='w-full space-y-4'>
                              {values.daily_breaks.map(
                                (row: any, index: number) => (
                                  <div
                                    key={index}
                                    className=' items-center gap-6 w-full bg-[#F8FAFC] rounded-xl p-4 border grid grid-cols-4'
                                  >
                                    <div className='w-[220px] text-center'>
                                      <label className='text-xs font-medium block mb-1'>
                                        Date
                                      </label>
                                      <div className='bg-white border rounded-lg h-[48px] flex items-center justify-center px-3 shadow-sm'>
                                        {row.date}
                                      </div>
                                    </div>

                                    <div className='flex flex-col'>
                                      <label className='text-xs font-medium mb-1 text-center'>
                                        Break 1
                                      </label>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.first_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.first_break_end_time`}
                                        timeIntervals={15}
                                        // onTimeChange={(e: any) => {
                                        //   console.log(
                                        //     e,
                                        //     "<----------------------------e",
                                        //   );
                                        //   // handleTimeChange(
                                        //   //   "first_break_start_time",
                                        //   //   "first_break_end_time",
                                        //   //   index,
                                        //   //   values,
                                        //   //   setFieldValue,
                                        //   //   e,
                                        //   // );
                                        // }}
                                      />
                                    </div>

                                    <div className='flex flex-col'>
                                      <label className='text-xs font-medium mb-1 text-center'>
                                        Break 2
                                      </label>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.second_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.second_break_end_time`}
                                        timeIntervals={15}
                                      />
                                    </div>

                                    <div className='flex flex-col'>
                                      <label className='text-xs font-medium mb-1 text-center'>
                                        Lunch Break
                                      </label>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.lunch_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.lunch_break_end_time`}
                                      />
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </div> */}
                    {/* </ScheduleSectionContainer>
                    )} */}
                  </div>
                  {/* <div className='flex flex-col mb-16'> */}
                  {/* <PageHeading className='mb-4'>Time Configuration</PageHeading>
                  <div className='flex gap-5 flex-wrap'>
                   
                    <CustomInput
                      name='duration_of_each_activity'
                      className='!w-[362.25px] h-[48px]'
                      label='Duration of each activity (min)'
                      type='number'
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <CustomInput
                      name='group_activity_duration'
                      className='!w-[362.25px] h-[48px]'
                      label='Duration of group activity (min)'
                      type='number'
                      onWheel={(e) => e.currentTarget.blur()}
                    />

                    <CustomInput
                      name='cbi_activity_duration'
                      className='!w-[362.25px] h-[48px]'
                      label='Duration of CBI activity (min)'
                      type='number'
                      onWheel={(e) => e.currentTarget.blur()}
                    />

                    <TimeRangePicker
                      label='Day start and end time'
                      startTimeName='day_start_time'
                      endTimeName='day_end_time'
                    />
                    {selectedClient && selectedProject && selectedCohort && (
                      <DatePickerWithRange
                        fromDate={new Date()}
                        required
                        label='Class Start and end date'
                        value={date}
                        name='start'
                        className=' h-[48px]'
                        onChange={(range) => {
                          setDate(range);
                          if (range?.from && range?.to) {
                            const startDate = new Date(range.from);
                            const endDate = new Date(range.to);
                            const totalDays =
                              (endDate.getTime() - startDate.getTime()) /
                                (1000 * 60 * 60 * 24) +
                              1;

                            const rows = Array.from(
                              { length: totalDays },
                              (_, index) => {
                                const currentDate = new Date(startDate);
                                currentDate.setDate(
                                  startDate.getDate() + index + 1,
                                );
                                return {
                                  date: currentDate.toISOString().split("T")[0],
                                  first_break_start_time: "",
                                  first_break_end_time: "",
                                  second_break_start_time: "",
                                  second_break_end_time: "",
                                  lunch_break_start_time: "",
                                  lunch_break_end_time: "",
                                };
                              },
                            );

                            setFieldValue("daily_breaks", rows);
                          }
                        }}
                      />
                    )}
                  </div> */}

                  {/* {values?.start?.from && values?.start?.to && (
                    <div className='flex flex-col'>
                      <PageHeading className='mb-4'>
                        Break Configuration
                      </PageHeading>
                      <div className='flex gap-5 flex-wrap'>
                        {values.daily_breaks?.length > 0 && (
                          <table className='w-full border '>
                            <thead>
                              <tr className='h-[60px] bg-[#EFF4FF]'>
                                <th className='border p-2'>Date</th>
                                <th className='border p-2'>Break 1</th>
                                <th className='border p-2'>Break 2</th>
                                <th className='border p-2'>Lunch Break</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.daily_breaks.map(
                                (row: any, index: number) => (
                                  <tr
                                    key={index}
                                    className='h-[60px] text-center'
                                  >
                                    <td className='border p-2 !h-[60px] '>
                                      {row.date}
                                    </td>
                                    <td className='border p-2'>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.first_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.first_break_end_time`}
                                        timeIntervals={15}
                                      />
                                    </td>
                                    <td className='border items-center p-2'>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.second_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.second_break_end_time`}
                                        timeIntervals={15}
                                      />
                                    </td>
                                    <td className='border p-2'>
                                      <TimeRangePicker
                                        minTime={values?.day_start_time}
                                        maxTime={values?.day_end_time}
                                        startTimeName={`daily_breaks.${index}.lunch_break_start_time`}
                                        endTimeName={`daily_breaks.${index}.lunch_break_end_time`}
                                      />
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )} */}
                  {/* </div> */}

                  <ButtonFooter>
                    <div className='flex gap-4  justify-end'>
                      <CustomButton
                        isPending={isPending}
                        disabled={
                          isPending ||
                          !values?.start?.from ||
                          !values?.start?.to ||
                          !errors
                        }
                        type='submit'
                        variant={!classData ? "default" : "outline"}
                        onClick={() => {
                          // console.log(
                          //   values?.daily_breaks,
                          //   "<-------------- values?.daily_breaks",
                          // );
                          setBreaks(values?.daily_breaks);
                        }}
                      >
                        {!classData?.scenarios?.length
                          ? "Generate Schedule"
                          : "Regenerate Schedule"}
                      </CustomButton>

                      {/* {classData && (
                        <CustomButton
                          isPending={saveAsDraftPending}
                          disabled={saveAsDraftPending}
                          variant='outline'
                          onClick={() => {
                            handleSaveAsDraft(classData);
                          }}
                        >
                          Save As Draft
                        </CustomButton>
                      )} */}
                      {classData?.scenarios?.length ? (
                        <CustomButton
                          isPending={softLaunchClassPending}
                          disabled={softLaunchClassPending}
                          variant='outline'
                          onClick={() => {
                            handelSoftLaunch(classData, values);
                          }}
                        >
                          Confirm Schedule
                        </CustomButton>
                      ) : null}

                      {classData?.scenarios?.length ? (
                        <CustomButton
                          isPending={launchClassPending}
                          disabled={launchClassPending}
                          onClick={() => {
                            handleLaunchLogic(classData, values);
                          }}
                        >
                          Launch Class
                        </CustomButton>
                      ) : null}
                    </div>
                  </ButtonFooter>
                </div>
              }
            </Form>
          )
        )}
      </Formik>

      {classData?.scenarios && (
        <div className='!mb-16'>
          {assessorConflict?.length ? (
            <div className='text-red-600'>{`${assessorConflict.map((item: any) => item?.assessorName)} is buzzy in another class for reselcted date's`}</div>
          ) : null}
          <Datagrid
            title='Generated Schedule'
            disableFilters
            disableSearch
            data={classData?.scenarios}
            columns={draftColumns}
          />
        </div>
      )}
      {open && <DetailsDialoag data={rowData} setOpen={setOpen} />}
    </div>
  );
};

export default NewClassConfig;
