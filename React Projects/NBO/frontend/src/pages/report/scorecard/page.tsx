import { ButtonFooter, PageHeading } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { CustomLoader } from "@/components/custom-loader";
import CustomInput from "@/components/inputs/custom-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axios } from "@/config/axios";
import { useQuery } from "@/hooks/useQuerry";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

type Scores = { [assessor: string]: number };

const ScoreCardPage = () => {
  // ------------- stste management ----------------- //
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  let participant_name = state?.Participant_name || "";

  const [initialValues, setInitialValues] = useState<any>({
    data: [],
    score: [],
  });
  const [allAssessmentData, setAllAssessmentData] = useState<any[]>([]);
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const [actionType, setActionType] = useState<"save" | "submit">("save");

  //------ api calls --------//
  const { data: Data } = useQuery<any>({
    queryKey: [
      `/report/participant-Assessments-score/${state?.client_id}/${state?.cohort_id}/${id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: !!state?.client_id && !!state?.cohort_id && !!id,
  });

  console.log(Data, "<------- datatatat");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.put("/report/assessor-final-score", data),
    onSuccess(data) {
      toast.success(data.data.msg || "Successful");
      navigate(-1);
    },
  });

  //-------- useEffect data manipulation ----------//
  useEffect(() => {
    const initial = {
      score: finalScoreAssessments.map((assessment: any) => ({
        assessment,
        scores: {},
      })),
    };

    setInitialValues(initial);
  }, [Data]);

  // const validationSchema = useMemo(() => {
  //   return Yup.object(
  //     matrixData.reduce(
  //       (schema, cell) => {
  //         schema[cell.unique_id] =
  //           actionType === "save"
  //             ? Yup.string()
  //                 .nullable()
  //                 .matches(
  //                   /^(?:[0-4](?:\.[0-9])?|5(?:\.0)?)$/,
  //                   "Score must be between 0 and 5 with up to 1 decimal place",
  //                 )
  //             : Yup.string()
  //                 .nullable()
  //                 .matches(
  //                   /^(?:[0-4](?:\.\\d)?|5(?:\\.0)?)$/,
  //                   "Score must be between 0 and 5 with up to 1 decimal place",
  //                 )
  //                 .required("This field is required");
  //         return schema;
  //       },
  //       {} as Record<string, any>,
  //     ),
  //   );
  // }, [matrixData, actionType]);

  const [validationSchema, setValidationSchema] = useState(Yup.object({}));

  const getValidationSchema = (mode: "save" | "submit") => {
    return Yup.object(
      matrixData.reduce(
        (schema, cell) => {
          schema[cell.unique_id] =
            mode === "save"
              ? Yup.string()
                  .nullable()
                  .matches(
                    /^(?:[0-4](?:\.[0-9])?|5(?:\.0)?)$/,
                    "Score must be between 0 and 5 with up to 1 decimal place",
                  )
              : Yup.string()
                  .nullable()
                  .matches(
                    /^(?:[0-4](?:\.[0-9])?|5(?:\.0)?)$/,
                    "Score must be between 0 and 5 with up to 1 decimal place",
                  )
                  .required("This field is required");
          return schema;
        },
        {} as Record<string, any>,
      ),
    );
  };

  const submitSchema = (matrixData: any) => {
    return Yup.object(
      matrixData.reduce(
        (schema: any, cell: any) => {
          schema[cell.unique_id] = Yup.string()
            .nullable()
            .matches(
              /^(?:[0-4](?:\.[0-9])?|5(?:\.0)?)$/,
              "Score must be between 0 and 5 with up to 1 decimal place",
            )
            .required("This field is required");

          return schema;
        },
        {} as Record<string, any>,
      ),
    );
  };

  const saveSchema = (matrixData: any) => {
    return Yup.object(
      matrixData.reduce(
        (schema: any, cell: any) => {
          schema[cell.unique_id] = Yup.string()
            .nullable()
            .matches(
              /^(?:[0-4](?:\.[0-9])?|5(?:\.0)?)$/,
              "Score must be between 0 and 5 with up to 1 decimal place",
            );

          return schema;
        },
        {} as Record<string, any>,
      ),
    );
  };

  useEffect(() => {
    let data: any = [];
    const assessmentData: any[] = [];
    if (Data?.grpActAssessments) {
      Data?.grpActAssessments?.map((item: any) => assessmentData.push(item));
    }
    if (Data?.normalAssessments) {
      Data?.normalAssessments?.map((item: any) => assessmentData.push(item));
    }

    setAllAssessmentData(assessmentData);
    if (
      Data?.competency.length &&
      Data?.competency?.[0]?.participant_score?.[0]?.score &&
      Data?.assessments.length
    ) {
      Data?.competency.forEach((competency: any, compiIndex: number) => {
        assessmentData.forEach((assessment: any, assessIndex: number) => {
          const commonScore = assessment?.as_res?.[0]?.scores?.map(
            (score: any) => ({
              score: score?.score ? score?.score : null,
              competency_id: score?.competency?.id,
            }),
          );

          data.push({
            unique_id: `${
              assessment?.quessionnaire
                ? assessment?.quessionnaire?.id
                : assessment?.scenerio?.id
            }-${competency?.id}`,

            score_id: competency?.participant_score?.[assessIndex]?.id,
            competency_id: competency?.id,
            assessment_response:
              competency?.participant_score?.[assessIndex]?.response?.id,
            score:
              commonScore?.find((s: any) => s.competency_id === competency?.id)
                ?.score !== null
                ? Number(
                    commonScore?.find(
                      (s: any) => s.competency_id === competency?.id,
                    )?.score,
                  ).toFixed(1)
                : "",
          });
        });
      });
    } else if (Data?.competency.length && Data?.assessments.length) {
      Data?.competency.forEach((competency: any, compiIndex: number) => {
        assessmentData.forEach((assessment: any, assessIndex: number) => {
          const commonScore =
            assessment?.as_res?.[0]?.quess_resp?.length > 0
              ? assessment?.as_res?.[0]?.quess_resp?.map((score: any) => ({
                  score: score?.assess_score?.every(
                    (s: any) => s.score === score?.assess_score?.[0]?.score,
                  )
                    ? score?.assess_score?.[0]?.score
                    : null,
                  competency_id: score?.competency?.id,
                }))
              : assessment?.as_res?.[0]?.scores?.map((score: any) => ({
                  score: score?.sc_pa?.every(
                    (s: any) => s?.score === score?.sc_pa?.[0]?.score,
                  )
                    ? score?.sc_pa?.[0]?.score
                    : null,
                  competency_id: score?.competency?.id,
                }));

          data.push({
            unique_id: `${
              assessment?.quessionnaire
                ? assessment?.quessionnaire?.id
                : assessment?.scenerio?.id
            }-${competency?.id}`,

            score_id: competency?.participant_score?.[assessIndex]?.id,

            competency_id: competency?.id,

            assessment_response:
              competency?.participant_score?.[assessIndex]?.response?.id,

            score:
              commonScore?.find((s: any) => s.competency_id === competency?.id)
                ?.score !== null
                ? Number(
                    commonScore?.find(
                      (s: any) => s.competency_id === competency?.id,
                    )?.score,
                  ).toFixed(1)
                : "",
          });
        });
      });
    }

    setMatrixData(data);
    setValidationSchema(saveSchema(data));

    const initialVals: Record<string, string> = {};
    data.forEach((cell: any) => {
      initialVals[cell.unique_id] = cell.score || "";
    });
    setInitialValues(initialVals);
  }, [Data]);

  //------------- Setting the Final Score Assessment Names ----------//
  const finalScoreAssessments = useMemo(() => {
    return (
      Data?.assessments?.map(
        (item: any) =>
          `${item?.assessment?.assessment_name} - (${item?.question ? item?.question?.quesionnaire_name : item?.scenerio?.scenerio_name})`,
      ) ?? []
    );
  }, [Data?.assessments]);

  const handleScoreChange = (unique_id: number, score: any) => {
    setMatrixData((prevData) =>
      prevData.map((cell) =>
        cell.unique_id === unique_id ? { ...cell, score: score } : cell,
      ),
    );
  };

  const handleSave = (values: any) => {
    // return console.log(data, ",----------------- data");
    const data = {
      score: values?.score,
      admin_score: values?.admin_score,
    };
    // return console.log(data, ",------------ datataattata");
    mutate({
      ...data,
      participant_id: state?.participant_id,
      class_id: state?.class_id,
    });
  };
  console.log(matrixData, "<------ matrixData");
  console.log(initialValues, "<------ initialValues");

  return (
    <>
      {/* <PageHeading variant='primary'>{`Participant Name: ${participant_name}`}</PageHeading> */}
      <AppBar
        title={`Participant Name: ${participant_name}`}
        subTitle={`Edit and Manage Scores for ${participant_name}`}
      />
      {Data ? (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          // validationSchema={validationSchema}
          // validationSchema={getValidationSchema(actionType)}
          validationSchema={validationSchema}
          // validationSchema={getValidationSchema(actionType)}
          // onSubmit={(values: any) => {
          //   const data = {
          //     score: values?.score,
          //     admin_score: values?.admin_score,
          //   };
          //   mutate({
          //     ...data,
          //     participant_id: state?.participant_id,
          //     class_id: state?.class_id,
          //   });
          // }}
          onSubmit={(values) => {
            // console.log(values, ",--------------- values on submit");
            const payload = Object.entries(values).map(
              ([unique_id, score]) => ({
                unique_id,
                score,
              }),
            );
            // return console.log(payload, "<------------ payload", matrixData);

            mutate({
              score: matrixData,
              participant_id: state?.participant_id,
              class_id: state?.class_id,
              admin_score: actionType === "save" ? "inprogress" : "completed",
            });
          }}
        >
          {({
            values,
            handleSubmit,
            isValid,
            validateForm,
            errors,
            setFieldValue,
            setErrors,
          }) => (
            // console.log(values, ",---------------- values"),
            // console.log(isValid, ",------------------ isvalid"),
            // console.log(errors, ",------------------ errors"),
            <Form className='space-y-10 mb-20'>
              <div className='!mb-10'>
                <PageHeading variant='secondary'>Calibrated Score</PageHeading>
                <Table className='border bg-white border-[#E9EAEB] overflow-x-scroll text-sm'>
                  <TableHeader>
                    <TableRow className='bg-[#EFF4FF] h-[60px] text-[#5F6D7E] text-sm font-medium'>
                      <TableHead className='border text-center'>
                        Assessment
                      </TableHead>
                      {Data?.competency.map((comp: any, i: any) => (
                        <TableHead key={i} className='border text-center'>
                          {comp?.competency}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAssessmentData &&
                      allAssessmentData?.length &&
                      allAssessmentData?.map(
                        (assessment: any, rowIndex: number) => (
                          // console.log(
                          //   assessment,
                          //   "<---------------- assessent",
                          // ),
                          <TableRow
                            key={rowIndex}
                            className='text-center overflow-x-scroll h-[60px]'
                          >
                            <TableCell className='border !min-w-[300px]'>
                              {/* <Link to=''> */}
                              <Link
                                className='text-blue-600 underline'
                                to={{
                                  pathname:
                                    "/reports/participant-assessment-detail",
                                  search: "?viewOnly=true",
                                }}
                                state={{
                                  // participant_assesment_id: row?.original
                                  //   ?.gr_act_room
                                  //   ? row?.original?.gr_act_room?.id
                                  //   : row?.original?.par_as?.id,
                                  participant_assesment_id:
                                    assessment?.as_res?.[0]?.par_ass_id,
                                  participant_name: state?.Participant_name,
                                  participant_id_singleGet: id,
                                  class_id: state?.class_id,
                                  assesment_id: assessment?.quessionnaire
                                    ? assessment?.quessionnaire?.assessment?.id
                                    : assessment?.scenerio?.assessment?.id,
                                  assessment: assessment?.quessionnaire
                                    ? `${assessment?.quessionnaire?.assessment?.assessment_name} - (${assessment?.quessionnaire?.scenerio_name})`
                                    : `${assessment?.scenerio?.assessment?.assessment_name} - (${assessment?.scenerio?.scenerio_name})`,
                                  cohort_id: state?.cohort_id,
                                  participant_id: id,
                                  is_quesionnaire: assessment?.quessionnaire
                                    ? true
                                    : false,
                                  is_group_activity:
                                    assessment?.scenerio?.assessment
                                      ?.is_group_activity === true
                                      ? true
                                      : false,
                                  client_id: state?.client_id,
                                  grp_act_room_id:
                                    assessment?.as_res?.[0]?.gr_act_room_id,
                                  single_get_object_id:
                                    assessment?.as_res?.[0]?.par_ass_id,
                                  quessionnaire_id:
                                    assessment?.quessionnaire?.id,
                                  assessment_resp_id:
                                    assessment?.as_res?.[0]?.id,
                                  status: "completed",
                                  type:
                                    assessment?.scenerio?.assessment
                                      ?.is_group_activity === true
                                      ? "group_activity"
                                      : "normal",
                                }}
                              >
                                {assessment?.quessionnaire
                                  ? assessment?.quessionnaire?.assessment
                                      ?.assessment_name
                                  : assessment?.scenerio?.assessment
                                      ?.assessment_name}
                                - (
                                {assessment?.quessionnaire
                                  ? assessment?.quessionnaire?.quesionnaire_name
                                  : assessment?.scenerio?.scenerio_name}
                                )
                              </Link>
                            </TableCell>
                            {Data?.competency.map(
                              (comp: any, colIndex: any) => {
                                const cell_id = `${
                                  assessment?.quessionnaire
                                    ? assessment?.quessionnaire?.id
                                    : assessment?.scenerio?.id
                                }-${comp?.id}`;

                                const cell = matrixData.find(
                                  (c) => c?.unique_id === cell_id,
                                );

                                return (
                                  <TableCell
                                    key={colIndex}
                                    className={`border  !min-w-[200px] text-center `}
                                  >
                                    {/* <CustomInput
                                        type='number'
                                        onWheel={(e) => e.currentTarget.blur()}
                                        name={cell_id}
                                        value={cell?.score || ""}
                                        disabled={state?.status === "completed"}
                                        onChange={(e) =>
                                          handleScoreChange(
                                            cell.unique_id,
                                            e.target.value,
                                          )
                                        }
                                        className={`!h-[48px] !w-[60px] text-center mx-auto ${cell?.score === "" || cell?.score === null || cell?.score === 0 ? "bg-white" : cell?.score > 0 && cell?.score <= 3.5 ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"}`}
                                      /> */}
                                    <CustomInput
                                      type='number'
                                      onWheel={(e) => e.currentTarget.blur()}
                                      name={cell_id}
                                      value={values[cell_id] || ""}
                                      disabled={state?.status === "completed"}
                                      onChange={(e) => {
                                        setFieldValue(cell_id, e.target.value);
                                        handleScoreChange(
                                          cell.unique_id,
                                          e.target.value,
                                        );
                                      }}
                                      // className={`!h-[48px] !w-[60px] text-center mx-auto  ${
                                      //   // values[cell_id] === "" ||
                                      //   // values[cell_id] === null
                                      //   //   ? "text-white "
                                      //   //   : values[cell_id] > 4.4
                                      //   //     ? "text-[#3D80C2] bg-[#94caff73]"
                                      //   //     : values[cell_id] >= 3.5 &&
                                      //   //         values[cell_id] <= 4.5
                                      //   //       ? "text-[#75a83f] bg-[#e6ffcd67]"
                                      //   //       : values[cell_id] >= 3.0 &&
                                      //   //           values[cell_id] < 3.5
                                      //   //         ? "text-[#cea500] bg-[#fff5cb71]"
                                      //   //         : values[cell_id] >= 2.0 &&
                                      //   //             values[cell_id] < 3.0
                                      //   //           ? "text-[#bb62bb] bg-[#fcd8fc52]"
                                      //   //           : values[cell_id] >= 0 &&
                                      //   //               values[cell_id] < 2.0
                                      //   //             ? "text-[#FF0000] bg-[#ff9a9a67]"
                                      //   //             : ""
                                      //   values[cell_id] === "" ||
                                      //   values[cell_id] === null
                                      //     ? "text-white "
                                      //     : values[cell_id] > 4.4
                                      //       ? "text-[#3D80C2] bg-[#94caff73]"
                                      //       : values[cell_id] >= 3.5 &&
                                      //           values[cell_id] < 4.5
                                      //         ? "text-[#75a83f] bg-[#e6ffcd67]"
                                      //         : values[cell_id] >= 2.5 &&
                                      //             values[cell_id] < 3.5
                                      //           ? "text-[#cea500] bg-[#fff5cb71]"
                                      //           : values[cell_id] >= 2.0 &&
                                      //               values[cell_id] < 3.0
                                      //             ? "text-[#bb62bb] bg-[#fcd8fc52]"
                                      //             : values[cell_id] >= 0 &&
                                      //                 values[cell_id] < 2.0
                                      //               ? "text-[#FF0000] bg-[#ff9a9a67]"
                                      //               : ""
                                      // }`}
                                      className={`!h-[48px] !w-[60px] text-center mx-auto
  ${
    values[cell_id] === "" || values[cell_id] === null
      ? "text-white"
      : values[cell_id] > 4.4
        ? state?.status === "completed"
          ? "text-[#155a96] bg-[#b7dbff]" // brighter blue
          : "text-[#3D80C2] bg-[#94caff73]"
        : values[cell_id] >= 3.5 && values[cell_id] < 4.5
          ? state?.status === "completed"
            ? "text-[#557a27] bg-[#dbffb2]" // brighter green
            : "text-[#75a83f] bg-[#e6ffcd67]"
          : values[cell_id] >= 2.5 && values[cell_id] < 3.5
            ? state?.status === "completed"
              ? "text-[#b88b00] bg-[#ffec9f]" // brighter yellow
              : "text-[#cea500] bg-[#fff5cb71]"
            : values[cell_id] >= 2.0 && values[cell_id] < 3.0
              ? state?.status === "completed"
                ? "text-[#9e459e] bg-[#ffd6ff]" // brighter purple
                : "text-[#bb62bb] bg-[#fcd8fc52]"
              : values[cell_id] >= 0 && values[cell_id] < 2.0
                ? state?.status === "completed"
                  ? "text-[#b80000] bg-[#ffcbcb]" // brighter red
                  : "text-[#FF0000] bg-[#ff9a9a67]"
                : ""
  }
`}
                                    />
                                  </TableCell>
                                );
                              },
                            )}
                          </TableRow>
                        ),
                      )}
                  </TableBody>
                </Table>
              </div>

              {/* {assessorDataFormNormalAssessments && (
                  <AssessmentTableRenderer
                    data={assessorDataFormNormalAssessments}
                  />
                )}
                {assessorDataGroupActivity && (
                  <AssessmentTableRenderer data={assessorDataGroupActivity} />
                )} */}
              <ButtonFooter>
                <div className='flex gap-4 justify-end'>
                  <CustomButton variant='outline' onClick={() => navigate(-1)}>
                    Cancel
                  </CustomButton>
                  {state?.status !== "completed" && (
                    // <CustomButton
                    //   variant='outline'
                    //   onClick={() => {
                    //     setActionType("save");
                    //     handleSave({
                    //       ...values,
                    //       score: matrixData,
                    //       admin_score: "inprogress",
                    //     });
                    //   }}
                    //   isPending={isPending}
                    //   disabled={isPending}
                    // >
                    //   Save
                    // </CustomButton>
                    <CustomButton
                      variant='outline'
                      onClick={async () => {
                        const mode = "save";
                        setErrors({});
                        setValidationSchema(saveSchema(matrixData));

                        const errors = await validateForm();
                        // getValidationSchema(mode),
                        if (Object.keys(errors).length === 0) {
                          setActionType(mode);
                          handleSubmit();
                        } else {
                          toast.error("Some scores are invalid");
                        }
                      }}
                    >
                      Save
                    </CustomButton>
                  )}
                  {state?.status !== "completed" && (
                    // <CustomButton
                    //   isPending={isPending}
                    //   disabled={isPending}
                    //   onClick={() => {
                    //     setActionType("submit");
                    //     handleSubmit({
                    //       ...values,
                    //       score: matrixData,
                    //       admin_score: "completed",
                    //     });
                    //     if (!isValid) {
                    //       toast.error("Fill all the scores");
                    //     }
                    //   }}
                    // >
                    //   Submit
                    // </CustomButton>
                    <CustomButton
                      onClick={async () => {
                        const mode = "submit";
                        setErrors({});
                        setValidationSchema(submitSchema(matrixData));

                        const errors = await validateForm();
                        // getValidationSchema(mode),
                        if (Object.keys(errors).length === 0) {
                          setActionType(mode);
                          handleSubmit();
                        } else {
                          toast.error("Please fill all the scores");
                        }
                      }}
                    >
                      Submit
                    </CustomButton>
                  )}
                </div>
              </ButtonFooter>
            </Form>
          )}
        </Formik>
      ) : (
        <CustomLoader />
      )}
    </>
  );
};

export default ScoreCardPage;
