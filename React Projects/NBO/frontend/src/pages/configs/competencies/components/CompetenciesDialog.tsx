import { CustomDialog, Label, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import { CoustomTextarea } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { CompetiencyCreateInterface } from "@/interfaces/competency";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, Form, Formik } from "formik";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import * as Yup from "yup";

const CompetenciesDialog = ({
  handleClose,
  leadershipLevelId,
  clientId,
  row,
  refetchURL,
  forClient = false,
  open,
  setOpen,
}: {
  handleClose: any;
  leadershipLevelId: string;
  row?: any;
  clientId?: string;
  refetchURL?: string;
  forClient?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  //--------- validation schema -----------//
  const validationSchema = Yup.object().shape({
    competency: Yup.string().required("This field is required"),
    expected_behaviours: Yup.array()
      .of(
        Yup.object().shape({
          expected_behaviour: Yup.string().required("This field is required"),
        }),
      )
      .min(1, "At least one behavior is required"),
  });

  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      row
        ? axios.put(`/competency/${row?.id}`, data)
        : axios.post(`/competency/${leadershipLevelId}`, data),
    onSuccess: (data) => {
      handleClose();
      toast.success(
        data?.data?.msg || row
          ? "Competency updated successfully"
          : "Competency created successfully",
      );
      queryClient.refetchQueries({
        queryKey: [refetchURL],
      });
    },
    onError: (error) => {
      toast.error("Failed to submit data");
    },
  });
  //-------- initial values ---------//
  const initialValues: CompetiencyCreateInterface = {
    competency: row?.competency || "",
    description: row?.description || "",
    expected_behaviours: row?.expected_behaviours?.map((item: any) => ({
      expected_behaviour: item?.expected_behaviour || "",
    })) || [{ expected_behaviour: "" }],
  };

  // const [open, setOpen] = useState(false);

  return (
    <div className='relative'>
      <CustomDialog
        title={row ? `${row?.competency}` : "Add New Competency"}
        className={"max-w-[800px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            let finalBehaviours = [];

            if (row) {
              finalBehaviours = values.expected_behaviours;
            } else {
              const lines = values.expected_behaviours[0].expected_behaviour
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
              finalBehaviours = lines.map((line) => ({
                expected_behaviour: line,
              }));
            }

            const payload = forClient
              ? {
                  client_id: clientId || "",
                  leadership_level_id: leadershipLevelId || "",
                  competency: values.competency || "",
                  expected_behaviours: finalBehaviours,
                }
              : {
                  competency: values.competency || "",
                  expected_behaviours: finalBehaviours,
                  description: values?.description || "",
                };

            mutate(payload);
          }}
          enableReinitialize
        >
          {({ values }) => (
            <Form>
              <div className='flex gap-5 flex-col'>
                <div className='flex flex-col gap-4 '>
                  <PageHeading variant='secondary' className='mb-0'>
                    Basic Info
                  </PageHeading>
                  <CustomInput
                    required
                    name='competency'
                    label='Competency Name'
                    className='w-[335px] h-[46px]'
                  ></CustomInput>
                </div>
                <CoustomTextarea
                  name={`description`}
                  className='w-full !h-[117px] !rounded-[5px]'
                  label='Competency Description'
                />
                <PageHeading variant='secondary' className='mb-[16px]'>
                  Expected Behaviours
                </PageHeading>
              </div>
              <FieldArray name='expected_behaviours'>
                {({ push, remove }) => (
                  <div className='space-y-5 mb-10'>
                    {row ? (
                      values.expected_behaviours.map((_: any, index: any) => (
                        <div
                          key={index}
                          className='relative rounded-lg bg-white'
                        >
                          <Label className='text-sm font-medium' required>
                            Expected Behavior {index + 1}
                          </Label>
                          <div className='relative mt-2 flex items-center'>
                            <div className=''>
                              <CoustomTextarea
                                name={`expected_behaviours[${index}].expected_behaviour`}
                                className='w-[607px] !h-[117px] !rounded-[5px]'
                              />
                            </div>
                            <div className='ml-5 flex flex-1 space-x-2'>
                              {values.expected_behaviours.length > 1 && (
                                <CustomButton
                                  variant='outline'
                                  onClick={() => remove(index)}
                                >
                                  <RxCross2
                                    size={20}
                                    className='text-red-500 cursor-pointer hover:text-red-700'
                                  />
                                </CustomButton>
                              )}
                              {index ===
                                values.expected_behaviours.length - 1 && (
                                <CustomButton
                                  variant='outline'
                                  className=''
                                  onClick={() =>
                                    push({ expected_behaviour: "" })
                                  }
                                >
                                  <IoMdAdd
                                    size={20}
                                    className='text-green-500 cursor-pointer hover:text-green-700'
                                  />
                                </CustomButton>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='relative rounded-lg bg-white'>
                        <Label className='text-sm font-medium' required>
                          Expected Behaviors
                        </Label>
                        <CoustomTextarea
                          name={`expected_behaviours[0].expected_behaviour`}
                          className='w-full !h-[117px] !rounded-[5px]'
                        />
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>

              <DialogFooter className='py-4 px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton variant='outline' onClick={() => handleClose()}>
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type='submit'
                    disabled={isPending}
                    isPending={isPending}
                  >
                    {row ? "Update" : "Add"}
                  </CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>

      {/* <Drawer open={open} onOpenChange={setOpen} width='613px'>
        <div className='px-7 h-full  overflow-y-auto '>
          <div className='h-[60px] w-full absolute top-0 z-50 border-b bg-white border-[#D0D0D7] text-[18px] font-bold  py-[16px]'>
            Add Leadership Level
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              let finalBehaviours = [];

              if (row) {
                finalBehaviours = values.expected_behaviours;
              } else {
                const lines = values.expected_behaviours[0].expected_behaviour
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0);
                finalBehaviours = lines.map((line) => ({
                  expected_behaviour: line,
                }));
              }

              const payload = forClient
                ? {
                    client_id: clientId || "",
                    leadership_level_id: leadershipLevelId || "",
                    competency: values.competency || "",
                    expected_behaviours: finalBehaviours,
                  }
                : {
                    competency: values.competency || "",
                    expected_behaviours: finalBehaviours,
                    description: values?.description || "",
                  };

              mutate(payload);
            }}
            enableReinitialize
          >
            {({ values }) => (
              <Form className='h-full py-16 !mb-10'>
                <div className='flex flex-col  '>
                  <div className='flex gap-10 flex-col'>
                    <div className='flex flex-col gap-6 pt-5'>
                      <CustomInput
                        required
                        name='competency'
                        label='Name of the competency'
                        className='w-[335px] h-[46px]'
                      ></CustomInput>
                    </div>
                    <CoustomTextarea
                      name={`description`}
                      className='w-full !h-[117px] !rounded-[5px]'
                      label='Description of the competency'
                    />
                    <PageHeading variant='secondary'>
                      Expected Behaviours
                    </PageHeading>
                  </div>
                  <FieldArray name='expected_behaviours'>
                    {({ push, remove }) => (
                      <div className='space-y-4 mb-24'>
                        {row ? (
                          values.expected_behaviours.map(
                            (_: any, index: any) => (
                              <div
                                key={index}
                                className='relative rounded-lg bg-white'
                              >
                                <Label className='text-sm font-medium' required>
                                  Expected Behavior {index + 1}
                                </Label>
                                <div className='relative mt-2 flex items-center'>
                                  <div className='w-[90%]'>
                                    <CoustomTextarea
                                      name={`expected_behaviours[${index}].expected_behaviour`}
                                      className='w-full !h-[117px] !rounded-[5px]'
                                    />
                                  </div>
                                  <div className='ml-5 flex space-x-2'>
                                    {index ===
                                      values.expected_behaviours.length - 1 && (
                                      <IoMdAdd
                                        size={20}
                                        className='text-green-500 cursor-pointer hover:text-green-700'
                                        onClick={() =>
                                          push({ expected_behaviour: "" })
                                        }
                                      />
                                    )}
                                    {values.expected_behaviours.length > 1 && (
                                      <RxCross2
                                        size={20}
                                        className='text-red-500 cursor-pointer hover:text-red-700'
                                        onClick={() => remove(index)}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ),
                          )
                        ) : (
                          <div className='relative rounded-lg bg-white'>
                            <Label className='text-sm font-medium' required>
                              Expected Behaviors
                            </Label>
                            <CoustomTextarea
                              name={`expected_behaviours[0].expected_behaviour`}
                              className='w-full !h-[117px] !rounded-[5px]'
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>

                <DialogFooter className='py-4 px-6 border-t'>
                <div className=' mx-[28px] bg-white  w-full  flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                  <div className='flex absolute bg-white  bottom-0 right-0 border-t w-full justify-end items-center px-[28px] py-[16px] gap-5'>
                    <CustomButton
                      variant='outline'
                      onClick={() => handleClose()}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type='submit'
                      disabled={isPending}
                      isPending={isPending}
                    >
                      {row ? "Update" : "Add"}
                    </CustomButton>
                  </div>
                </div>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </div>
      </Drawer> */}
    </div>
  );
};

export default CompetenciesDialog;
