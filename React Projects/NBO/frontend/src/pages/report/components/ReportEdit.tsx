import { ButtonFooter, ConfirmDialog, Label, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import RichTextEditor from "@/components/inputs/rich-text";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, Form, Formik } from "formik";
import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ReportEditComponent = ({ Data }: { Data: any }) => {
  //--------- state management --------//
  const { state } = useLocation();
  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;
  const assessor_status = state?.assessor_status;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(`/report/update-report-ai-data/${state?.ParticipantId}`, data),
    onSuccess(data) {
      toast.success("Report Updated Successfully");
      navigate(-1);
      queryClient.refetchQueries({
        queryKey: [`/report/all-class-reports-part/${state?.classId}`],
        exact: false,
      });
    },
  });
  const fields =
    Data?.participant?.class_part_report?.par_avg_comp?.map((item: any) => ({
      avgCompId: item?.id,
      strength: item?.strength,
      area_for_dev: item?.area_for_dev,
      competency: item?.competency?.competency,
    })) ?? [];

  //-------- handle functions ---------//
  const handleSubmit = (values: any) => {
    const data = {
      assessor_id: user?.assessor_id,
      assessor_status: values?.assessor_status,
      conclusion: values?.conclusion,
      summary: values?.part_summary,
      recommendation: values?.recommendation,
      strength: values?.strength,
      area_for_dev: values?.area_for_dev,
      avgCompUpdates: values?.fields,
    };
    mutate(data);
  };
  return (
    <div>
      <Formik
        initialValues={{
          fields,
          recommendation: Data?.participant?.class_part_report?.recommendation,
          part_summary: Data?.participant?.class_part_report?.part_summary,
          conclusion: Data?.participant?.class_part_report?.conclusion,
          strength: Data?.participant?.class_part_report?.strength,
          area_for_dev: Data?.participant?.class_part_report?.area_for_dev,
          assessor_status: "",
        }}
        enableReinitialize
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className='flex flex-col gap-8 mb-10'>
              <div className='flex flex-col gap-5'>
                <div>
                  <PageHeading variant='secondary' className='mb-5'>
                    Summary of Participant
                  </PageHeading>

                  <div className='!mb-10'>
                    <div className='flex items-center justify-between'>
                      <div className='flex gap-4'>
                        <Label>Summary</Label>
                      </div>
                    </div>

                    <RichTextEditor
                      className=' !h-[186px]'
                      name={`part_summary`}
                      disabled={
                        user?.role === "assessor"
                          ? assessor_status === "completed"
                          : false
                      }
                    />
                  </div>
                  <div className='!mb-10'>
                    <div className='flex items-center justify-between'>
                      <div className='flex gap-4'>
                        <Label>Strength</Label>
                      </div>
                    </div>

                    <RichTextEditor
                      className=' !h-[186px]'
                      name={`strength`}
                      disabled={
                        user?.role === "assessor"
                          ? assessor_status === "completed"
                          : false
                      }
                    />
                  </div>

                  <div className='my-10'>
                    <div className='flex items-center justify-between'>
                      <div className='flex gap-4'>
                        <Label>Areas of Development</Label>
                      </div>
                    </div>
                    <RichTextEditor
                      className=' !h-[186px]'
                      name={`area_for_dev`}
                      disabled={
                        user?.role === "assessor"
                          ? assessor_status === "completed"
                          : false
                      }
                    />
                  </div>
                  <div className='mb-10'>
                    <div className='flex items-center justify-between'>
                      <div className='flex gap-4'>
                        <Label>Recommendations</Label>
                      </div>
                    </div>
                    <RichTextEditor
                      className=' !h-[186px]'
                      name={`recommendation`}
                      disabled={
                        user?.role === "assessor"
                          ? assessor_status === "completed"
                          : false
                      }
                    />
                  </div>
                  <div className='mb-10'>
                    <div className='flex items-center justify-between'>
                      <div className='flex gap-4'>
                        <Label>Conclusion</Label>
                      </div>
                    </div>
                    <RichTextEditor
                      className=' !h-[186px]'
                      name={`conclusion`}
                      disabled={
                        user?.role === "assessor"
                          ? assessor_status === "completed"
                          : false
                      }
                    />
                  </div>
                </div>
                <FieldArray
                  name='fields'
                  render={({}) => (
                    <div className='flex flex-col  flex-wrap gap-10 mt-3 mb-10'>
                      {values?.fields?.map((field: any, index: number) => (
                        <div key={field.avgCompId}>
                          <PageHeading variant='secondary' className='mb-5'>
                            {field?.competency}
                          </PageHeading>

                          <div className='mb-16 '>
                            <div className='flex items-center justify-between'>
                              <div className='flex gap-4'>
                                <Label>Strength</Label>
                              </div>
                            </div>
                            <RichTextEditor
                              name={`fields.${index}.strength`}
                              toolbarId={`toolbar-strength-${index}`}
                              className=' !h-[186px]'
                              disabled={
                                user?.role === "assessor"
                                  ? assessor_status === "completed"
                                  : false
                              }
                            />
                          </div>

                          <div className='mb-10'>
                            <div className='flex items-center justify-between'>
                              <div className='flex gap-4'>
                                <Label>Areas of Development</Label>
                              </div>
                            </div>
                            <RichTextEditor
                              name={`fields.${index}.area_for_dev`}
                              toolbarId={`toolbar-dev-${index}`}
                              className=' !h-[186px]'
                              disabled={
                                user?.role === "assessor"
                                  ? assessor_status === "completed"
                                  : false
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>

            <ButtonFooter>
              <div className='flex gap-4 justify-end'>
                <CustomButton
                  variant='outline'
                  onClick={() => navigate(-1)}
                  disabled={isPending}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type='submit'
                  onClick={() =>
                    user?.role === "assessor"
                      ? setFieldValue("assessor_status", "inprogress")
                      : ""
                  }
                  isPending={isPending}
                  disabled={
                    isPending || user?.role === "assessor"
                      ? assessor_status === "completed"
                      : false
                  }
                  variant='outline'
                >
                  Save
                </CustomButton>
                {user?.role === "assessor" && (
                  <CustomButton
                    onClick={() => {
                      setFieldValue("assessor_status", "completed");
                      setOpen(true);
                    }}
                    isPending={isPending}
                    disabled={isPending || assessor_status === "completed"}
                  >
                    Submit
                  </CustomButton>
                )}
              </div>
            </ButtonFooter>
            {open && (
              <ConfirmDialog
                confirmMessage='Are you sure you want to submit ?'
                isPending={isPending}
                title={
                  <span className='flex gap-3 items-center'>
                    <FiAlertCircle className='size-10 text-[#FFAE43]' />
                    Confirm Submission ?
                  </span>
                }
                onClose={() => setOpen(false)}
                onConfirm={() =>
                  handleSubmit({
                    ...values,
                  })
                }
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReportEditComponent;
