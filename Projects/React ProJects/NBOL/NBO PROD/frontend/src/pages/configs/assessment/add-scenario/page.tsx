import { ButtonFooter, Label } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { DropZone } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import RichTextEditor from "@/components/inputs/rich-text";
import SelectCommonOptions from "@/components/inputs/select-client";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import {
  AssessmentInterface,
  scenarioInterface,
} from "@/interfaces/assessments";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddScenarioPage = () => {
  //-------- state management --------//
  const [response, setResponse] = useState();
  const [questionData, setQuestionData] = useState<any[]>([]);
  const [selectedAssesment, setSelectedAssesment] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>();

  console.log(selectedAssesment, "<---------    !values?.description &&");
  const navigate = useNavigate();
  const { state } = useLocation();

  //-------- api call ---------//
  const { data: AssesmentData } = useQuery<AssessmentInterface[]>({
    queryKey: [`/assessment`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });

  const { mutate: pdfUpload, isPending: uploadPending } = useMutation({
    mutationFn: (data: any) => axios.post("/assessment/convert-to-html", data),
    onSuccess(data) {
      setResponse(data?.data);
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  const { mutate: xslUpload } = useMutation({
    mutationFn: (data: any) =>
      axios.post(
        `/assessment/convert-excel-to-html/${selectedClient?.id}`,
        data,
      ),
    onSuccess(data) {
      setQuestionData(data?.data?.data?.html?.data);
    },
    onError(resp: any) {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  // const validationSchema = Yup.object().shape({
  //   ...(response !== null && {
  //     scenerio_name: Yup.string().required("This field is required"),
  //   }),
  // });

  const { mutate: download, isPending: downloadPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.get(
        `assessment/download/${selectedClient?.id}`,
      );
      return response.data;
    },
    onSuccess: (res) => {
      const url = res?.data?.filePath.split("/").slice(1).join("/");
      const link = document.createElement("a");
      link.href = `${process.env.REACT_APP_API_BASE_URL}/${url}`;
      link.click();
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      questionData?.length
        ? axios.post(
            `/assessment/create-quessionnaire/${selectedAssesment?.id}`,
            data,
          )
        : axios.post(`/assessment/add-scenerio/${selectedAssesment?.id}`, data),
    onSuccess(data) {
      setResponse(data?.data);
      toast.success(data.data.msg || "Successful");
      queryClient.refetchQueries({
        queryKey: [``],
        exact: false,
      });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  // console.log(response, "<---------- response");
  //-------- handle functions ---------//
  const handleDownload = () => {
    download();
  };
  //-------- initial values ---------//
  const initialValues: scenarioInterface = {
    file: "",
    description: "",
    scenerio_name: "",
    assessment_id: "",
    quesionnaire_name: "",
    questions: [],
  };
  return (
    <div>
      {/* <PageHeading>Add Scenario</PageHeading> */}
      <AppBar title='Scenario Management' subTitle='Add Scenario' />
      <div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          // validationSchema={validationSchema}
          onSubmit={(values) => {
            let data: any;

            if (questionData?.length) {
              data = {
                project_id: state?.ProjectId?.id,
                client_id: selectedClient?.id,
                assessment_id: values.assessment_id?.id,
                quesionnaire_name: values.quesionnaire_name,
                questions: questionData,
              };
            } else {
              const formData = new FormData();
              if (values?.file?.[0]) {
                formData.append("file", values.file[0]);
              }
              formData.append("description", values.description || "");
              formData.append("scenerio_name", values.scenerio_name || "");
              formData.append("assessment_id", values.assessment_id?.id || "");
              data = formData;
            }

            mutate(data, {
              onSuccess: () => {
                navigate(-1);
              },
            });
          }}
        >
          {({ values, setFieldValue, resetForm, setValues, errors }) => (
            console.log(values, ",--------- values ", errors),
            (
              <Form>
                <div className='flex flex-col gap-8 mb-10'>
                  <div className='flex flex-wrap items-center gap-5'>
                    {/* <CustomSelect
                      required
                      key={values?.assessment_id}
                      options={AssesmentData || []}
                      getOptionLabel={(item) => item?.assessment_name}
                      getOptionValue={(item) => item?.id}
                      label='Name of the Assessment'
                      name='assessment_id'
                      className='w-[494px] h-[48px]'
                      onChange={(item) => {
                        resetForm({
                          values: {
                            assessment_id: item,
                            file: "",
                            description: "",
                            scenerio_name: "",
                            quesionnaire_name: "",
                            questions: [],
                          },
                        });

                        setFieldValue("assessment_id", item);

                        setSelectedAssesment(item?.id);
                        setResponse(undefined);
                        setQuestionData([]);
                        setSelectedClient(undefined);
                      }}
                    /> */}
                    <CustomSelect
                      required
                      value={selectedAssesment}
                      options={AssesmentData || []}
                      getOptionLabel={(item) => item?.assessment_name}
                      getOptionValue={(item) => item?.id}
                      label='Name of the Assessment'
                      name='assessment_id'
                      className='w-[494px] !rounded-[8px] !h-[44px]'
                      onChange={(item) => {
                        setResponse(undefined);
                        setQuestionData([]);
                        setSelectedClient(undefined);
                        setSelectedAssesment(item);

                        setValues({
                          assessment_id: item,
                          file: "",
                          description: "",
                          scenerio_name: "",
                          quesionnaire_name: "",
                          questions: [],
                        });
                      }}
                    />

                    {((selectedAssesment?.is_quesionnaire &&
                      !response &&
                      !values?.questions?.length) ||
                      (selectedAssesment?.is_quesionnaire &&
                        !values?.file?.length)) && (
                      <>
                        <SelectCommonOptions
                          disabled={
                            values?.questions?.length && values?.file?.length
                              ? true
                              : false
                          }
                          handleChange={setSelectedClient}
                          required={true}
                          handleDataChange={(client: any | null) => {
                            setSelectedClient(client);
                            localStorage.setItem(
                              "client",
                              JSON.stringify(client),
                            );
                          }}
                          localStorageName='client'
                          url='/client/getall-clients'
                        />
                        {selectedClient && (
                          <SelectCommonOptions
                            disabled={
                              values?.questions?.length && values?.file?.length
                                ? true
                                : false
                            }
                            handleDataChange={(project: any | null) => {
                              localStorage.setItem(
                                "project",
                                JSON.stringify(project),
                              );
                            }}
                            required={true}
                            localStorageName='project'
                            url={`/projects/client-projects/${selectedClient?.id}`}
                          />
                        )}
                      </>
                    )}

                    {selectedAssesment?.is_quesionnaire === true && (
                      <div className='h-[74px] w-[494px]'>
                        <Label className='' required>
                          Upload Questionnaire (.xls){" "}
                        </Label>
                        <DropZone
                          accept={{ exel: [".xlsx"] }}
                          name='file'
                          type='secondary'
                          className='!h-[44px] mt-[-2px] border-[1px]  flex bg-white !rounded-[8px] border-[#D5D7DA]'
                          onChange={(files: any) => {
                            const formData = new FormData();
                            formData.append("file", files[0]);
                            xslUpload(formData, {
                              onSuccess: (data) => {
                                toast.success(data?.data?.msg || "Successful");
                                const parsedQuestions =
                                  data?.data?.data?.html?.data || [];
                                setQuestionData(parsedQuestions);
                                setFieldValue("questions", parsedQuestions);
                              },
                              // onError: (resp: any) => {
                              //   toast.error(
                              //     resp?.response?.data?.message ||
                              //       "Something went wrong!",
                              //   );
                              // },
                            });
                          }}
                        />
                      </div>
                    )}

                    {((selectedAssesment?.is_quesionnaire &&
                      !response &&
                      !values?.questions?.length) ||
                      (selectedAssesment?.is_quesionnaire &&
                        !values?.file?.length)) && (
                      <div className='h-[74px]'>
                        <CustomButton
                          variant='outline'
                          disabled={!selectedClient}
                          className='mt-[22px] !h-[48px] flex gap-2'
                          onClick={handleDownload}
                          isPending={downloadPending}
                        >
                          <FaDownload />
                          Download Sample
                        </CustomButton>
                      </div>
                    )}

                    {selectedAssesment?.is_quesionnaire === false && (
                      <div className='h-[74px] w-[494px]'>
                        <Label required>Upload Scenario (.pdf) </Label>
                        <DropZone
                          accept={{ pdf: [".pdf"] }}
                          name='file'
                          type='secondary'
                          className='h-[48px] mt-[2px] !rounded-[8px] border-[1px] bg-white shadow-[rgba(10,13,18,0.05)]  border-[#D5D7DA]'
                          onChange={(files: any) => {
                            const formData = new FormData();
                            formData.append("file", files[0]);
                            pdfUpload(formData, {
                              onSuccess: (data) => {
                                const htmlContent = data?.data;
                                setResponse(htmlContent);
                                setFieldValue("description", htmlContent);
                                toast.success(data?.data?.msg || "Successful");
                              },
                              onError: (resp: any) => {
                                toast.error(
                                  resp?.response?.data?.message ||
                                    "Something went wrong!",
                                );
                              },
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {/* {values?.assessment_id?.is_quesionnaire &&
                  !response &&
                  !questionData?.length && (
                  
                  )} */}

                  {response && values?.file?.length ? (
                    <div className='flex flex-col gap-8'>
                      <div className='flex gap-5'>
                        <CustomInput
                          name='scenerio_name'
                          className='w-[494px] h-[48px]'
                          label='Scenario Name'
                        />
                      </div>

                      <div className='mt-10'>
                        <Label>Scenario Section </Label>
                        <RichTextEditor className='' name='description' />
                      </div>
                    </div>
                  ) : null}
                </div>

                {values?.questions?.length && values?.file?.length ? (
                  <>
                    <CustomInput
                      name='quesionnaire_name'
                      className='w-[494px] h-[48px]'
                      label='Questionnaire Name'
                      required
                    />
                    <div className='p-4 pt-14 mb-10'>
                      <table className='table-auto w-full border border-gray-300'>
                        <thead>
                          <tr className='bg-gray-100'>
                            <th className='border px-4 py-2 text-left'>No</th>
                            <th className='border px-4 py-2 text-left'>
                              Question
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {values?.questions?.map((item, index) => (
                            <tr key={index}>
                              <td className='border px-4 py-2'>{index + 1}</td>
                              <td className='border px-4 py-2'>
                                {item?.question}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <ButtonFooter>
                  <div className='flex gap-4 justify-end'>
                    <Link to={"/activities"}>
                      <CustomButton variant='outline'>Cancel</CustomButton>
                    </Link>
                    <CustomButton
                      disabled={
                        isPending ||
                        uploadPending ||
                        (values?.scenerio_name || values?.quesionnaire_name) ===
                          ""
                      }
                      type='submit'
                    >
                      Save
                    </CustomButton>
                  </div>
                </ButtonFooter>
              </Form>
            )
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddScenarioPage;
