import { ButtonFooter } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import RichTextEditor from "@/components/inputs/rich-text";
import { Card } from "@/components/ui/card";
import { axios } from "@/config/axios";
import { useQuery } from "@/hooks/useQuerry";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CbiRportEditPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state, "<------------asdfghjkl;");
  const { data: ReportData } = useQuery<any>({
    queryKey: [`cbi/get-participant-report/${state}`],
    select: (data: any) => data?.data?.data,
    enabled: true,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(`/cbi/update-participant-report/${ReportData?.id}`, data),
    onSuccess(data) {
      toast.success(data.data.message || " Successfully");
      navigate("/cbi");
    },
  });

  const [initialValues, setInitialValues] = useState({
    is_report_submitted: "",
    strengths: "",
    development: "",
    recommendations: [
      { day: "30 Day Plan", key: "day30", value: "" },
      { day: "60 Day Plan", key: "day60", value: "" },
      { day: "90 Day Plan", key: "day90", value: "" },
    ],
  });

  useEffect(() => {
    if (ReportData) {
      const formatRecommendation = (arr?: string[]) =>
        Array.isArray(arr) ? arr.join("\n• ") : arr || "";

      setInitialValues({
        is_report_submitted: "",
        strengths: ReportData?.strengths?.overall_strength || "",
        development: ReportData?.development_areas?.overall_development || "",
        recommendations: [
          {
            day: "30 Day Plan",
            key: "day30",
            value:
              formatRecommendation(ReportData?.recommendations?.day30) || "",
          },
          {
            day: "60 Day Plan",
            key: "day60",
            value:
              formatRecommendation(ReportData?.recommendations?.day60) || "",
          },
          {
            day: "90 Day Plan",
            key: "day90",
            value:
              formatRecommendation(ReportData?.recommendations?.day90) || "",
          },
        ],
      });
    }
  }, [ReportData]);

  //   const validationSchema = Yup.object({
  //     strengths: Yup.string().required("Please enter your strengths."),
  //     development: Yup.string().required(
  //       "Please enter your areas of development.",
  //     ),
  //     recommendations: Yup.array().of(
  //       Yup.object({
  //         value: Yup.string().required("Please fill this recommendation."),
  //       }),
  //     ),
  //   });

  return (
    <div>
      <AppBar
        subTitle='Add, Edit and Manage Report'
        title='Participant Report'
        showNav={false}
      />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          const formatRecommendationsToString = (
            label: string,
            str: string,
          ) => {
            const cleaned = str
              .split(/\n|•/)
              .map((s) => s.trim())
              .filter(Boolean)
              .map((s) => `• ${s}`)
              .join("\n");

            return `${label.toUpperCase()}:\n${cleaned}`;
          };

          //   const recommendationsString = [
          //     formatRecommendationsToString(
          //       "30 Day Plan",
          //       values.recommendations[0].value,
          //     ),
          //     formatRecommendationsToString(
          //       "60 Day Plan",
          //       values.recommendations[1].value,
          //     ),
          //     formatRecommendationsToString(
          //       "90 Day Plan",
          //       values.recommendations[2].value,
          //     ),
          //   ];

          const recommendationsString = {
            day30: [values.recommendations[0].value],
            day60: [values.recommendations[1].value],
            day90: [values.recommendations[2].value],
          };

          const formattedData = {
            is_report_submitted: values?.is_report_submitted,
            strengths: values.strengths,
            development_areas: values.development,
            recommendations: recommendationsString,
          };
          //   console.log(formattedData, "<----------- formattedData");
          mutate(formattedData);
        }}
      >
        {({ values, errors, setFieldValue }) => (
          <Form className='flex flex-col gap-8 !mb-20'>
            <Card className='p-8 shadow-md'>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col text-left'>
                  <h3 className='text-[#181D27] font-semibold text-[18px] leading-[28px]'>
                    Strengths
                  </h3>
                  <p className='text-[#181D27] text-[16px] font-normal'>
                    Highlight key strengths and accomplishments
                  </p>
                </div>
                <RichTextEditor name='strengths' className='min-h-[200px]' />
              </div>
            </Card>

            <Card className='p-8 shadow-md'>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col text-left'>
                  <h3 className='text-[#181D27] font-semibold text-[18px] leading-[28px]'>
                    Areas of Development
                  </h3>
                  <p className='text-[#181D27] text-[16px] font-normal'>
                    Identify opportunities for improvement and growth
                  </p>
                </div>
                <RichTextEditor name='development' className='min-h-[200px]' />
              </div>
            </Card>

            <Card className='p-8 shadow-md'>
              <div className='flex flex-col gap-5'>
                <div className='flex flex-col text-left'>
                  <h3 className='text-[#181D27] font-semibold text-[18px] leading-[28px]'>
                    Recommendations
                  </h3>
                  <p className='text-[#181D27] text-[16px] font-normal'>
                    Outline specific recommendations for growth and development
                  </p>
                </div>

                {values.recommendations.map((item, index) => (
                  <div key={item.key} className='flex flex-col gap-4'>
                    <h4 className='text-[#181D27] font-semibold text-[16px]'>
                      {item.day}
                    </h4>
                    <RichTextEditor
                      name={`recommendations[${index}].value`}
                      className='min-h-[150px]'
                    />
                  </div>
                ))}
              </div>
            </Card>

            <ButtonFooter>
              <div className='flex justify-end pt-4 gap-2'>
                <CustomButton
                  variant='outline'
                  className='px-6'
                  onClick={() => navigate(-1)}
                >
                  Back
                </CustomButton>
                {/* <CustomButton
                  type='submit'
                  variant='outline'
                  className='px-6'
                  onClick={() =>
                    setFieldValue("is_report_submitted", "inprogress")
                  }
                >
                  Save
                </CustomButton> */}
                <CustomButton
                  type='submit'
                  className='px-6'
                  onClick={() =>
                    setFieldValue("is_report_submitted", "completed")
                  }
                >
                  Submit
                </CustomButton>
              </div>
            </ButtonFooter>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CbiRportEditPage;
