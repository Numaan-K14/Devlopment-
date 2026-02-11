import { IoArrowForwardOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { CustomHeading } from "../components/custom/Heading";
import { useForm, FormProvider } from "react-hook-form";
import { TextareaField } from "@/components/inputs";
import { Form } from "@/components/form";
import { useQuery } from "@/hooks/useQuerry";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { BiLoaderAlt } from "react-icons/bi";
import { axios } from "@/config/axios";
import React from "react";
import { LuPause } from "react-icons/lu";
import { AlertPopUp } from "../components/custom/AlertPop";

export function Section1() {
  const location = useLocation();
  const QuestionerId = location?.state;
  const form = useForm();
  const [apiResponse, setApiResponse] = React.useState<any>(null);
  const [openPop, setOpenPop] = React.useState<any>(false);
  const navigate = useNavigate();

  // ------- API CALL----------------\\
  // ------------ User Fetch From  Local Storage---------------||
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // ------------------ Query ---------------------
  const { data: quessionnaireData, refetch } = useQuery<any>({
    queryKey: [
      `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: !!user?.participant_id && !!QuestionerId,
  });
  console.log(
    quessionnaireData,
    "quessionnaireData For Question>>>>>>>>>>>>>>>"
  );
  // ------------------ Mutation ---------------------
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) => axios.post("/cbi", payload),

    onSuccess: async (res) => {
      const response = res?.data?.data;
      console.log(response, "Response>>>>>>>>>>");
      setApiResponse(response);
      const refetched = await refetch();
      console.log(refetched?.data?.prop_ques_resp, "refetched>>>>>>>>>");
    },
  });
  // --------------------------------------------------------------------
  function LogoutHandle() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (!localStorage.getItem("token")) {
      navigate(0); //for Refreshing page
    }
  }
  function PausedHandle() {
    // console.log("something is pressed");
    refetch();
    setOpenPop(false);
    setApiResponse(null);
  }

  // ------------------ Submit Handle ---------------------
  // is_prop_ques_available: true;
  const onSubmit = (data: any) => {
    console.log(data, "formData");
    const payload = {
      conversation: [
        {
          role: "assistant",
          text: quessionnaireData?.questions?.question,
          id: quessionnaireData?.id,
        },
        { role: "user", text: data?.answer },
      ],
      competency_name: quessionnaireData?.competency?.competency,
      remaining_time: 80,
      probe_count: 0,
      expected_behaviors:
        quessionnaireData?.competency?.expected_behaviours?.map(
          (i: any) => i?.expected_behaviour
        ),
      questionnaire_id: QuestionerId?.partiAssessments?.quessionnaire_id,
      participant_id: user?.participant_id,
    };
    mutate(payload);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BiLoaderAlt className="animate-spin rounded-full h-16 w-16 " />
      </div>
    );
  }
  return (
    <section>
      <CustomHeading
        heading="Section 1 of 6"
        description="Assess your professional skills across key competencies."
        button="Sign Out"
        LogoutHandle={LogoutHandle}
      />
      <div className="p-7">
        <div className="bg-white p-6 border border-gray-200 rounded-sm">
          <p className="font-semibold text-lg leading-6 text-[#181D27] flex justify-between">
            Core Question
            <span className="flex gap-1 items-center text-[#535862] text-base font-medium leading-6">
              <IoMdTime className="w-6 h-6" /> 05:00
            </span>
          </p>

          <p className="font-normal text-base text-[#181D27]">
            This is the main question for this competency. Take your time to
            provide a comprehensive answer.
          </p>

          <FormProvider {...form}>
            <Form {...form}>
              <label className="pt-8 text-[#181D27] font-semibold text-xl leading-7">
                {quessionnaireData?.questions?.question}
              </label>

              <TextareaField
                name="answer"
                placeholder="Write something here..."
                required={true}
                disabled={apiResponse}
              />
              {apiResponse?.is_prop_ques_available == true &&
                quessionnaireData?.prop_ques_resp?.map(
                  (item: any, index: number) => (
                    <TextareaField
                      key={index}
                      label={item.question_text}
                      name={`answer_${index}`}
                      placeholder="Write something here..."
                      defaultValue={item.response}
                    />
                  )
                )}
              <div className="flex justify-end my-8">
                {apiResponse?.is_prop_ques_available === false ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setOpenPop(true)}
                      className="text-base font-semibold leading-5 outline-1 outline-[#c3cbd8] bg-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#c3cbd8] transition-all"
                    >
                      <LuPause />
                      Pause Your Interview
                    </button>

                    <button
                      onClick={PausedHandle}
                      className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#75a5ee] transition-all"
                    >
                      Continue <IoArrowForwardOutline />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={form.handleSubmit(onSubmit)}
                    className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 hover:bg-[#75a5ee] transition-all"
                  >
                    Submit <IoArrowForwardOutline />
                  </button>
                )}
              </div>
            </Form>
          </FormProvider>
          <AlertPopUp
            open={openPop}
            setOpen={setOpenPop}
            Icon="PausedIcon"
            heading="Interview Paused"
            Paragraph="Your Interview has been paused. You can resume it at any time."
            cancel="Sign Out"
            action="Resume Now"
            LogoutHandle={LogoutHandle}
            PausedHandle={PausedHandle}
          />
        </div>
      </div>
    </section>
  );
}
