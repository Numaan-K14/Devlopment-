import { ButtonFooter } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import CountdownTimer from "@/components/countdown-timer";
import { CustomLoader } from "@/components/custom-loader";
import { CoustomTextarea } from "@/components/inputs";
import { axios } from "@/config/axios";
import useBlockRefresh from "@/hooks/usePreventRefresh";
import { useQuery } from "@/hooks/useQuerry";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { CiPause1 } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import HandleRefreshDialoag from "../components/handle-refresh-doaloag";
import PauseDialoag from "../components/pause-dialoag";
import SuccessfullySubmitedDialoag from "../components/submitted-successfully";

const AssessmentQuestionPage = () => {
  const { state } = useLocation();
  const quessionnaire_id = state?.quessionnaire_id;
  const participant_id = state?.participant_id;
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(
    state?.session_time * 60 - 1 || 1099,
  );
  // const [initialTime, setInitialTime] = useState(100000000);
  const [questionAnswerd, setQuestionsAnswerd] = useState(3);
  const [openPauseDialoag, setOpenPauseDialoag] = useState(false);
  const [isPropQuesAvailable, setIsPropQuesAvailable] = useState(true);
  const [successfullySubmitedDialoagOpen, setSuccessfullySubmitedDialoagOpen] =
    useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const remainingTimeRef = useRef(0);

  // console.log(state, "<------------------- session_time");
  const [initialValues, setInitialValues] = useState({
    answer: "",
    question_id: "",
    prop_ques_resp: [],
  });
  const {
    data: QuestionData,
    refetch,
    isPending: QuestiondataPending,
  } = useQuery<any>({
    queryKey: [`/cbi/${quessionnaire_id}/${participant_id}`],
    select: (data: any) => data?.data?.data,
    enabled: !!quessionnaire_id && !!participant_id,
    onSuccess: (data) => setIsPropQuesAvailable(true),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post("/cbi", data),
    onSuccess(data) {
      toast.success(data?.data?.data?.message);
      setIsPropQuesAvailable(data?.data?.data?.is_prop_ques_available);
      if (data?.data?.data?.is_prop_ques_available === true) {
        refetch();
      } else if (data?.data?.data?.is_prop_ques_available === false) {
        setInitialTime((prev) => prev - 1);
        setIsRunning(false);
        setRemainingTime(300);
      }

      if (data?.data?.data?.is_assessment_completed === true) {
        setSuccessfullySubmitedDialoagOpen(true);
        setQuestionsAnswerd(data?.data?.data?.total_question_count);
      }
    },
  });

  const { mutate: pauseMutate, isPending: pausePending } = useMutation({
    mutationFn: () => axios.put(`/cbi/${quessionnaire_id}/${participant_id}`),
    onSuccess(data) {
      toast.success(data?.data?.message || "Successfully submited");
      setOpenPauseDialoag(true);
      // if (data?.data?.data?.is_prop_ques_available === true) {
      //   refetch();
      // }
    },
  });

  useEffect(() => {
    if (QuestionData) {
      setIsRunning(true);
      setInitialValues({
        answer: QuestionData?.response || "",
        question_id: QuestionData?.id || "",
        prop_ques_resp: QuestionData?.prop_ques_resp?.map((i: any) => ({
          question_text: i?.question_text,
          answer: i?.response || "",
          question_id: i?.id,
        })),
      });
    }
  }, [QuestionData]);

  // console.log(initialValues, "<------------ initialValues");

  // useEffect(() => {
  //   setIsRunning(true);
  // }, []);

  // console.log(initialTime, "<--------- initialTime initialTime");
  // console.log(QuestionData, "<-- QuestionData");

  // console.log(remainingTime, "<-------- remainingTime");
  const handleResume = () => {
    setInitialTime(state?.session_time * 60);
    setIsRunning(true);
    setIsPropQuesAvailable(true);
    setOpenPauseDialoag(false);
    refetch();
  };

  const handleSubmitOnRefresh = async (values: any) => {
    const converstion_of_prop_question = values?.prop_ques_resp
      ?.map((a: any) => [
        {
          role: "assistant",
          text: a?.question_text || "",
          id: a?.question_id || "",
        },
        { role: "user", text: a?.answer },
      ])
      .flat();

    // console.log(
    //   converstion_of_prop_question?.length,
    //   "<------------- converstion_of_prop_question",
    // );
    const data = {
      conversation: [
        {
          role: "assistant",
          text: QuestionData?.questions?.question,
          id: QuestionData?.id,
        },
        { role: "user", text: values?.answer },
        ...converstion_of_prop_question,
      ],
      competency_name: QuestionData?.competency?.competency,
      // remaining_time: remainingTime,
      remaining_time: 0,
      probe_count: converstion_of_prop_question?.length
        ? converstion_of_prop_question?.length / 2
        : 0,
      expected_behaviors: QuestionData?.competency?.expected_behaviours?.map(
        (i: any) => i?.expected_behaviour,
      ),
      questionnaire_id: quessionnaire_id,
      participant_id: participant_id,
    };
    await mutate(
      { data },
      {
        onSuccess: () => {
          confirmExit();
        },
        onError: () => {
          cancelExit();
        },
      },
    );
    // await console.log(data, "<--------data");
  };

  const { showPopup, confirmExit, cancelExit } = useBlockRefresh();
  console.log(showPopup, "<--------showPopup");
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values: any) => {
        // console.log(values, "<-------- submit");
        const converstion_of_prop_question = values?.prop_ques_resp
          ?.map((a: any) => [
            {
              role: "assistant",
              text: a?.question_text || "",
              id: a?.question_id || "",
            },
            { role: "user", text: a?.answer },
          ])
          .flat();

        // console.log(
        //   converstion_of_prop_question?.length,
        //   "<------------- converstion_of_prop_question",
        // );
        const data = {
          conversation: [
            {
              role: "assistant",
              text: QuestionData?.questions?.question,
              id: QuestionData?.id,
            },
            { role: "user", text: values?.answer },
            ...converstion_of_prop_question,
          ],
          competency_name: QuestionData?.competency?.competency,
          // remaining_time: remainingTime,
          remaining_time: remainingTimeRef.current,
          probe_count: converstion_of_prop_question?.length
            ? converstion_of_prop_question?.length / 2
            : 0,
          expected_behaviors:
            QuestionData?.competency?.expected_behaviours?.map(
              (i: any) => i?.expected_behaviour,
            ),
          questionnaire_id: quessionnaire_id,
          participant_id: participant_id,
        };

        mutate(data);
        // console.log(data, "<--------- submit datat");
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        // console.log(values, ",------------ values"),
        <Form>
          <div className=''>
            <AppBar
              // extraButtons={}
              showNav={false}
              subTitle='Assess your professional skills across key competencies'
              title={
                QuestionData?.sequence
                  ? `Section ${QuestionData?.sequence} of ${state?.total_sections}`
                  : "Assessment Completed"
              }
              extraButtons={
                QuestionData ? (
                  <CountdownTimer
                    initialTime={initialTime}
                    isRunning={isRunning}
                    // onTimeUpdate={(time) => setRemainingTime(time)}
                    onTimeUpdate={(time) => (remainingTimeRef.current = time)}
                    onComplete={handleSubmit}
                  />
                ) : null
              }
            />

            {QuestionData ? (
              <div className='flex flex-col mt-6 gap-8 mb-20'>
                {isPropQuesAvailable ? (
                  <div className='p-6 bg-white rounded-[8px] flex flex-col gap-8 mb-20'>
                    <div className='flex flex-col gap-4 relative pl-5'>
                      {values?.answer &&
                      QuestionData?.prop_ques_resp?.length ? (
                        <>
                          <GoDotFill className='absolute left-[0px]  top-2  text-[#7F56D9]' />
                          <div className='absolute border-[#E4E7EC] border-l-[2px] left-[7px] h-full  top-7'></div>

                          {/* <div className='absolute left-[40px] top-[100px] '>
                          <img
                            src='/icons/line.svg'
                            alt='line'
                            className='h-[380px]'
                          />
                        </div> */}
                        </>
                      ) : null}
                      <div className={`flex justify-between `}>
                        <div>
                          <p className='text-[18px] font-semibold leading-7 text-[#181D27]'>
                            Core Question
                          </p>
                          {/* <p className='text-[#181D27] text-[16px] leading-6'>
                          This is the main question for this competency. Take
                          your time to provide a comprehensive answer.
                        </p> */}
                        </div>
                        <div></div>
                      </div>
                      <div className='flex flex-col gap-4'>
                        <p className='text-[#181D27] text-xl font-semibold leading-[30px]'>
                          {QuestionData?.questions?.question}
                        </p>
                        <CoustomTextarea
                          // onPaste={(e: any) => e.preventDefault()}
                          disabled={QuestionData?.response !== null}
                          name={`answer`}
                          placeholder='Type Your Answer Here...'
                          className='w-full !h-[200px] !rounded-[8px]'
                          onChange={() =>
                            setFieldValue(
                              "question_id",
                              QuestionData?.question_id,
                            )
                          }
                        />
                      </div>
                    </div>
                    {QuestionData?.prop_ques_resp?.map(
                      (prop: any, index: number) => (
                        <div
                          key={prop?.id || index}
                          className='flex flex-col gap-4 relative pl-5 '
                        >
                          {values?.answer && (
                            <>
                              <GoDotFill className='absolute -left-[0px] top-[6px]  text-[#7F56D9]' />
                            </>
                          )}
                          {prop?.response !== null && (
                            <div className='absolute border-[#E4E7EC] border-l-[2px] h-full left-[7px] top-7'></div>
                          )}
                          <div>Follow Up Question {index + 1}</div>
                          <p className='text-[#181D27] text-xl font-semibold leading-[30px]'>
                            {prop?.question_text}
                          </p>
                          <CoustomTextarea
                            // onPaste={(e: any) => e.preventDefault()}
                            disabled={prop?.response !== null}
                            name={`prop_ques_resp[${index}].answer`}
                            placeholder='Type Your Answer Here...'
                            className='w-full !h-[200px] !rounded-[8px]'
                            onChange={(e: any) => {
                              setFieldValue(
                                `prop_ques_resp[${index}].answer`,
                                e.target.value,
                              );
                              setFieldValue(
                                `prop_ques_resp[${index}].question_id`,
                                prop?.id,
                              );
                            }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <>
                    <div className='p-6 bg-white rounded-[8px] flex flex-col gap-7 '>
                      <div className={`flex justify-between `}>
                        <div>
                          <p className='text-[20px] font-semibold leading-7 text-[#181D27]'>
                            Core Question
                          </p>
                        </div>
                        <div></div>
                      </div>
                      <div className='flex flex-col gap-4'>
                        <p className='text-[#181D27] text-[18px]  leading-[28px]'>
                          {QuestionData?.questions?.question}
                        </p>
                        <CoustomTextarea
                          disabled={true}
                          name={`answer`}
                          placeholder='Type Your Answer Here...'
                          className='w-full !h-[180px] !rounded-[8px]'
                          onChange={() =>
                            setFieldValue(
                              "question_id",
                              QuestionData?.question_id,
                            )
                          }
                        />
                      </div>
                    </div>
                    {QuestionData?.prop_ques_resp?.map(
                      (prop: any, index: number) => (
                        <div
                          key={prop?.id || index}
                          className=' relative p-6 bg-white rounded-[8px] flex flex-col gap-7 '
                        >
                          <div className='text-[20px] font-semibold leading-7 text-[#181D27]'>
                            Follow Up Question {index + 1}
                          </div>
                          <p className='text-[#181D27] text-[18px]  leading-[28px]'>
                            {prop?.question_text}
                          </p>
                          <CoustomTextarea
                            disabled={true}
                            name={`prop_ques_resp[${index}].answer`}
                            placeholder='Type Your Answer Here...'
                            className='w-full !h-[200px] !rounded-[8px]'
                            onChange={(e: any) => {
                              setFieldValue(
                                `prop_ques_resp[${index}].answer`,
                                e.target.value,
                              );
                              setFieldValue(
                                `prop_ques_resp[${index}].question_id`,
                                prop?.id,
                              );
                            }}
                          />
                        </div>
                      ),
                    )}
                  </>
                )}
                {isPropQuesAvailable === false && (
                  <div className='p-2 text-[#4d5a72] border text-[14px]  bg-white border-[#D5D7DA] !rounded-[8px] z-[10000] !sticky'>
                    Your response is submited. Please select continue for
                    proceeding to next section
                  </div>
                )}
                <ButtonFooter>
                  <div className='flex gap-4 justify-end'>
                    {/* <div className='flex space-x-2'>
                    <CustomButton onClick={() => setIsRunning(true)}>
                      Start
                    </CustomButton>
                    <CustomButton
                      variant='secondary'
                      onClick={() => setIsRunning(false)}
                    >
                      Pause
                    </CustomButton>
                    <CustomButton
                      variant='outline'
                      onClick={() => window.location.reload()}
                    >
                      Reset
                    </CustomButton>
                  </div> */}

                    {isPropQuesAvailable === true && (
                      <CustomButton
                        isPending={isPending}
                        disabled={
                          isPending ||
                          (!values?.prop_ques_resp?.length
                            ? !values?.answer
                            : !(
                                values?.prop_ques_resp[
                                  values?.prop_ques_resp?.length - 1
                                ] as any
                              )?.answer)
                        }
                        type='submit'
                        onClick={() => setIsRunning(false)}
                        // onClick={() => setSuccessfullySubmitedDialoagOpen(true)}
                      >
                        Submit <IoArrowForwardOutline className='size-5' />
                      </CustomButton>
                    )}

                    {isPropQuesAvailable === false && (
                      <>
                        <CustomButton
                          isPending={isPending}
                          disabled={isPending}
                          className=''
                          variant='outline'
                          onClick={() => pauseMutate()}
                        >
                          <CiPause1 />
                          Pause Your Interview
                        </CustomButton>
                        <CustomButton
                          isPending={isPending}
                          disabled={isPending}
                          // className='absolute right-0'
                          onClick={() => {
                            handleResume();
                          }}
                        >
                          Continue <IoArrowForwardOutline className='size-5' />
                        </CustomButton>
                      </>
                    )}
                  </div>
                </ButtonFooter>
                {/* </div> */}
              </div>
            ) : QuestiondataPending ? (
              <CustomLoader />
            ) : (
              "Assessment Completed"
            )}
          </div>
          {successfullySubmitedDialoagOpen && (
            <SuccessfullySubmitedDialoag
              sections={state?.total_sections}
              questionAnswerd={questionAnswerd}
              handleClose={setSuccessfullySubmitedDialoagOpen}
            />
          )}
          {openPauseDialoag && (
            <PauseDialoag
              handleClose={setOpenPauseDialoag}
              handleResume={handleResume}
            />
          )}

          {showPopup && (
            <HandleRefreshDialoag
              handleClose={cancelExit}
              handleConfirm={() => handleSubmitOnRefresh(values)}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AssessmentQuestionPage;
