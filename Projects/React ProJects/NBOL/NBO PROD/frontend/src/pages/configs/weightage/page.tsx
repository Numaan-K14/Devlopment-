import { ButtonFooter } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import SelectCommonOptions from "@/components/inputs/select-client";
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
import {
  ClientCreateInterface,
  ProjectConfigInterface,
} from "@/interfaces/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

const WeightageConfigPage = () => {
  const [initialValues, setInitialValues] = useState<any>({ data: [] });
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [competencies, setCompetencies] = useState<any[]>([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: Data, isFetched } = useQuery<any>({
    queryKey: [
      `competency/get-comp-assessments-weightage/${selectedClient?.id}/${selectedCohort?.id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: !!selectedClient && !!selectedCohort,
  });
  const isSubmitted = useMemo(() => {
    return Data?.competency?.some((c: any) =>
      c?.competency?.comp_weight?.some((w: any) => w.submitted === true),
    );
  }, [Data]);

  console.log(Data, "<-------------------- adtdatata");
  useEffect(() => {
    if (Data) {
      setCompetencies(Data.competency);

      const rawAssessmentNames = Data.assessments.map((a: any) =>
        a?.question
          ? `${a.assessment.assessment_name} - (${a?.question?.quesionnaire_name})`
          : `${a.assessment.assessment_name} - (${a?.scenerio?.scenerio_name})`,
      );

      const nameFrequency: Record<string, number> = {};
      rawAssessmentNames.forEach((name: string) => {
        nameFrequency[name] = (nameFrequency[name] || 0) + 1;
      });

      const competencyList = Data?.competency?.map((c: any) => c);

      const newInitialValues = {
        data: Data?.assessments?.map((a: any, index: number) => {
          const reducedWeights = competencyList?.flatMap((item: any) => {
            const competencyId = item.competency?.id;
            return (
              item.competency?.comp_weight?.map((entry: any) => ({
                competency_id: competencyId,
                assessment_id: entry.assessment_id,
                scenerio_id: entry.scenerio_id || null,
                quessionnaire_id: entry.quessionnaire_id || null,
                weightage: entry?.weightage,
              })) || []
            );
          });

          const scoresFilter = reducedWeights.filter(
            (ele: any) =>
              ele.scenerio_id === a.scenerio?.id ||
              ele.quessionnaire_id === a.question?.id,
          );

          // let newCompAss = [];

          // for (const element of Data.competency) {
          //   newCompAss.push(
          //     scoresFilter.find((ele: any) => {
          //       return ele.competency_id === element.competency.id;
          //     }),
          //   );
          // }

          // const scores = newCompAss.reduce((acc: any, entry: any) => {
          //   acc[entry?.competency_id] = entry?.weightage ?? 3;
          //   return acc;
          // }, {});

          // return {
          //   assessment: rawAssessmentNames[index],
          //   assessment_id:
          //     a.scenerio?.assessment_id ??
          //     a.question?.assessment_id ??
          //     a.assessment?.id ??
          //     "",
          //   scenerio_id: a.scenerio?.id ?? "",
          //   questionnaire_id: a.question?.id ?? "",
          //   scores: scores,
          // };

          const scores: Record<string, string> = {};

          // for every competency, either use existing weightage OR default "3"
          Data.competency.forEach((comp: any) => {
            const compId = comp.competency.id;

            const existing = scoresFilter.find(
              (ele: any) => ele.competency_id === compId,
            );

            // if API has value → use it, else → "3"
            scores[compId] = existing?.weightage?.toString() || "3";
          });

          return {
            assessment: rawAssessmentNames[index],
            assessment_id:
              a.scenerio?.assessment_id ??
              a.question?.assessment_id ??
              a.assessment?.id ??
              "",
            scenerio_id: a.scenerio?.id ?? "",
            questionnaire_id: a.question?.id ?? "",
            scores, // <-- use the new scores object
          };
        }),
      };

      setInitialValues(newInitialValues);
    }
  }, [Data]);

  // Validations
  const scoreValidation = Yup.string()
    .required("")
    .matches(/^(?:[0-4](?:\.\d{1})?|5(?:\.0)?)$/, "0-5");

  const validationSchema = Yup.object().shape({
    data: Yup.array().of(
      Yup.object().shape({
        assessment: Yup.string(),
        scores: Yup.object().shape(
          competencies?.reduce((acc: any, c: any) => {
            acc[c.competency.id] = scoreValidation;
            return acc;
          }, {}),
        ),
      }),
    ),
  });

  const { mutate: submitWeightage, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: any) =>
      axios.post(
        `/competency/competency-weightage/${selectedClient.id}/${selectedProject.id}/${selectedCohort.id}`,
        payload,
      ),
    onSuccess: () => {
      toast.success("Weightage configuration saved successfully!");
      queryClient.refetchQueries({
        queryKey: [
          `competency/get-comp-assessments-weightage/${selectedClient?.id}/${selectedCohort?.id}`,
        ],
      });
      navigate("/activity-weightages");
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = (values: any, submitted: boolean) => {
    const columnTotals = calculateColumnTotals(values.data);

    const finalPayload = {
      submitted,
      assessment: values?.data?.map((row: any) => {
        const assessmentId = row.assessment_id;
        const scenarioId = row.scenerio_id || null;
        const quesionnaireId = row.questionnaire_id || null;

        if (!assessmentId) return null;

        const competencyEntries = Object.entries(row.scores)
          .map(([compId, weightage]) => {
            const compObj = competencies?.find(
              (c: any) => c.competency.id === compId,
            );

            return compObj?.competency?.id
              ? {
                  competency_id: compObj.competency.id,
                  weightage: String(weightage),
                  total: columnTotals[compObj.competency.id].toString() ?? 0,
                }
              : null;
          })
          .filter(
            (
              entry,
            ): entry is {
              competency_id: string;
              weightage: string;
              total: string;
            } => entry !== null,
          );

        return {
          assessment_id: assessmentId,
          scenerio_id: scenarioId,
          competency: competencyEntries,
          quessionnaire_id: quesionnaireId,
        };
      }),
    };

    submitWeightage(finalPayload);
  };

  console.log(initialValues, "<---------- initial values");
  // Calculate Totals
  const calculateColumnTotals = (data: any[]) => {
    const totals: { [key: string]: number } = {};

    competencies.forEach((c: any) => {
      const key = c.competency.id;
      totals[key] = data?.reduce((sum, row) => {
        const val = parseFloat(row.scores[key]);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
    });
    return totals;
  };

  // console.log(
  //   initialValues,
  //   ",-------------- initialValues",
  //   selectedClient,
  //   selectedProject,
  //   selectedCohort,
  // );

  return (
    <>
      {/* <PageHeading variant='primary'>Weightage</PageHeading> */}
      <AppBar
        title='Weightage Management'
        subTitle='Add, Edit and Manage Weightages'
      />
      <div className='flex flex-wrap gap-5 mt-[16px] mb-10'>
        <SelectCommonOptions
          required
          handleChange={setSelectedClient}
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
            required
            handleChange={setSelectedProject}
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
            localStorageName='project'
            url={`/projects/client-projects/${selectedClient.id}`}
          />
        )}

        {selectedClient && selectedProject && (
          <SelectCommonOptions
            required
            handleChange={setSelectedCohort}
            handleDataChange={(cohort: any) => {
              setSelectedCohort(cohort);
              // setInitialValues({ data: [] });
              localStorage.setItem("cohort", JSON.stringify(cohort));
            }}
            key={selectedCohort?.id}
            localStorageName='cohort'
            url={`/participant/get-project-cohorts/${selectedProject.id}`}
          />
        )}
      </div>
      {selectedClient && selectedCohort && selectedProject ? (
        isFetched && initialValues?.data?.length === 0 ? (
          <div className='text-center mt-10'>
            Please configure the activities for the above selected cohort
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => handleSubmit(values, true)}
          >
            {({ values, setFieldValue, resetForm, isValid }) => (
              console.log(values, "<---------- values"),
              (
                <Form className='space-y-10 mb-20'>
                  <div className='overflow-hidden rounded-[8px] border'>
                    <Table className='   text-sm bg-white '>
                      <TableHeader>
                        <TableRow className=' h-[60px] text-[#5F6D7E] text-sm font-medium '>
                          <TableHead className='border    text-center'>
                            Assessment
                          </TableHead>
                          {competencies.map((c) => (
                            <TableHead
                              key={c.competency.id}
                              className='border text-center font-semibold'
                            >
                              {c.competency.competency}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {values.data.map((row: any, index: number) => (
                          <TableRow
                            key={index}
                            className='text-center h-[70px]'
                          >
                            <TableCell className='border text-[#5F6D7E] font-medium'>
                              {row.assessment}
                            </TableCell>
                            {competencies.map((c: any) => {
                              const compId = c.competency.id;
                              return (
                                <TableCell key={compId} className='border'>
                                  <div className='flex justify-center items-center h-[70px]'>
                                    <CustomInput
                                      type='number'
                                      onWheel={(e) => e.currentTarget.blur()}
                                      disabled={isSubmitted}
                                      name={`data[${index}].scores.${compId}`}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `data[${index}].scores.${compId}`,
                                          e.target.value,
                                        )
                                      }
                                      className='!h-[48px] !w-[50px] text-center'
                                    />
                                  </div>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}

                        <TableRow className='text-center'>
                          <TableCell className='border'>TOTAL</TableCell>
                          {competencies.map((c) => {
                            const compId = c.competency.id;
                            return (
                              <TableCell key={compId} className='border'>
                                <div className='inline-block w-[40px] h-[48px] leading-[48px] text-center rounded bg-gray-100'>
                                  {calculateColumnTotals(values.data)[compId] ||
                                    0}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  {!isSubmitted && (
                    <ButtonFooter>
                      <div className='flex gap-4 justify-end'>
                        {!isSubmitted && (
                          <CustomButton
                            variant='outline'
                            onClick={() =>
                              resetForm({
                                values: {
                                  data: values.data.map((row: any) => ({
                                    ...row,
                                    scores: Object.fromEntries(
                                      Object.keys(row.scores).map((k) => [
                                        k,
                                        "",
                                      ]),
                                    ),
                                  })),
                                },
                              })
                            }
                          >
                            Reset
                          </CustomButton>
                        )}
                        {!isSubmitted && (
                          <CustomButton
                            variant='outline'
                            type='button'
                            onClick={() => handleSubmit(values, false)}
                            disabled={!isValid || isSubmitting || isSubmitted}
                          >
                            Save
                          </CustomButton>
                        )}
                        {!isSubmitted && (
                          <CustomButton
                            type='submit'
                            disabled={!isValid || isSubmitting}
                          >
                            Submit
                          </CustomButton>
                        )}
                      </div>
                    </ButtonFooter>
                  )}
                </Form>
              )
            )}
          </Formik>
        )
      ) : (
        <div className='text-center mt-10'>Select required fields...</div>
      )}
    </>
  );
};

export default WeightageConfigPage;
