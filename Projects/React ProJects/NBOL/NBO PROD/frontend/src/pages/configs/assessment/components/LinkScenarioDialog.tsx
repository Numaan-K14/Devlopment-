import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import { CustomLoader } from "@/components/custom-loader";
import CustomSwitch from "@/components/inputs/custom-switch";
import { Badge } from "@/components/ui/badge";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import {
  AssessmentLinkScenarioPrensentationInterface,
  AssessmentLinkScenarioQuestionnaireInterface,
} from "@/interfaces/assessments";
import { ClientCreateInterface } from "@/interfaces/client";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LinkScenarioDialog = ({
  handleClose,
  assesmentId,
  clientId,
  refetchQuire,
  isEdit,
  row,
  cohortId,
  projectId,
}: {
  handleClose: (item: boolean) => void;
  assesmentId: string;
  clientId?: ClientCreateInterface;
  refetchQuire?: string;
  isEdit: boolean;
  row?: any;
  cohortId?: string;
  projectId?: any;
}) => {
  const { data: questionnaireData } = useQuery<any>({
    queryKey: [
      `/assessment/all-quesionnaire/${projectId?.id}/${cohortId}/${assesmentId}`,
    ],
    select: (data: any) => data?.data?.data?.rows,
    enabled: row?.is_quesionnaire,
  });

  const { data: scenarioData } = useQuery<any>({
    queryKey: [
      `/assessment/assessment-selected-scenerios/${assesmentId}/${cohortId}`,
    ],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !row?.is_quesionnaire,
  });

  //--------- state management --------//
  let activeScenarioIds: any[] = [];
  useEffect(() => {
    if (scenarioData) {
      const activeScenarioId = scenarioData
        .filter((item: any) => item?.status === true)
        .map((item: any) => item?.id);
      if (activeScenarioId) {
        setSelectedScenarioIds(activeScenarioId);
      }
    }
  }, [scenarioData]);

  const [selectedScenarioIds, setSelectedScenarioIds] = useState<any[]>(
    activeScenarioIds || [],
  );
  const [selectedQuestionnaireIds, setSelectedQuestionnaireIds] = useState<
    any[]
  >([]);

  const navigate = useNavigate();
  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      isEdit
        ? axios.put(
            `assessment/update-assessments-quessionnaire/${clientId?.id}/${cohortId}`,
            data,
          )
        : axios.post(
            `/assessment/add-assessments-scenerio/${clientId?.id}/${cohortId}`,
            data,
          ),
    onSuccess: (data) => {
      toast.success(data.data.msg || "Successfully submitted!");
      queryClient.refetchQueries({ queryKey: [refetchQuire] });
      handleClose(false);
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  //--------- useEffect hook --------//

  useEffect(() => {
    if (questionnaireData) {
      const activeQuestionnaire = questionnaireData
        .filter((item: any) => item?.status)
        ?.map((item: any) => item?.id);
      if (activeQuestionnaire) {
        setSelectedQuestionnaireIds(activeQuestionnaire);
      }
    }
  }, [questionnaireData]);

  //-------- handle functions ---------//
  const handleScenarioSwitchChange = (scenarioId: string) => {
    setSelectedScenarioIds((prev) =>
      prev?.includes(scenarioId)
        ? prev?.filter((id) => id !== scenarioId)
        : [...prev, scenarioId],
    );
  };

  const handleQuestionnaireSwitchChange = (questionnaireId: string) => {
    setSelectedQuestionnaireIds((prev) =>
      prev?.includes(questionnaireId)
        ? prev.filter((id) => id !== questionnaireId)
        : [...prev, questionnaireId],
    );
  };

  const selectedOptions =
    row?.is_quesionnaire === false
      ? scenarioData
          ?.filter((item: any) => selectedScenarioIds.includes(item?.id))
          ?.map((item: any) => ({
            label: item?.scenerio_name,
            id: item?.id,
          }))
      : (questionnaireData &&
          questionnaireData
            ?.filter((item: any) =>
              selectedQuestionnaireIds?.includes(item?.id),
            )
            ?.map((item: any) => ({
              label: item?.quesionnaire_name,
              id: item?.id,
            }))) ||
        [];

  const removeItem = (id: number) => {
    if (row?.is_quesionnaire === false) {
      setSelectedScenarioIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedQuestionnaireIds((prev) => prev.filter((i) => i !== id));
    }
  };
  // ------------ colums ------------//
  const columns: ColumnDef<AssessmentLinkScenarioPrensentationInterface>[] = [
    {
      header: "Scenarios",
      accessorKey: "scenerio_name",
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 400,
      cell({ row }) {
        return (
          <span
            className='break-words line-clamp-2'
            dangerouslySetInnerHTML={{
              __html: row?.original?.description,
            }}
          />
        );
      },
    },
    {
      header: "View Scenario",
      accessorKey: "actions",
      cell({ row }) {
        const fileLocation = row.original.file_location;
        return (
          <button
            className='text-[#4338CA]  flex gap-2 items-center'
            onClick={(e) => {
              e.preventDefault();
              const pdfUrl = `${process.env.REACT_APP_API_BASE_URL}${fileLocation.replace(
                "/home/ubuntu/nbo-class/backend/public",
                "",
              )}`;
              window.open(pdfUrl, "_blank");
            }}
          >
            <LuEye className='size-4' /> View
          </button>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      meta: {
        disableFilters: true,
      },
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <CustomSwitch
              name={`switch${row.original.id}`}
              checked={selectedScenarioIds?.includes(row.original.id)}
              onChange={() => handleScenarioSwitchChange(row.original.id)}
            />
          </div>
        );
      },
    },
  ];

  const columnsForQuestion: ColumnDef<AssessmentLinkScenarioQuestionnaireInterface>[] =
    [
      {
        header: "Questionnaire",
        accessorKey: "quesionnaire_name",
      },
      {
        header: "Questions",
        accessorKey: "questions",
        size: 600,
        cell({ row }) {
          // eslint-disable-next-line
          const [isExpanded, setIsExpanded] = React.useState(false);

          const questions = row?.original?.questions || [];

          const renderedQuestions = questions
            .map(
              (item: any, index: number) => `${index + 1}. ${item?.question}`,
            )
            .join("<br />");

          const truncatedQuestions = questions
            .slice(0, 1)
            .map(
              (item: any, index: number) => `${index + 1}. ${item?.question}`,
            )
            .join("<br />");

          const isTruncated = questions.length > 1;

          return (
            <div className='relative'>
              <span
                className='break-words'
                dangerouslySetInnerHTML={{
                  __html: isExpanded ? renderedQuestions : truncatedQuestions,
                }}
              />
              {isTruncated && (
                <span
                  className='text-[#4338CA] inline underline cursor-pointer whitespace-nowrap ml-2'
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? " Show Less" : " Read More"}
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Actions",
        accessorKey: "actions",
        meta: {
          disableFilters: true,
        },
        cell({ row }) {
          return (
            <div className='flex justify-start items-center gap-5'>
              <CustomSwitch
                name={`switch${row.original.id}`}
                defaultChecked={
                  selectedQuestionnaireIds &&
                  selectedQuestionnaireIds?.includes(row.original.id)
                }
                checked={
                  selectedQuestionnaireIds &&
                  selectedQuestionnaireIds?.includes(row.original.id)
                }
                onChange={() =>
                  handleQuestionnaireSwitchChange(row.original.id)
                }
              />
            </div>
          );
        },
      },
    ];

  return (
    <div>
      <CustomDialog
        title={row?.is_quesionnaire ? "Link Questionnaire" : "Link Scenario"}
        className={"max-w-[1116px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose(false);
        }}
      >
        <Formik
          initialValues={{
            scenerio_id: "",
            assessment_id: "",
            quesionnaire_id: "",
          }}
          enableReinitialize
          onSubmit={() => {
            let data = {};

            if (row?.is_quesionnaire === false) {
              data = selectedScenarioIds?.map((item: any) => ({
                assessment_id: assesmentId,
                scenerio_id: item,
              }));
            } else {
              data = selectedQuestionnaireIds?.map((item: any) => ({
                assessment_id: assesmentId,
                quesionnaire_id: item,
              }));
            }
            mutate({ assessments: data });
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <div className='mt-[-30px]'>
                <div className='mb-10 mt-5  '>
                  {selectedOptions?.length ? (
                    <div className='flex flex-wrap gap-3 overflow-x-auto no-scrollbar items-center border p-4'>
                      {selectedOptions.map((item: any) => (
                        <Badge
                          key={item.id}
                          variant='default'
                          className='mx-1 !h-[29px] rounded-sm py-1 flex items-center gap-1'
                        >
                          {item?.label}
                          <button
                            type='button'
                            onClick={() => removeItem(item.id)}
                            className='ml-1 text-[#008000] hover:text-red-600'
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {row?.is_quesionnaire ? (
                  questionnaireData ? (
                    <Datagrid
                      tableMetaDataKey='assessment-config-link-questionnaire'
                      title='Questionnaire'
                      columns={columnsForQuestion}
                      data={questionnaireData || []}
                      disableFilters
                    />
                  ) : (
                    <CustomLoader />
                  )
                ) : scenarioData ? (
                  <Datagrid
                    tableMetaDataKey='assessment-config-link-scenario'
                    title='Scenario'
                    columns={columns}
                    data={scenarioData || []}
                    disableFilters
                  />
                ) : (
                  <CustomLoader />
                )}
              </div>
              <DialogFooter className='py-4 px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  {(row?.is_quesionnaire === true
                    ? questionnaireData
                    : scenarioData
                  )?.length === 0 && (
                    <CustomButton
                      variant='outline'
                      onClick={() =>
                        navigate("/activities/add-scenario", {
                          state: { ProjectId: projectId },
                        })
                      }
                    >
                      Create Questionnaire
                    </CustomButton>
                  )}

                  <CustomButton
                    variant='outline'
                    onClick={() => handleClose(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    isPending={isPending}
                    disabled={
                      isPending ||
                      (selectedScenarioIds?.length === 0 &&
                        selectedQuestionnaireIds?.length === 0)
                    }
                    onClick={() => handleSubmit()}
                  >
                    Save
                  </CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default LinkScenarioDialog;
