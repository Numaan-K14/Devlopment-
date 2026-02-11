import CustomButton from "@/components/button";
import { CoustomTextarea } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import { Drawer } from "@/components/ui/drawer";
import { CompetiencyCreateInterface } from "@/interfaces/competency";
import { Form, Formik } from "formik";

const CompetencyDrawer = ({
  handleClose,
  row,
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
  const initialValues: CompetiencyCreateInterface = {
    competency: row?.competency || "",
    description: row?.description || "",
    expected_behaviours: row?.expected_behaviours?.map((item: any) => ({
      expected_behaviour: item?.expected_behaviour || "",
    })) || [{ expected_behaviour: "" }],
  };
  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen} width='613px' >
        <div className='px-7 h-full  overflow-y-auto '>
          <div className='h-[60px] w-full absolute top-0  border-b bg-white border-[#D0D0D7] text-[18px] font-bold  py-[16px]'>
            Add Competency
          </div>
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            // onSubmit={(values) => {
            //   let finalBehaviours = [];

            //   if (row) {
            //     finalBehaviours = values.expected_behaviours;
            //   } else {
            //     const lines = values.expected_behaviours[0].expected_behaviour
            //       .split("\n")
            //       .map((line) => line.trim())
            //       .filter((line) => line.length > 0);
            //     finalBehaviours = lines.map((line) => ({
            //       expected_behaviour: line,
            //     }));
            //   }

            //   const payload = forClient
            //     ? {
            //         client_id: clientId || "",
            //         leadership_level_id: leadershipLevelId || "",
            //         competency: values.competency || "",
            //         expected_behaviours: finalBehaviours,
            //       }
            //     : {
            //         competency: values.competency || "",
            //         expected_behaviours: finalBehaviours,
            //         description: values?.description || "",
            //       };

            //   mutate(payload);
            // }}
            onSubmit={() => {}}
            enableReinitialize
          >
            {({ values }) => (
              <Form className='h-full py-16 '>
                <div className='flex flex-col  '>
                  <div className='flex gap-6 flex-col'>
                    <div className='flex flex-col gap-6 pt-5'>
                      <CustomInput
                        name='competency'
                        label='Competency Name'
                        className='w-[335px] h-[46px]'
                      ></CustomInput>
                    </div>
                    <CoustomTextarea
                      name={`description`}
                      className='w-full !h-[117px] !rounded-[5px]'
                      label='Description'
                    />
                    <CoustomTextarea
                      name={`core_question`}
                      className='w-full !h-[117px] !rounded-[5px]'
                      label='Core Question'
                    />
                  </div>
                </div>

                {/* <DialogFooter className='py-4 px-6 border-t'> */}
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
                      //   disabled={isPending}
                      //   isPending={isPending}
                    >
                      Next
                    </CustomButton>
                  </div>
                </div>
                {/* </DialogFooter> */}
              </Form>
            )}
          </Formik>
        </div>
      </Drawer>
    </div>
  );
};

export default CompetencyDrawer;
