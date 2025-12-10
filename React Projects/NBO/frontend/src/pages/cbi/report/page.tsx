"use client";

import { ButtonFooter } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { CoustomTextarea } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { axios } from "@/config/axios";
import { useQuery } from "@/hooks/useQuerry";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { GoDotFill } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CbiReportPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { data: QuestionData } = useQuery<any>({
    queryKey: [`cbi/participant-response-score/${state}`],
    select: (data: any) => data?.data?.data,
    enabled: true,
  });

  console.log(QuestionData, "<----------------- QuestionData");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(`/cbi/${state}/update-final-score`, data),
    onSuccess(data: any) {
      toast.success(data.data.mesage || "Successful");
      navigate("/cbi/edit-report", { state });
    },
  });

  const mappedInitialValues =
    QuestionData?.map((item: any) => ({
      id: item.id,
      rating: item?.rating,
      competency: item.competency.competency,
      competency_id: item.competency.id,
      question_id: item.questions.id,
      core_answer: item?.response || "",
      questionnaire_id: item?.quessionaire_id,
      prop_ques_resp: item.prop_ques_resp?.map((p: any) => ({
        id: p.id,
        question_text: p.question_text,
        response: p.response || "",
      })),
    })) || [];

  console.log(mappedInitialValues, ",----------------- mappedInitialValues");
  return (
    <div>
      <AppBar
        showNav={false}
        title='Score Management'
        subTitle='Edit and Manage Final Score'
      />

      <div className='flex flex-col gap-5 mb-10 p-5'>
        {QuestionData && (
          <Formik
            enableReinitialize
            initialValues={{
              answers: mappedInitialValues,
              cbi_score_submitted: "",
            }}
            onSubmit={(values) => {
              const data = {
                cbi_score_submitted: values?.cbi_score_submitted,
                final_score: values?.answers?.map((i: any) => ({
                  id: i?.id,
                  rating: Number(i?.rating || 0),
                  questionnaire_id: values?.answers[0]?.questionnaire_id,
                  question_id: i?.question_id,
                  competency_id: i?.competency_id,
                })),
              };
              mutate(data);
              // console.log("✅ Form Submitted:", data);
            }}
          >
            {({ values, handleSubmit, setFieldValue }) => (
              // console.log(values, "<------ values"),
              <Form>
                {values.answers.map((item: any, index: number) => (
                  <Card
                    key={item.id}
                    className='border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-6'
                  >
                    <Accordion type='single' collapsible>
                      <AccordionItem value={item.id} className='border-none'>
                        <AccordionTrigger
                          className={cn(
                            "flex items-center justify-between px-6 py-4 text-lg font-semibold hover:no-underline",
                          )}
                        >
                          <div className='flex !justify-between w-full items-center'>
                            <div className='flex flex-col text-left'>
                              <h3 className='text-[#181D27] font-semibold text-[18px] leading-[28px]'>
                                {item.competency}
                              </h3>
                              <p className=' text-[#181D27] text-[16px] font-normal'>
                                Competency based evaluation
                              </p>
                            </div>
                            <div className=' text-[16px] leading-[24px] text-[#717680] flex items-center gap-3 mr-6'>
                              <CustomInput
                                name={`answers[${index}].rating`}
                                className='w-[46px] !h-[34px]'
                              />{" "}
                              / 5
                              {/* {QuestionData[index]?.rating ?? "-"} / 5 */}
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className='bg-gray-50 border m-5 '>
                          <div
                            className={`flex flex-col gap-8  bg-white p-6  rounded-[8px] relative ${item?.prop_ques_resp?.length > 0 ? "pl-10" : ""} `}
                          >
                            {/* --- Core Question --- */}

                            <div className='flex flex-col gap-4 relative'>
                              {item?.prop_ques_resp?.length > 0 && (
                                <>
                                  <GoDotFill className='absolute -left-[20px] top-[6px] text-[#7F56D9]' />

                                  <div className='absolute border-[#E4E7EC] border-l-[2px] -ml-[10px] h-full left-[-4px] top-6'></div>
                                </>
                              )}
                              <p className='text-[20px] font-semibold leading-[30px] text-[#181D27]'>
                                Core Question
                              </p>
                              <p className='text-[#181D27] text-[18px] leading-7 font-medium'>
                                {QuestionData[index]?.questions?.question}
                              </p>

                              <CoustomTextarea
                                disabled={true}
                                name={`answers[${index}].core_answer`}
                                placeholder='Type your answer here...'
                                className='w-full !h-[150px] !rounded-[8px]'
                                value={item.core_answer}
                              />
                            </div>

                            {/* --- Follow-Up Questions --- */}
                            {item?.prop_ques_resp?.length > 0 && (
                              <div className='flex flex-col gap-6 mt-2 relative '>
                                {item.prop_ques_resp.map(
                                  (prop: any, pIndex: number) => (
                                    <div
                                      key={prop.id}
                                      className='flex flex-col gap-4 relative'
                                    >
                                      <GoDotFill className='absolute -left-[20px] top-[6px] text-[#7F56D9]' />
                                      {prop.response && (
                                        <div className='absolute border-[#E4E7EC] border-l-[2px] -ml-[10px] h-full left-[-4px] top-6'></div>
                                      )}
                                      <p className='text-[20px] leading-[30px] font-bold text-[#535862]'>
                                        Follow Up Question {pIndex + 1}
                                      </p>
                                      <p className='text-[#181D27] text-[18px] leading-7 font-medium'>
                                        {prop.question_text}
                                      </p>
                                      <CoustomTextarea
                                        disabled={true}
                                        name={`answers[${index}].prop_ques_resp[${pIndex}].response`}
                                        placeholder='Type your answer here...'
                                        className='w-full !h-[150px] !rounded-[8px]'
                                        value={prop.response}
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}

                <ButtonFooter>
                  <div className='flex gap-4 justify-end'>
                    <CustomButton
                      variant='outline'
                      onClick={() => navigate(-1)}
                    >
                      back
                    </CustomButton>
                    {/* <CustomButton
                        type='submit'
                        variant='outline'
                        isPending={isPending}
                        onClick={() =>
                          setFieldValue("cbi_score_submitted", "in_progress")
                        }
                      >
                        Save and back
                      </CustomButton> */}
                    <CustomButton
                      type='submit'
                      isPending={isPending}
                      onClick={() =>
                        setFieldValue("cbi_score_submitted", "completed")
                      }
                    >
                      Submit and next
                    </CustomButton>
                  </div>
                </ButtonFooter>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default CbiReportPage;
