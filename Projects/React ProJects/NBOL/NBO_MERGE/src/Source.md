section1.tsx:

import { IoArrowForwardOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
// import { useLocation } from "react-router-dom";
import { CustomHeading } from "../components/custom/Heading";
// import { useQuery } from "@/hooks/useQuerry";
import { useForm } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";
// import { BiLoaderAlt } from "react-icons/bi";
// import { axios } from "@/config/axios";
// import \* as yup from "yup";

// import { Textarea } from "@/components/ui/textarea";
import { TextareaField } from "@/components/inputs";
import { Form } from "@/components/form";
import { useQuery } from "@/hooks/useQuerry";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export function Section1() {
const location = useLocation();
const QuestionerId = location.state;
const [apiResponse, setApiResponse] = React.useState<any>(null);
const [fetched, setFetched] = React.useState<any>(null);
// // ------------------react hook form---------------------
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
remaining_time: 100,
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

// ------------------quessionnaireId---------------------
const user = JSON.parse(localStorage.getItem("user") || "{}");
const { data: quessionnaireData, } = useQuery<any>({
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

    onSuccess: async (res) => {
      const response = res?.data?.data;
      console.log(response, "Response>>>>>>>>>>");
      setApiResponse(response);
      const refetched = await refetch();
      console.log(refetched?.data?.prop_ques_resp, "refetched>>>>>>>>>");
      setFetched(refetched);
    },

});

if (isPending)
return (

<div className="flex justify-center items-center h-screen">
<BiLoaderAlt className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
</div>
);

// const schema = yup.object().shape({
// cancellation_reason: yup
// .string()
// .min(10, "Cancellation reason must be at least 10 characters")
// .required("Cancellation reason is required"),
// });

const form = useForm({});
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

          <Form {...form}>
            <label className="pt-8 text-[#181D27] font-semibold text-xl leading-7">
              {quessionnaireData && quessionnaireData?.questions?.question}
            </label>
            {/* <textarea
              {...register("answer")}
              className="mt-4 w-full h-60 border border-gray-300 p-4 rounded-sm placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-[#717680]"
              placeholder="Type Your Answer Here..."
            /> */}
            {/* {apiResponse?.is_prop_ques_available === "true" && (
               )} */}
            <TextareaField
              name="description"
              label="Description"
              placeholder="Write something here..."
              required={true}
            />

            {/* NESTED TEXTAREA (works with getValueByKey) */}
            <TextareaField
              name="details.summary"
              label="Summary"
              placeholder="Enter your summary"
            />

            <div className="flex justify-end my-8">
              <button
                type="submit"
                className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 hover:bg-[#75a5ee] transition-all"
              >
                Submit <IoArrowForwardOutline />
              </button>
            </div>
          </Form>
        </div>
      </div>
    </section>

);
}

// prop_ques_resp;
------------section 1 old code with api integrate------------------

import { IoArrowForwardOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { CustomHeading } from "../components/custom/Heading";
import { useQuery } from "@/hooks/useQuerry";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { BiLoaderAlt } from "react-icons/bi";
import { axios } from "@/config/axios";
import React from "react";

export function Section1() {
const location = useLocation();
const QuestionerId = location.state;
const [apiResponse, setApiResponse] = React.useState<any>(null);
const [fetched, setFetched] = React.useState<any>(null);
// ------------------react hook form---------------------
const { register, handleSubmit } = useForm();
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
remaining_time: 100,
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

    onSuccess: async (res) => {
      const response = res?.data?.data;
      console.log(response, "Response>>>>>>>>>>");
      setApiResponse(response);
      const refetched = await refetch();
      console.log(refetched?.data?.prop_ques_resp, "refetched>>>>>>>>>");
      setFetched(refetched);
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="pt-8 text-[#181D27] font-semibold text-xl leading-7">
              {quessionnaireData && quessionnaireData?.questions?.question}
            </label>
            <textarea
              {...register("answer")}
              className="mt-4 w-full h-60 border border-gray-300 p-4 rounded-sm placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-[#717680]"
              placeholder="Type Your Answer Here..."
            />
            {/* {apiResponse?.is_prop_ques_available === "true" && (
               )} */}

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

---

// import { IoArrowForwardOutline } from "react-icons/io5";
// import { IoMdTime } from "react-icons/io";
// import { useLocation } from "react-router-dom";
// import { CustomHeading } from "../components/custom/Heading";
// import { useQuery } from "@/hooks/useQuerry";
// import { useForm } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";
// import { BiLoaderAlt } from "react-icons/bi";
// import { axios } from "@/config/axios";
// import React from "react";

// export function Section1() {
// const location = useLocation();
// const QuestionerId = location.state;
// const [apiResponse, setApiResponse] = React.useState<any>(null);
// const [fetched, setFetched] = React.useState<any>(null);
// // ------------------react hook form---------------------
// const { register, handleSubmit } = useForm();
// const onSubmit = (data: any) => {
// console.log(data, "formData");
// const payload = {
// conversation: [
// {
// role: "assistant",
// text: quessionnaireData?.questions?.question,
// id: quessionnaireData?.id,
// },
// { role: "user", text: data?.answer },
// ],
// competency_name: quessionnaireData?.competency?.competency,
// remaining_time: 100,
// probe_count: 0,
// expected_behaviors:
// quessionnaireData?.competency?.expected_behaviours?.map(
// (i: any) => i?.expected_behaviour
// ),
// questionnaire_id: QuestionerId?.partiAssessments?.quessionnaire_id,
// participant_id: user?.participant_id,
// };
// mutate(payload);
// };

// // ------------------quessionnaireId---------------------
// const user = JSON.parse(localStorage.getItem("user") || "{}");
// const { data: quessionnaireData, refetch } = useQuery<any>({
// queryKey: [
// `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
// ],
// select: (quessionnaireData: any) => quessionnaireData?.data?.data,
// enabled: !!user?.participant_id && !!QuestionerId,
// });
// console.log(quessionnaireData, "quessionnaireData>>>>>>>>>>>>>>>");
// // -------------------------------------------------------|
// const { mutate, isPending } = useMutation({
// mutationFn: (payload: any) => axios.post("/cbi", payload),

// onSuccess: async (res) => {
// const response = res?.data?.data;
// console.log(response, "Response>>>>>>>>>>");
// setApiResponse(response);
// const refetched = await refetch();
// console.log(refetched?.data?.prop_ques_resp, "refetched>>>>>>>>>");
// setFetched(refetched);
// },
// });

// if (isPending)
// return (
// <div className="flex justify-center items-center h-screen">
// <BiLoaderAlt className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
// </div>
// );

// return (
// <section>
// <CustomHeading
// heading="Section 1 of 6"
// description="Assess your professional skills across key competencies."
// button=""
// />
// <div className="p-7">
// <div className="bg-white p-6 border border-gray-200 rounded-sm ">
// <p className="font-semibold text-lg leading-6 text-[#181D27] flex justify-between">
// Core Question
// <span className="flex gap-1 items-center text-[#535862] text-base font-medium leading-6">
// <IoMdTime className="w-6 h-6" /> 05:00
// </span>
// </p>

// <p className="font-normal text-base leading-0-5 text-[#181D27]">
// This is the main question for this competency. Take your time to
// provide a comprehensive answer.
// </p>

// <form onSubmit={handleSubmit(onSubmit)}>
// <label className="pt-8 text-[#181D27] font-semibold text-xl leading-7">
// {quessionnaireData && quessionnaireData?.questions?.question}
// </label>
// <textarea
// {...register("answer")}
// className="mt-4 w-full h-60 border border-gray-300 p-4 rounded-sm placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-[#717680]"
// placeholder="Type Your Answer Here..."
// />
// {/_ {apiResponse?.is_prop_ques_available === "true" && (
// )} _/}

// <div className="flex justify-end my-8">
// <button
// type="submit"
// className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 hover:bg-[#75a5ee] transition-all"
// >
// Submit <IoArrowForwardOutline />
// </button>
// </div>
// </form>
// </div>
// </div>
// </section>
// );
// }

---

react hook form

import { useForm, FormProvider, useFormContext } from "react-hook-form"

export default function App() {
const methods = useForm()

const onSubmit = (data) => console.log(data)
const { register, reset } = methods

useEffect(() => {
reset({
name: "data",
})
}, [reset]) // ❌ never put `methods` as the deps

return (
<FormProvider {...methods}>
// pass all methods into the context

<form onSubmit={methods.handleSubmit(onSubmit)}>
<NestedInput />
<input {...register("name")} />
<input type="submit" />
</form>
</FormProvider>
)
}

function NestedInput() {
const { register } = useFormContext() // retrieve all hook methods

return <input {...register("test")} />
}

import { useForm } from "react-hook-form"

export default function App() {
const {
register,
handleSubmit,
watch,
formState: { errors },
} = useForm()

const onSubmit = (data) => console.log(data)

console.log(watch("example")) // watch input value by passing the name of it

return (
/_ "handleSubmit" will validate your inputs before invoking "onSubmit" _/

<form onSubmit={handleSubmit(onSubmit)}>
{/_ register your input into the hook by invoking the "register" function _/}
<input defaultValue="test" {...register("example")} />

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}


      <input type="submit" />
    </form>

)
}
-------------------------Section 1 commented------------------------------------
// // ----------------------------------------------------------------------
// import { IoArrowForwardOutline } from "react-icons/io5";
// import { IoMdTime } from "react-icons/io";
// // import { useLocation } from "react-router-dom";
// import { CustomHeading } from "../components/custom/Heading";
// // import { useQuery } from "@/hooks/useQuerry";
// import { useForm, FormProvider } from "react-hook-form";

// // import { useMutation } from "@tanstack/react-query";
// // import { BiLoaderAlt } from "react-icons/bi";
// // import { axios } from "@/config/axios";
// // import \* as yup from "yup";

// // import { Textarea } from "@/components/ui/textarea";
// import { TextareaField } from "@/components/inputs";
// import { Form } from "@/components/form";
// import { useQuery } from "@/hooks/useQuerry";
// import { useLocation } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import React from "react";
// import { BiLoaderAlt } from "react-icons/bi";
// import { axios } from "@/config/axios";

// export function Section1() {
// const location = useLocation();
// const QuestionerId = location.state;
// const [apiResponse, setApiResponse] = React.useState<any>(null);
// const [fetched, setFetched] = React.useState<any>(null);
// // // ------------------react hook form---------------------
// const onSubmit = (data: any) => {
// console.log(data, "formData");
// const payload = {
// conversation: [
// {
// role: "assistant",
// text: quessionnaireData?.questions?.question,
// id: quessionnaireData?.id,
// },
// { role: "user", text: data?.answer },
// ],
// competency_name: quessionnaireData?.competency?.competency,
// remaining_time: 100,
// probe_count: 0,
// expected_behaviors:
// quessionnaireData?.competency?.expected_behaviours?.map(
// (i: any) => i?.expected_behaviour
// ),
// questionnaire_id: QuestionerId?.partiAssessments?.quessionnaire_id,
// participant_id: user?.participant_id,
// };
// mutate(payload);
// };

// // ------------------quessionnaireId---------------------
// const user = JSON.parse(localStorage.getItem("user") || "{}");
// const { data: quessionnaireData, refetch } = useQuery<any>({
// queryKey: [
// `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
// ],
// select: (quessionnaireData: any) => quessionnaireData?.data?.data,
// enabled: !!user?.participant_id && !!QuestionerId,
// });
// console.log(quessionnaireData, "quessionnaireData>>>>>>>>>>>>>>>");
// // -------------------------------------------------------|
// const { mutate, isPending } = useMutation({
// mutationFn: (payload: any) => axios.post("/cbi", payload),

// onSuccess: async (res) => {
// const response = res?.data?.data;
// console.log(response, "Response>>>>>>>>>>");
// setApiResponse(response);
// const refetched = await refetch();
// console.log(refetched?.data?.prop_ques_resp, "refetched>>>>>>>>>");
// setFetched(refetched);
// },
// });

// if (isPending)
// return (
// <div className="flex justify-center items-center h-screen">
// <BiLoaderAlt className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
// </div>
// );

// // const schema = yup.object().shape({
// // cancellation_reason: yup
// // .string()
// // .min(10, "Cancellation reason must be at least 10 characters")
// // .required("Cancellation reason is required"),
// // });

// // eslint-disable-next-line react-hooks/rules-of-hooks
// const form = useForm({});
// return (
// <section>
// <CustomHeading
// heading="Section 1 of 6"
// description="Assess your professional skills across key competencies."
// button=""
// />
// <div className="p-7">
// <div className="bg-white p-6 border border-gray-200 rounded-sm ">
// <p className="font-semibold text-lg leading-6 text-[#181D27] flex justify-between">
// Core Question
// <span className="flex gap-1 items-center text-[#535862] text-base font-medium leading-6">
// <IoMdTime className="w-6 h-6" /> 05:00
// </span>
// </p>

// <p className="font-normal text-base leading-0-5 text-[#181D27]">
// This is the main question for this competency. Take your time to
// provide a comprehensive answer.
// </p>
// <FormProvider {...form}>
// {" "}
// <Form {...form}>
// <label className="pt-8 text-[#181D27] font-semibold text-xl leading-7">
// {quessionnaireData && quessionnaireData?.questions?.question}
// </label>
// {/_ <textarea
// {...register("answer")}
// className="mt-4 w-full h-60 border border-gray-300 p-4 rounded-sm placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-[#717680]"
// placeholder="Type Your Answer Here..."
// /> _/}
// {/_ {apiResponse?.is_prop_ques_available === "true" && (
// )} _/}
// <TextareaField
// name="description"
// label="Description"
// placeholder="Write something here..."
// required={true}
// />
// {/_ <TextareaField
// name="details.summary"
// label="Summary"
// placeholder="Enter your summary"
// /> _/}

// <div className="flex justify-end my-8">
// <button
// onClick={form.handleSubmit(onSubmit)}
// className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 hover:bg-[#75a5ee] transition-all"
// >
// Submit <IoArrowForwardOutline />
// </button>
// </div>
// </Form>
// </FormProvider>
// </div>
// </div>
// </section>
// );
// }

---
