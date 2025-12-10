import { IoArrowForwardOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { CustomHeading } from "../components/custom/Heading";
import { useQuery } from "@/hooks/useQuerry";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { BiLoaderAlt } from "react-icons/bi";
import { axios } from "@/config/axios";

export function Section1() {
  const location = useLocation();
  const QuestionerId = location.state;
  // ------------------react hook form---------------------
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    const payload = {
      conversation: [
        {
          role: "assistant",
          text: quessionnaireData?.questions?.question,
          id: quessionnaireData?.questions?.id,
        },
        { role: "user", text: data?.answer },
      ],
      competency_name: quessionnaireData?.competency?.competency,
      remaining_time: 10000,
      probe_count: 0,
      expected_behaviors:
        quessionnaireData?.competency?.expected_behaviours?.map(
          (i: any) => i?.expected_behaviour
        ),
      questionnaire_id: QuestionerId?.partiAssessments?.quessionnaire_id,
      participant_id: user?.participant_id,
    };
    mutate(payload);
    console.log(data, "formData");
  };

  // ------------------quessionnaireId---------------------
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data: quessionnaireData, refetch } = useQuery<any>({
    queryKey: [
      `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
    ],
    select: (quessionnaireData: any) => quessionnaireData?.data?.data,
    enabled: !!user?.participant_id && !!QuestionerId,
  });
  console.log(quessionnaireData, "quessionnaireData>>>>>>>>>>>>>>>");
  // -------------------------------------------------------|
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) => axios.post("/cbi", payload),

    onSuccess: (res) => {
      const response = res;
      refetch();
      console.log(response, "Response>>>>>>>>>>");
    },
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <BiLoaderAlt className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
      </div>
    );

  return (
    <section>
      <CustomHeading
        heading="Section 1 of 6"
        description="Assess your professional skills across key competencies."
        button=""
      />
      <div className="p-7">
        <div className="bg-white p-6 border border-gray-200 rounded-sm ">
          <p className="font-semibold text-lg leading-6 text-[#181D27] flex justify-between">
            Core Question
            <span className="flex gap-1 items-center text-[#535862] text-base font-medium leading-6">
              <IoMdTime className="w-6 h-6" /> 05:00
            </span>
          </p>

          <p className="font-normal text-base leading-0-5 text-[#181D27]">
            This is the main question for this competency. Take your time to
            provide a comprehensive answer.
          </p>

          <p className="pt-8 text-[#181D27] font-semibold text-xl leading-7">
            {quessionnaireData && quessionnaireData?.questions?.question}
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              {...register("answer")}
              className="mt-4 w-full h-60 border border-gray-300 p-4 rounded-sm placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-[#717680]"
              placeholder="Type Your Answer Here..."
            />
            {}

            <div className="flex justify-end my-8">
              <button
                type="submit"
                className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 hover:bg-[#75a5ee] transition-all"
              >
                Submit <IoArrowForwardOutline />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// prop_ques_resp;
