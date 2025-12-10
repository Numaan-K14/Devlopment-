import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";

import { ButtonFooter, ConfirmDialog } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { CustomLoader } from "@/components/custom-loader";
import { CoustomTextarea } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import SpeachtoText from "@/components/inputs/speach-to-text";
import Timer from "@/components/timer";
import { Alert } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { BsInfoCircle } from "react-icons/bs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import ExpectedBehaviorsDialoagAssessNow from "./components/expectedBehaviourDialog";
const AssessNowPage = () => {
  //------------- state variables ----------------//
  const navigate = useNavigate();
  const { state } = useLocation();
  const class_id = state?.class_id;
  const client_id = state?.client_id;
  const status = state?.status;
  const quessionaire_id = state?.quessionnaire_id;
  const assesment_id = state?.assesment_id;
  const cohort_id = state?.cohort_id;
  const participant_id = state?.participant_id;
  const grp_act_room_id = state?.grp_act_room_id;
  const is_quesionnaire = state?.is_quesionnaire;
  const is_group_activity = state?.is_group_activity;
  const participant_id_singleGet = state?.participant_id_singleGet;
  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;
  const participant_name = state?.participant_name;
  const assessors_id = state?.assessors_id;
  const assessment = state?.assessment;
  const single_get_object_id = state?.single_get_object_id;

  //--------- state management -------------//

  const [open, setOpen] = useState(false);
  const [expectedBehaviorData, setExpectedBehaviorData] = useState<any>();
  const [openExpectedBehaviorsDialog, setOpenExpectedBehaviorsDialog] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [genretCommentryButton, setGenretCommentryButton] = useState(false);
  const [openStartNowDialoag, setOpenStartNowDialoag] = useState(false);
  const [showStartNow, setShowStartNow] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<any>();
  const [comentery, setComentery] = useState<any>();
  const [assesorTabelData, setAssesorTabelData] = useState<any[]>([
    { competency: "", behaviors: [""] },
  ]);
  const [validation, setValidation] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const viewOnly = searchParams.get("viewOnly");
  const [buttonName, setButtonName] = useState("");
  const { data: AssessorData } = useQuery<any>({
    queryKey: [
      state?.type === "group_activity"
        ? `/report/assessment-assessor?grp_act_id=${state?.participant_assesment_id}`
        : `/report/assessment-assessor?part_assesm_id=${state?.participant_assesment_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: viewOnly === "true" && !!assesment_id,
  });
  const [selectedAssessor, setSelectedAssessor] = useState<any>(null);

  useEffect(() => {
    if (AssessorData) {
      setSelectedAssessor(AssessorData?.[0]);
    }
  }, [AssessorData]);

  //---------- validation schema ---------------//
  const saveSchema = Yup.object({
    score: Yup.string().matches(
      /^(?:[0-4](?:\.\d{1})?|5(?:\.0{1,2})?)$/,
      "Score must be a number between 0 and 5 (up to 1 decimal places)",
    ),
  });
  const submitSchema = Yup.object({
    score: Yup.string()
      .required("This field is required")
      .matches(
        /^(?:[0-4](?:\.\d{1})?|5(?:\.0{1,2})?)$/,
        "Score must be a number between 0 and 5 (up to 1 decimal places)",
      ),
  });
  const validationSchema = Yup.object({
    data:
      user && user.role !== "participant" && !is_group_activity
        ? Yup.array().of(validation === true ? submitSchema : saveSchema)
        : Yup.array(),
    response_score:
      user && user.role === "participant" && !is_group_activity
        ? Yup.array()
        : Yup.array().of(submitSchema),

    ...(is_group_activity && {
      data: Yup.array().of(
        Yup.object({
          response_score: Yup.array().of(submitSchema),
          grp_act_remark: Yup.string().required(
            "Remark is required for group activity",
          ),
        }),
      ),
    }),
  });

  //----------  api calls ------------//
  const { data: Data, refetch } = useQuery<any>({
    queryKey: [
      state?.assessment_resp_id
        ? `/class/getassessment-response/${participant_id_singleGet}/${state?.assesment_id}/${class_id}/${single_get_object_id}/${viewOnly === "true" ? selectedAssessor?.id : assessors_id}?assessment_resp_id=${state?.assessment_resp_id}`
        : `/class/getassessment-response/${participant_id_singleGet}/${state?.assesment_id}/${class_id}/${single_get_object_id}/${assessors_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled:
      !!participant_id_singleGet &&
      !!state?.assesment_id &&
      (user?.role === "assessor" || user?.role === "admin") &&
      !is_quesionnaire &&
      (viewOnly === "true" ? !!selectedAssessor : true),
  });

  const fetchAssessment = async () => {
    let data = await axios.get(
      `/class/getassessment-response/${participant_id_singleGet}/${state?.assesment_id}/${class_id}/${single_get_object_id}/${assessors_id}?assessment_resp_id=${state?.assessment_resp_id}`,
    );
    if (data?.data?.data) {
      setInitialValues({
        commentary:
          data?.data?.data?.[0]?.participant_score?.[0]?.response?.commentary ||
          "",
        audio_file: data?.data?.data?.audio_file || null,
        assessment_response:
          data?.data?.data?.[0]?.participant_score?.[0]?.assessment_response,
        is_draft: "",
        over_all_obs:
          data?.data?.data?.[0]?.participant_score?.[0]?.response?.par_as
            ?.class_assessors?.[0]?.over_all_obs,
        response_score: data?.data?.data?.map((item: any) => ({
          id: item?.participant_score?.[0]?.id || "",
          score: item?.participant_score?.[0]?.sc_pa?.[0]?.score || "",
          observation:
            item?.participant_score?.[0]?.sc_pa?.[0]?.observation || "",
          summary: item?.participant_score?.[0]?.summary || "",
          competency_id: item?.participant_score?.[0]?.competency_id || "",
        })),
      });
    }
  };
  console.log(state, "<------- statq");
  const { data: SingleGetData } = useQuery<any>({
    queryKey: [
      `/class/getassessment-response/${participant_id_singleGet}/${state?.assesment_id}/${class_id}/${single_get_object_id}/${assessors_id}?assessment_resp_id=${state?.assessment_resp_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled:
      !!participant_id_singleGet &&
      !!state?.assesment_id &&
      user?.role === "assessor" &&
      !is_quesionnaire &&
      !!single_get_object_id &&
      !!state?.assessment_resp_id,
  });

  const { data: QuestionsData } = useQuery<any>({
    queryKey: [
      `/assessment/client-assessments-quessionnaire/${client_id}/${cohort_id}/${participant_id}/${assesment_id}/${single_get_object_id}/${state?.quessionnaire_id}/${viewOnly === "true" ? selectedAssessor?.id : assessors_id}?assem_resp_id=${state?.assessment_resp_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled:
      !!client_id &&
      is_quesionnaire &&
      (viewOnly === "true" ? !!selectedAssessor : true),
  });

  const { data: CompetiencyDataForGroupActivity } = useQuery<any>({
    queryKey: [
      `/class/getassessment-response-grp-act/${grp_act_room_id}/${state?.assesment_id}/${state?.class_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: !!state?.class_id && !!state?.assesment_id && !!grp_act_room_id,
  });

  const [initialValues, setInitialValues] = useState(
    user?.role === "assessor" && !is_quesionnaire && !is_group_activity
      ? {
          commentary: "",
          audio_file: null,
          assessment_response: "",
          is_draft: "",
          over_all_obs: "",
          response_score: assesorTabelData.map((item) => ({
            id: "",
            score: "",
            observation: "",
            summary: "",
            competency_id: item?.competency_id,
          })),
        }
      : user?.role === "assessor" && !!is_group_activity
        ? {
            data: CompetiencyDataForGroupActivity?.map((item: any) => ({
              assessment_id:
                item?.gr_act_part?.[0]?.gr_act_rooms?.assessment_id || "",
              assessor_id:
                item?.gr_act_part?.[0]?.gr_act_rooms?.assessor_id || "",
              class_id: item?.gr_act_part?.[0]?.gr_act_rooms?.class_id || "",
              participant_id: item?.id || "",
              grp_act_remark: "",
              assessment_response: "",
              response_score: item.competencies.map((comp: any) => ({
                id: "",
                score: "",
                observation: "",
                competency_id: comp.id,
              })),
            })),
          }
        : user?.role === "participant" && is_quesionnaire
          ? {
              is_draft: "",
              data: QuestionsData?.questions?.map((item: any) => ({
                question_id: item?.id,
                response: "",
                quessionaire_id: state?.quessionnaire_id,
                class_id: class_id,
                assessor_id: state?.assessors_id,
                assessment_id: state?.assesment_id,
                participant_id: state?.participant_id,
              })),
            }
          : {},
  );

  useEffect(() => {
    if (
      user?.role === "assessor" &&
      is_group_activity &&
      CompetiencyDataForGroupActivity?.length > 0 &&
      CompetiencyDataForGroupActivity?.[0]?.assessment_response?.length === 0
    ) {
      const data = CompetiencyDataForGroupActivity.map((item: any) => ({
        assessment_id:
          item?.gr_act_part?.[0]?.gr_act_rooms?.assessment_id || "",
        assessor_id: item?.gr_act_part?.[0]?.gr_act_rooms?.assessor_id || "",
        class_id: item?.gr_act_part?.[0]?.gr_act_rooms?.class_id || "",
        participant_id: item?.id || "",
        grp_act_remark: "",
        assessment_response: "",
        response_score: item.competencies.map((comp: any) => ({
          id: "",
          score: "",
          observation: "",
          competency_id: comp.id,
        })),
      }));

      setInitialValues({ data });
    }
  }, [CompetiencyDataForGroupActivity, is_group_activity, user?.role]);

  useEffect(() => {
    if (Data && Data?.[0]?.participant_score?.length && !is_quesionnaire) {
      setInitialValues({
        commentary:
          Data?.[0]?.participant_score?.[0]?.response?.commentary || "",
        audio_file: Data?.audio_file || null,
        assessment_response:
          Data?.[0]?.participant_score?.[0]?.assessment_response,
        is_draft: "",
        over_all_obs:
          Data?.[0]?.participant_score?.[0]?.response?.par_as
            ?.class_assessors?.[0]?.over_all_obs,
        response_score: Data?.map((item: any) => ({
          id: item?.participant_score?.[0]?.id || "",
          score: item?.participant_score?.[0]?.sc_pa?.[0]?.score || "",
          observation:
            item?.participant_score?.[0]?.sc_pa?.[0]?.observation || "",
          summary: item?.participant_score?.[0]?.summary || "",
          competency_id: item?.participant_score?.[0]?.competency_id || "",
        })),
      });
    } else if (QuestionsData?.questions?.length) {
      setInitialValues({
        is_draft: "",
        data:
          QuestionsData?.questions &&
          QuestionsData?.questions?.length &&
          (user?.role === "assessor" || user?.role === "admin")
            ? QuestionsData?.questions?.map((item: any) => ({
                id: item?.quess_resp?.[0]?.assess_score?.[0]?.id,
                question_id: item?.quess_resp?.[0]?.question_id,
                response: item?.quess_resp?.[0]?.response || "",
                quessionaire_id: quessionaire_id,
                assessment_response: item?.quess_resp?.[0]?.assm_resp?.id,
                class_id: state?.class_id,
                assessor_id: state?.assessors_id,
                assessment_id: QuestionsData?.assessment_id,
                score: item?.quess_resp?.[0]?.assess_score?.[0]?.score || "",
                role: user?.role,
                quessionnaire_id: quessionaire_id,
                participant_id: state?.participant_id,
                quess_resp_id: item?.quess_resp?.[0]?.id,
              }))
            : QuestionsData &&
              QuestionsData?.questions?.map((item: any) => ({
                id: item?.quess_resp?.[0]?.id,
                competency_id: item?.competency_id,
                question_id: item?.id,
                response: item?.quess_resp?.[0]?.response || "",
                quessionaire_id: quessionaire_id,
                class_id: class_id,
                assessor_id: state?.assessors_id,
                assessment_id: state?.assesment_id,
                participant_id: state?.participant_id,
              })),
      });
    } else if (
      CompetiencyDataForGroupActivity &&
      CompetiencyDataForGroupActivity.length &&
      is_group_activity &&
      CompetiencyDataForGroupActivity?.[0]?.assessment_response?.length
    ) {
      const formattedData = CompetiencyDataForGroupActivity?.flatMap(
        (item: any) =>
          item?.assessment_response?.map((i: any) => ({
            assessment_id: i?.assessment_id || "",
            assessor_id: i?.assessor_id || "",
            class_id: item?.gr_act_part?.[0]?.gr_act_rooms?.class_id || "",
            grp_act_remark: i?.grp_act_remark || "",
            participant_id: i?.participant_id || "",
            assessment_response: i?.id || "",
            response_score:
              i?.scores?.map((score: any) => ({
                id: score?.id,
                observation: score?.sc_pa?.[0]?.observation || "",
                score: score?.sc_pa?.[0]?.score || "",
                competency_id: score?.competency_id || "",
              })) || [],
          })) || [],
      );

      setInitialValues({ data: formattedData });
    }
  }, [SingleGetData, QuestionsData, CompetiencyDataForGroupActivity, Data]);

  useEffect(() => {
    if (Data) {
      const tempData = Data.map((item: any) => ({
        competency_id: item?.id,
        competency: item?.competency,
        behaviors: item?.expected_behaviours?.map(
          (i: any) => i?.expected_behaviour,
        ),
      }));
      setAssesorTabelData(tempData);
      if (!Data?.[0]?.participant_score?.length) {
        setInitialValues({
          commentary: "",
          audio_file: null,
          assessment_response: "",
          is_draft: "",
          over_all_obs: "",
          response_score: tempData.map((item: any) => ({
            id: "",
            score: "",
            observation: "",
            summary: "",
            competency_id: item?.competency_id,
          })),
        });
      }
    }
    if (
      Data?.[0]?.participant_score?.length &&
      Data?.[0]?.participant_score?.[0]?.summary !== ""
    ) {
      setShowAlert(false);
    }
    if (
      Data?.[0]?.participant_score?.length &&
      Data?.[0]?.participant_score?.[0]?.summary === ""
    ) {
      setGenretCommentryButton(true);
    }
  }, [Data]);

  //----------- post api calls -----------//

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      participant_id_singleGet && Data?.[0]?.participant_score?.length
        ? axios.put(
            `/class/assessment-response/${Data?.[0]?.participant_score?.[0]?.response?.id}`,
            data,
          )
        : axios.post(`/class/assessment-response`, data),
  });

  const { mutate: mutateForQuestioner, isPending: mutateForQuestionerPending } =
    useMutation({
      mutationFn: (data: any) => {
        return QuestionsData?.questions &&
          QuestionsData?.questions?.[0]?.quess_resp?.[0]?.assess_score?.length
          ? axios.put("/class/update-assessment-quess-response", data)
          : axios.post(`/class/create-quessionnaire-response-assessor`, data);
      },
    });

  const {
    mutate: mutateForParticipantQuestioner,
    isPending: mutateForParticipantQuestionerPending,
  } = useMutation({
    mutationFn: (data: any) => {
      return QuestionsData?.questions &&
        QuestionsData?.questions?.[0]?.quess_resp.length
        ? axios.put("/class/update-part-quess-resp", data)
        : axios.post(`/class/create-quess-response`, data);
    },
  });

  const { mutate: handleFileUploadMutate, isPending: fileUploadPending } =
    useMutation({
      mutationFn: (data: { data: FormData; id: any }) => {
        return axios.post(`/class/upload-file/${data.id}`, data.data);
      },
    });

  const {
    mutate: handleGenrateAISummaryMutate,
    isPending: genrateAISummaryPending,
  } = useMutation({
    mutationFn: (data: { commentary: string; assessment_id: string }) =>
      axios.post(`/class/update-commentary`, data),
    onSuccess: (data: any) => {
      fetchAssessment();
    },
  });

  const { mutate: handleStartNowMutate, isPending: startAssessmentPending } =
    useMutation({
      mutationFn: () =>
        axios.put(
          `/class/start-assessment/${state.participant_id}/${state?.assesment_id}`,
          {},
        ),
      onSuccess: (data) => {
        toast.success(data.data.msg || " Assessment Started!");

        setOpenStartNowDialoag(false);
      },
    });

  const { mutate: handleGroupActivityMutate, isPending: groupPending } =
    useMutation({
      mutationFn: (data) =>
        CompetiencyDataForGroupActivity?.[0]?.assessment_response?.length
          ? axios.put(
              `/class/assessment-response-grp-act/${CompetiencyDataForGroupActivity?.[0]?.gr_act_part?.[0]?.gr_act_room_id}`,
              data,
            )
          : axios.post(`/class/assessment-response-grp-act`, data),
      onSuccess: (data) => {
        toast.success(data.data.msg || "Submited");
        navigate(-1);
      },
    });

  //-------- handel file upload -----------//
  const handleFileUpload = (values: any, id: any, resetForm: any) => {
    const formData = new FormData();
    if (values.audio_file) {
      formData.append("audio_file", values.audio_file);
    }
    handleFileUploadMutate(
      { data: formData, id },
      {
        onSuccess: (data) => {
          resetForm();
          setShowStartNow(false);
          navigate("/assessments");
          toast.success(data.data.msg || "Successfully submitted!");
          queryClient.refetchQueries({
            queryKey: [`class/participants-assessments/${user?.assessor_id}`],
          });
        },
      },
    );
  };

  const handleRecordingStop = async (
    audioFile: File,
    currentTranscript: string,
    values: any,
  ) => {
    try {
      mutate(
        {
          par_ass_id: state?.participant_assesment_id,
          class_id: class_id,
          scenerio_id: state?.scenerio_id,
          quessionnaire_id: state?.quessionnaire_id,
          assessor_id: state?.assessors_id,
          assessment_id: state?.assesment_id,
          participant_id: state?.participant_id,
          commentary: currentTranscript,
          audio_file: null,
          is_draft: "inprogress",
          response_score: values?.response_score?.map((item: any) => ({
            id: "",
            score: item?.score,
            observation: item?.observation,
            summary: "",
            competency_id: item?.competency_id || "",
          })),
        },
        {
          onSuccess: (resp) => {
            setButtonDisable(true);
            refetch();
            const formData = new FormData();
            formData.append("audio_file", audioFile);

            handleFileUploadMutate(
              { data: formData, id: resp?.data?.data?.data?.assResponse?.id },
              {
                onSuccess: (data) => {
                  setButtonDisable(true);
                  setGenretCommentryButton(true);
                  toast.success("Audio file uploaded successfully!");
                },
                onError: (error) => {
                  toast.error("Failed to upload audio file");
                },
              },
            );
          },
          onError: (error) => {
            toast.error("Failed to save assessment");
          },
        },
      );
    } catch (error) {
      toast.error("Failed to process audio recording");
    }
  };

  const handleSubmitRecording = (
    audioFile: any,
    commentary: any,
    values: any,
  ) => {
    handleRecordingStop(audioFile, commentary, values);
  };

  const handleGenrateAISummary = (commentry: string, assessment_id: string) => {
    handleGenrateAISummaryMutate(
      {
        commentary: commentry,
        assessment_id: assessment_id,
      },
      {
        onSuccess: (data: any) => {
          refetch();
          setShowAlert(false);
        },
        onError: (error: any) => {
          setShowAlert(false);
          toast.error(error?.response?.data?.message);
        },
      },
    );
  };

  useEffect(() => {
    if (
      initialValues?.commentary !== "" &&
      user &&
      user.role !== "participant" &&
      !is_group_activity
    ) {
      setValidation(true);
    }
  }, [initialValues]);

  const handleSaveNormalAssessment = ({
    data,
    currentTranscript,
  }: {
    data: any;
    currentTranscript: string;
  }) => {
    // return console.log(data, ",------------------- handleSaveNormalAssessment");
    try {
      mutate(
        {
          par_ass_id: state?.participant_assesment_id,
          class_id: class_id,
          scenerio_id: state?.scenerio_id,
          quessionnaire_id: state?.quessionnaire_id,
          assessor_id: state?.assessors_id,
          assessment_id: state?.assesment_id,
          participant_id: state?.participant_id,
          assessment_response: data?.assessment_response,
          commentary: currentTranscript,
          audio_file: null,
          is_draft: "inprogress",
          over_all_obs: data?.over_all_obs,
          response_score: data?.response_score?.map((item: any) => ({
            id: item?.id,
            score: item?.score,
            observation: item?.observation || "",
            summary: item?.summary || "",
            competency_id: item?.competency_id || "",
          })),
        },
        {
          onSuccess: (resp) => {
            navigate(-1);
          },
          onError: (error) => {
            toast.error("Failed to save assessment");
          },
        },
      );
    } catch (error) {
      toast.error("Failed to save assessment");
    }
  };

  const handleSaveQuestionerForAssessor = (values: any) => {
    const enrichedData = {
      assessment_id: values?.data?.[0]?.assessment_id,
      assm_resp_id: values?.data?.[0]?.assessment_response,
      class_id: values?.data?.[0]?.class_id,
      participant_id: values?.data?.[0]?.participant_id,
      assessor_id: values?.data?.[0]?.assessor_id,
      is_draft: "inprogress",
      role: user?.role,
      par_ass_id: single_get_object_id,
      quessionnaire_id: state?.quessionnaire_id,
      ...(QuestionsData?.questions?.[0]?.quess_resp?.[0]?.assess_score?.length
        ? {
            response_score: values?.data?.map((item: any) => ({
              id: item?.id,
              score: item?.score,
              quess_resp_id: item?.id,
            })),
          }
        : {
            score: values?.data?.map((item: any) => ({
              score: item?.score,
              quess_resp_id: item?.quess_resp_id,
            })),
          }),
    };
    mutateForQuestioner(
      { ...enrichedData },
      {
        onSuccess: (data: any) => {
          navigate(-1);
          toast.success(data.data.msg || "Successfully submitted!");
        },
      },
    );
  };

  const handleSaveGroupActivityAssessment = (values: any) => {
    if (CompetiencyDataForGroupActivity?.[0]?.assessment_response?.length) {
      const data = values?.data?.map((item: any) => ({
        ...item,
        is_draft: "inprogress",
        scenerio_id: state?.scenerio_id,
      }));
      handleGroupActivityMutate(data);
    } else {
      const data = values?.data?.map((item: any) => ({
        ...item,
        is_draft: "inprogress",
        assessment_id: state?.assesment_id,
        class_id: state?.class_id,
        scenerio_id: state?.scenerio_id,
        gr_act_room_id: grp_act_room_id,
      }));
      handleGroupActivityMutate(data);
    }
  };

  if (!Data && !CompetiencyDataForGroupActivity && !QuestionsData)
    return viewOnly === "true" && !state?.is_group_activity ? (
      <CustomSelect
        required
        className='!w-[362.25px] h-[48px]'
        label='Select Assessor'
        getOptionLabel={(item) => item?.assessor_name}
        getOptionValue={(item) => item?.id}
        options={AssessorData || []}
        value={selectedAssessor}
        onChange={(item) => {
          setSelectedAssessor(item);
        }}
      />
    ) : (
      <CustomLoader />
    );
  return (
    <>
      <AppBar
        showNav
        subTitle={`Participant: ${participant_name ? participant_name : ""}`}
        title={assessment}
      />
      {genrateAISummaryPending && (
        <>
          <div className='fixed h-full w-[85%] flex flex-col items-center justify-center  backdrop-blur-sm z-[1000]'>
            <div className='text-6xl mt-[-300px] animate-brain'>🧠</div>

            <div className='flex gap-2 mt-4'>
              <span className='w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-[0ms]'></span>
              <span className='w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-[200ms]'></span>
              <span className='w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-[400ms]'></span>
            </div>

            <p className='mt-3 text-black text-sm'>Generating AI Summary...</p>
          </div>
        </>
      )}
      {viewOnly === "true" && !state?.is_group_activity && (
        <CustomSelect
          required
          className='!w-[362.25px] mb-7 h-[48px]'
          label='Select Assessor'
          getOptionLabel={(item) => item?.assessor_name}
          getOptionValue={(item) => item?.id}
          options={AssessorData || []}
          value={selectedAssessor}
          onChange={(item) => {
            setSelectedAssessor(item);
          }}
        />
      )}

      {/* {!is_group_activity && (
        <PageHeading>
          Participant: {participant_name ? participant_name : ""} - {assessment}
        </PageHeading>
      )} */}
      {!is_quesionnaire &&
        !is_group_activity &&
        showStartNow === true &&
        !Data?.[0]?.participant_score?.length &&
        viewOnly !== "true" && (
          <div className='absolute top-0 right-0 mt-7 mr-7'>
            <Timer playSound={true} />

            {openStartNowDialoag && (
              <ConfirmDialog
                confirmButtonName='Start'
                confirmMessage='Are you sure you want to start the assessment ?'
                isPending={startAssessmentPending}
                title={
                  <span className='flex gap-3 items-center'>
                    <FiAlertCircle className='size-10 text-[#FFAE43]' />
                    Confirm Submission ?
                  </span>
                }
                onClose={() => setOpenStartNowDialoag(false)}
                onConfirm={() => handleStartNowMutate()}
              />
            )}
          </div>
        )}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values: any, { resetForm }) => {
          if (buttonName === "forAssessor") {
            const data = {
              class_id: class_id,
              scenerio_id: state?.scenerio_id,
              quessionnaire_id: state?.quessionnaire_id,
              assessor_id: state?.assessors_id,
              assessment_id: state?.assesment_id,
              participant_id: state?.participant_id,
              par_ass_id: single_get_object_id,
              ...values,
            };
            {
              Data?.[0]?.participant_score?.summary !== ""
                ? mutate(
                    { ...data },
                    {
                      onSuccess: (resp) => {
                        resetForm();
                        toast.success("Assessment submited successfully");
                        navigate("/assessments");
                      },
                    },
                  )
                : mutate(
                    {
                      ...data,
                    },
                    {
                      onSuccess: (resp) => {
                        handleFileUpload(
                          values,
                          resp?.data?.data?.data?.assResponse?.id,
                          resetForm,
                        );
                      },
                    },
                  );
            }
          } else if (buttonName === "forParticipant") {
            let enrichedData = {};
            if (
              user?.role === "participant"
                ? (enrichedData = {
                    assessment_id: values?.data?.[0]?.assessment_id,
                    class_id: values?.data?.[0]?.class_id,
                    assessment_response: values?.data?.[0]?.assessment_response,
                    participant_id: values?.data?.[0]?.participant_id,
                    assessor_id: values?.data?.[0]?.assessor_id,
                    is_draft: values?.is_draft,
                    role: user?.role,
                    par_ass_id: single_get_object_id,
                    quessionnaire_id: state?.quessionnaire_id,
                    ...(QuestionsData?.questions?.[0]?.quess_resp?.length
                      ? {
                          response: values?.data?.map((item: any) => ({
                            id: item?.id,
                            competency_id: item?.competency_id,
                            response: item?.response,
                            question_id: item?.question_id,
                            quessionaire_id: item?.quessionaire_id,
                            assessm_resp_id: state?.assessment_resp_id,
                          })),
                        }
                      : {
                          response_score: values?.data?.map((item: any) => ({
                            id: item?.id,
                            competency_id: item?.competency_id,
                            response: item?.response,
                            question_id: item?.question_id,
                            quessionaire_id: item?.quessionaire_id,
                            assessm_resp_id: state?.assessment_resp_id,
                          })),
                        }),
                  })
                : (enrichedData = {
                    assessment_id: values?.data?.[0]?.assessment_id,
                    assm_resp_id: values?.data?.[0]?.assessment_response,
                    class_id: values?.data?.[0]?.class_id,
                    participant_id: values?.data?.[0]?.participant_id,
                    assessor_id: values?.data?.[0]?.assessor_id,
                    is_draft: values?.is_draft,
                    role: user?.role,
                    par_ass_id: single_get_object_id,
                    quessionnaire_id: state?.quessionnaire_id,
                    ...(QuestionsData?.questions?.[0]?.quess_resp?.[0]
                      ?.assess_score?.length
                      ? {
                          response_score: values?.data?.map((item: any) => ({
                            id: item?.id,
                            score: item?.score,
                            quess_resp_id: item?.id,
                          })),
                        }
                      : {
                          score: values?.data?.map((item: any) => ({
                            score: item?.score,
                            quess_resp_id: item?.quess_resp_id,
                          })),
                        }),
                  })
            )
              // eslint-disable-next-line
              user?.role === "assessor"
                ? mutateForQuestioner(
                    { ...enrichedData },
                    {
                      onSuccess: (data: any) => {
                        resetForm();
                        toast.success(
                          data.data.msg || "Successfully submitted!",
                        );
                        navigate("/assessments");
                        queryClient.refetchQueries({
                          queryKey: [
                            `class/participants-assessments/${user?.assessor_id}`,
                          ],
                        });
                      },
                    },
                  )
                : user?.role === "participant"
                  ? mutateForParticipantQuestioner(
                      { ...enrichedData },
                      {
                        onSuccess: (data: any) => {
                          resetForm();
                          toast.success(
                            data.data.msg || "Successfully submitted!",
                          );
                          navigate("/assessments");
                          queryClient.refetchQueries({
                            queryKey: [
                              `class/participants-assessments/${user?.assessor_id}`,
                            ],
                          });
                        },
                      },
                    )
                  : null;
          } else if (buttonName === "groupActivity") {
            if (
              CompetiencyDataForGroupActivity?.[0]?.assessment_response?.length
            ) {
              const data = values?.data?.map((item: any) => ({
                ...item,
                is_draft: values?.is_draft,
                scenerio_id: state?.scenerio_id,
              }));
              handleGroupActivityMutate(data);
            } else {
              const data = values?.data?.map((item: any) => ({
                ...item,
                is_draft: values?.is_draft,
                assessment_id: state?.assesment_id,
                class_id: state?.class_id,
                scenerio_id: state?.scenerio_id,
                gr_act_room_id: grp_act_room_id,
              }));
              handleGroupActivityMutate(data);
            }
          }
        }}
      >
        {({ setFieldValue, values, handleSubmit, validateForm, isValid }) => (
          // console.log(values, "<----------- vlaues"),
          <Form>
            <>
              {!(is_quesionnaire || is_group_activity) && (
                <>
                  <div className='border relative bg-white !min-h-[150px] mb-10'>
                    <div className='bg-[#EFF4FF] h-[60px] px-4 py-[19px]  text-left align-middle font-medium text-muted-foreground'>
                      Transcript
                    </div>
                    <div className='p-5'>
                      <SpeachtoText
                        disabled={Data?.[0]?.participant_score?.length}
                        disableEditCommentry={
                          Data?.[0]?.participant_score?.length &&
                          values?.response_score?.[0]?.summary !== ""
                        }
                        showEditBox={genretCommentryButton}
                        name='commentary'
                        setFieldValue={setFieldValue}
                        value={values?.commentary && values?.commentary}
                        showButton={!Data?.[0]?.participant_score?.length}
                        onRecordingStop={(audioFile) => {
                          setAudioFile(audioFile);
                          setComentery(values?.commentary);
                        }}
                        isRecording={setIsRecording}
                      />
                    </div>
                    {audioFile &&
                      !genretCommentryButton &&
                      isRecording === false && (
                        <div className='absolute top-[105px] right-[240px]'>
                          <CustomButton
                            onClick={() => {
                              handleSubmitRecording(
                                audioFile,
                                values?.commentary,
                                values,
                              );
                            }}
                            className='rounded-full'
                            disabled={
                              buttonDisable || isPending || fileUploadPending
                            }
                            isPending={isPending || fileUploadPending}
                          >
                            Generate Commentary
                          </CustomButton>
                        </div>
                      )}

                    {!!Data?.[0]?.participant_score?.length ? (
                      <audio
                        controls
                        src={
                          Data?.[0]?.participant_score?.[0]?.response
                            ?.audio_file
                        }
                        className='w-full mb-2 px-4'
                      />
                    ) : null}
                    {!!Data?.[0]?.participant_score?.length &&
                      values?.response_score?.[0]?.summary === "" && (
                        <div className='absolute top-3 right-3'>
                          <CustomButton
                            onClick={() => {
                              handleGenrateAISummary(
                                values?.commentary,
                                values?.assessment_response,
                              );
                              setShowAlert(true);
                            }}
                            disabled={genrateAISummaryPending}
                            isPending={genrateAISummaryPending}
                          >
                            Generate AI Summary
                          </CustomButton>
                        </div>
                      )}
                  </div>

                  <div className='border relative !min-h-[150px] mb-10 bg-white'>
                    <div className='bg-[#EFF4FF] h-[60px] px-4 py-[19px]  text-left align-middle font-medium text-muted-foreground'>
                      Assessor Observation
                    </div>
                    <div className='p-5'>
                      <CoustomTextarea
                        disabled={status === "completed"}
                        name='over_all_obs'
                        placeholder='Enter remarks...'
                        className='w-full !min-h-full h-[220px]'
                      />
                    </div>
                  </div>

                  {showAlert &&
                  Data?.[0]?.participant_score?.length &&
                  values?.response_score?.[0]?.summary === "" ? (
                    <div className='mb-5 mt-[-20px]'>
                      <Alert className='border-[#4338CAs] !rounded-[10px] text-[#4338CA]'>
                        Generating AI summary. please be patient...
                      </Alert>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className='overflow-x-auto mb-20'>
                    <Table className='w-full border bg-white'>
                      <TableHeader>
                        <TableRow className='bg-[#EFF4FF] h-[60px]'>
                          <TableHead className='!w-[154px] border-r text-[#5F6D7E] text-sm font-medium'>
                            Competency
                          </TableHead>
                          <TableHead className='!w-[314px] border-r text-[#5F6D7E] text-sm font-medium'>
                            Expected Behaviors
                          </TableHead>
                          <TableHead className='!w-[450px] border-r text-[#5F6D7E] text-sm font-medium'>
                            AI Summary
                          </TableHead>
                          <TableHead className='!w-[450px] border-r text-[#5F6D7E] text-sm font-medium'>
                            Observations
                          </TableHead>
                          <TableHead className='!w-[127px] border-r text-[#5F6D7E] text-sm font-medium'>
                            Score (Out of 5)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assesorTabelData.map((item, index) => (
                          <>
                            {item?.behaviors.map(
                              (behavior: any, subIndex: number) => (
                                <TableRow key={`${index}-${subIndex}`}>
                                  {subIndex === 0 && (
                                    <TableCell
                                      rowSpan={item?.behaviors.length}
                                      className='align-middle text-center border-r  items-center text-[#5F6D7E] text-sm'
                                    >
                                      {item.competency}
                                    </TableCell>
                                  )}
                                  <TableCell className='border-r text-[#5F6D7E] text-sm'>
                                    {behavior}
                                  </TableCell>
                                  {subIndex === 0 && (
                                    <TableCell
                                      className='align-top'
                                      rowSpan={item.behaviors.length}
                                    >
                                      <CoustomTextarea
                                        disabled={true}
                                        name={`response_score[${index}].summary`}
                                        placeholder='Enter notes...'
                                        className='w-full !min-h-[320px] !h-full'
                                      />
                                    </TableCell>
                                  )}
                                  {subIndex === 0 && (
                                    <TableCell
                                      className='align-top border-r !h-full'
                                      rowSpan={item.behaviors.length}
                                    >
                                      <CoustomTextarea
                                        disabled={status === "completed"}
                                        name={`response_score[${index}].observation`}
                                        placeholder='Enter remarks...'
                                        className='w-full !min-h-[320px] !h-full'
                                      />
                                    </TableCell>
                                  )}

                                  {subIndex === 0 && (
                                    <TableCell
                                      className='align-top border-r'
                                      rowSpan={item?.behaviors?.length}
                                    >
                                      {" "}
                                      <CustomInput
                                        disabled={status === "completed"}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `response_score[${index}].score`,
                                            e.target?.value,
                                          );

                                          setFieldValue(
                                            `response_score[${index}].competency_id`,
                                            item?.competency_id,
                                          );
                                        }}
                                        name={`response_score[${index}].score`}
                                        type='number'
                                        onWheel={(e) => e.currentTarget.blur()}
                                      />
                                    </TableCell>
                                  )}
                                </TableRow>
                              ),
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                    <ButtonFooter>
                      <div className='flex gap-4 justify-end'>
                        <CustomButton
                          variant='outline'
                          onClick={() => {
                            navigate(-1 as any, {
                              state: { tabselected: "1" },
                            });
                          }}
                        >
                          {viewOnly ? "Back" : "Cancel"}
                        </CustomButton>

                        {status !== "completed" && (
                          <>
                            <CustomButton
                              variant='outline'
                              // type='submit'
                              isPending={isPending}
                              disabled={isPending || !values?.commentary}
                              onClick={() => {
                                handleSaveNormalAssessment({
                                  data: values,
                                  currentTranscript: values?.commentary,
                                });
                                // setFieldValue("is_draft", "inprogress");
                                // setButtonName("forAssessor");
                              }}
                            >
                              Save Response
                            </CustomButton>
                            <CustomButton
                              disabled={
                                showAlert ||
                                !Data?.[0]?.participant_score?.length ||
                                (Data?.[0]?.participant_score?.length &&
                                  Data?.[0]?.participant_score?.[0]?.summary ===
                                    "")
                                  ? true
                                  : false || isPending
                              }
                              onClick={() => {
                                validateForm();

                                if (!isValid) {
                                  toast.error(
                                    "Please enter score and observation for all the competencies",
                                  );
                                } else {
                                  setOpen(true);
                                  setButtonName("forAssessor");
                                  setFieldValue("is_draft", "completed");
                                }
                              }}
                            >
                              Submit Assessment
                            </CustomButton>
                          </>
                        )}
                      </div>
                    </ButtonFooter>
                    {open && (
                      <ConfirmDialog
                        confirmMessage='Are you sure you want to submit  ?'
                        isPending={isPending}
                        title={
                          <span className='flex gap-3 items-center'>
                            <FiAlertCircle className='size-10 text-[#FFAE43]' />
                            Confirm Submission ?
                          </span>
                        }
                        onClose={() => setOpen(false)}
                        onConfirm={() => {
                          handleSubmit(values);
                        }}
                      />
                    )}
                  </div>
                </>
              )}

              {is_quesionnaire && (
                <div className='overflow-x-auto mb-20'>
                  <Table className='w-full border bg-white'>
                    <TableHeader>
                      <TableRow className='bg-[#EFF4FF] h-[60px]'>
                        <TableHead
                          className={`${user?.role === "participant" ? "!w-[118px]" : " !w-[75px]"} border-r text-[#5F6D7E] text-sm font-medium`}
                        >
                          Question No.
                        </TableHead>
                        {user?.role === "assessor" && (
                          <TableHead
                            className={`!w-44 border-r text-[#5F6D7E] text-sm font-medium`}
                          >
                            Competency
                          </TableHead>
                        )}
                        <TableHead
                          className={`${user?.role === "participant" ? "!w-[697px]" : " !w-[312px] "} border-r text-[#5F6D7E] text-sm font-medium`}
                        >
                          Question
                        </TableHead>
                        <TableHead
                          className={`${user?.role === "participant" ? "!w-[696px]" : " !w-[500px] "}  border-r text-[#5F6D7E] text-sm font-medium`}
                        >
                          Participant's Response
                        </TableHead>
                        {user?.role !== "participant" && (
                          <>
                            <TableHead className='!w-[127px] border-r text-[#5F6D7E] text-sm font-medium'>
                              Score (Out of 5)
                            </TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {QuestionsData &&
                        QuestionsData?.questions?.map(
                          (item: any, index: number) => (
                            <TableRow key={`${item?.id}`}>
                              <TableCell className='align-top border-r text-[#5F6D7E] text-sm'>
                                {index + 1}
                              </TableCell>
                              {user?.role === "assessor" && (
                                <TableCell className='border-r !align-top text-[#5F6D7E] text-sm relative pr-3'>
                                  {
                                    item?.quess_resp?.[0]?.competency
                                      ?.competency
                                  }
                                  <BsInfoCircle
                                    className='absolute right-2 top-3'
                                    onClick={() => {
                                      setExpectedBehaviorData(
                                        item?.quess_resp?.[0]?.competency,
                                      );
                                      setOpenExpectedBehaviorsDialog(true);
                                    }}
                                  />
                                </TableCell>
                              )}
                              <TableCell className='border-r !align-top text-[#5F6D7E] text-sm'>
                                {item?.question}
                              </TableCell>
                              <TableCell className='align-top border-r !h-full'>
                                <CoustomTextarea
                                  disabled={
                                    status === "completed" ||
                                    user?.role !== "participant"
                                  }
                                  name={`data[${index}].response`}
                                  placeholder='Enter Response...'
                                  className='w-full !min-h-full h-[220px]'
                                  onChange={() => {
                                    setFieldValue(
                                      `data[${index}].competency_id`,
                                      item?.competency_id,
                                    );
                                    setFieldValue(
                                      `data[${index}].assessor_id`,
                                      assessors_id,
                                    );
                                  }}
                                />
                              </TableCell>
                              {user?.role !== "participant" && (
                                <>
                                  <TableCell className='align-top border-r'>
                                    <CustomInput
                                      disabled={status === "completed"}
                                      onChange={(e) => {
                                        setFieldValue(
                                          `data[${index}].score`,
                                          e.target?.value,
                                        );
                                        setFieldValue(
                                          `data[${index}].competency_id`,
                                          item?.competency_id,
                                        );
                                      }}
                                      name={`data[${index}].score`}
                                      type='number'
                                      onWheel={(e) => e.currentTarget.blur()}
                                    />
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ),
                        )}
                    </TableBody>
                  </Table>

                  <ButtonFooter>
                    <div className='flex gap-4 justify-end'>
                      <CustomButton
                        variant='outline'
                        onClick={() => {
                          navigate(-1 as any, {
                            state: { tabselected: "1" },
                          });
                        }}
                      >
                        {viewOnly ? "Back" : "Cancel"}
                      </CustomButton>
                      {status !== "completed" && (
                        <>
                          <CustomButton
                            variant='outline'
                            isPending={
                              user?.role === "participant"
                                ? mutateForParticipantQuestionerPending
                                : mutateForQuestionerPending
                            }
                            onClick={() => {
                              setFieldValue("is_draft", "inprogress");
                              setButtonName("forParticipant");
                              user?.role === "assessor"
                                ? handleSaveQuestionerForAssessor(values)
                                : handleSubmit(values);
                            }}
                          >
                            Save
                          </CustomButton>
                          <CustomButton
                            onClick={() => {
                              setOpen(true);
                              setButtonName("forParticipant");
                              setFieldValue("is_draft", "completed");
                            }}
                            disabled={
                              user?.role === "participant" &&
                              !!values?.data?.some(
                                (i: any) => i?.response === "",
                              )
                            }
                          >
                            Submit
                          </CustomButton>
                        </>
                      )}
                    </div>
                  </ButtonFooter>

                  {open && (
                    <ConfirmDialog
                      confirmMessage='Are you sure you want to submit ?'
                      isPending={mutateForQuestionerPending}
                      title={
                        <span className='flex gap-3 items-center'>
                          <FiAlertCircle className='size-10 text-[#FFAE43]' />
                          Confirm Submission ?
                        </span>
                      }
                      onClose={() => setOpen(false)}
                      onConfirm={() => handleSubmit(values)}
                    />
                  )}
                  {openExpectedBehaviorsDialog && (
                    <ExpectedBehaviorsDialoagAssessNow
                      data={expectedBehaviorData}
                      handleClose={setOpenExpectedBehaviorsDialog}
                    />
                  )}
                </div>
              )}

              {is_group_activity && CompetiencyDataForGroupActivity && (
                <div className='overflow-x-auto mb-20'>
                  {CompetiencyDataForGroupActivity?.map(
                    (item: any, pIndex: number) => (
                      <>
                        {/* <PageHeading>
                          Participant Name: {item?.participant_name ?? ""} -{" "}
                          {assessment}
                        </PageHeading> */}

                        <Table className='border mb-8 bg-white'>
                          <TableHeader>
                            <TableRow className='bg-[#EFF4FF] h-[60px]'>
                              <TableHead className='!w-[154px] border-r text-[#5F6D7E] text-sm font-medium'>
                                Competency
                              </TableHead>
                              <TableHead className='!w-[127px] border-r text-[#5F6D7E] text-sm font-medium'>
                                Score (Out of 5)
                              </TableHead>
                              <TableHead className='!w-[500px] border-r text-[#5F6D7E] text-sm font-medium'>
                                Observation
                              </TableHead>
                              <TableHead className='!w-[500px] text-[#5F6D7E] text-sm font-medium'>
                                Remarks
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {item.competencies.map(
                              (comp: any, index: number) => {
                                const response = values?.data?.[
                                  pIndex
                                ]?.response_score?.find(
                                  (r: any) => r.competency_id === comp.id,
                                );
                                const fieldName = `data[${pIndex}].response_score`;

                                return (
                                  <TableRow key={comp?.id}>
                                    <TableCell className='align-top border-r'>
                                      <div className='text-[#5F6D7E] text-sm relative pr-[20px]'>
                                        <span>{comp?.competency}</span>
                                        <BsInfoCircle
                                          className='absolute right-1 top-2'
                                          onClick={() => {
                                            setExpectedBehaviorData(
                                              item?.competencies[index],
                                            );
                                            setOpenExpectedBehaviorsDialog(
                                              true,
                                            );
                                          }}
                                        />
                                      </div>
                                    </TableCell>

                                    <TableCell className='align-top border-r'>
                                      <CustomInput
                                        disabled={status === "completed"}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        onChange={(e) => {
                                          const updatedScores = values.data[
                                            pIndex
                                          ].response_score.map((r: any) =>
                                            r.competency_id === comp.id
                                              ? {
                                                  ...r,
                                                  score: e.target.value,
                                                }
                                              : r,
                                          );
                                          setFieldValue(
                                            `data[${pIndex}].response_score`,
                                            updatedScores,
                                          );
                                        }}
                                        value={response?.score || ""}
                                        name={`${fieldName}.${index}.score`}
                                        type='number'
                                      />
                                    </TableCell>
                                    <TableCell className='align-top border-r !h-full'>
                                      <CoustomTextarea
                                        disabled={status === "completed"}
                                        name={`${fieldName}.${index}.observation`}
                                        placeholder='Enter observation...'
                                        className='w-full !min-h-[100px] !h-[120px]'
                                      />
                                    </TableCell>
                                    {comp === item.competencies[0] && (
                                      <TableCell
                                        rowSpan={item.competencies.length}
                                        className=''
                                      >
                                        <CoustomTextarea
                                          name={`data[${pIndex}].grp_act_remark`}
                                          disabled={status === "completed"}
                                          placeholder=' '
                                          className='w-full !min-h-[650px]  !h-full'
                                        />
                                      </TableCell>
                                    )}
                                  </TableRow>
                                );
                              },
                            )}
                          </TableBody>
                        </Table>
                      </>
                    ),
                  )}

                  <ButtonFooter>
                    <div className='flex gap-4 justify-end'>
                      <CustomButton
                        variant='outline'
                        onClick={() => {
                          navigate(-1 as any, {
                            state: { tabselected: "1" },
                          });
                        }}
                      >
                        {viewOnly ? "Back" : "Cancel"}
                      </CustomButton>
                      {status !== "completed" && (
                        <>
                          <CustomButton
                            variant='outline'
                            isPending={groupPending}
                            disabled={groupPending}
                            onClick={() => {
                              setButtonName("groupActivity");
                              setFieldValue("is_draft", "inprogress");
                              handleSaveGroupActivityAssessment(values);
                            }}
                          >
                            Save Response
                          </CustomButton>
                          <CustomButton
                            disabled={!isValid}
                            onClick={() => {
                              setButtonName("groupActivity");
                              setFieldValue("is_draft", "completed");
                              setOpen(true);
                            }}
                          >
                            Submit Assessment
                          </CustomButton>
                        </>
                      )}
                    </div>
                  </ButtonFooter>

                  {open && (
                    <ConfirmDialog
                      confirmMessage='Are you sure you want to submit ?'
                      title={
                        <span className='flex gap-3 items-center'>
                          <FiAlertCircle className='size-10 text-[#FFAE43]' />
                          Confirm Submission ?
                        </span>
                      }
                      isPending={isPending || groupPending}
                      onClose={() => setOpen(false)}
                      onConfirm={() => {
                        handleSubmit(values);
                      }}
                    />
                  )}
                  {openExpectedBehaviorsDialog && (
                    <ExpectedBehaviorsDialoagAssessNow
                      data={expectedBehaviorData}
                      handleClose={setOpenExpectedBehaviorsDialog}
                    />
                  )}
                </div>
              )}
            </>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AssessNowPage;
