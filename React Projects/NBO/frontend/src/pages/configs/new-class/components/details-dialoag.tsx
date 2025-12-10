import { CustomDialog, Label, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import CustomSelect from "@/components/inputs/custom-select";
import TimeRangePicker from "@/components/inputs/range-time-picker";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";

const DetailsDialog = ({ data, setOpen }: { data: any; setOpen: any }) => {
  //---------- state management ------------//
  const [initialValues, setInitialValues] = useState<any>({
    details: [],
  });
  console.log(data, ",------- data");
  //--------------- useEffect ---------------//
  useEffect(() => {
    if (data?.participantSchedules?.length) {
      console.log(
        data.participantSchedules,
        "<----------- data.participantSchedules",
      );
      const details = data.participantSchedules.map((item: any) => ({
        room_name: item.roomName || "",
        startTime: item.startTime || "",
        endTime: item.endTime || "",
        participant_name: item.participantName || "",
        assessor_name: [...item?.assessorNames],
        // assessor_name: item?.assessorName,
      }));
      setInitialValues({ details });
    } else if (data?.groups?.length && data?.is_group_activity) {
      const details = data?.groups?.map((item: any) => ({
        room_name: item?.roomName || "",
        startTime: item?.startTime || "",
        endTime: item?.endTime || "",
        participant_name:
          item?.participants?.map((p: any) => p?.participantName) || "",
        assessor_name: item?.assessorName,
      }));

      setInitialValues({ details });
    }
  }, [data]);

  return (
    <div>
      <CustomDialog
        title={data?.assessment_name}
        className={"!max-w-[1278px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(false);
        }}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={() => {
            setOpen(false);
          }}
        >
          {({ values }) => (
            <Form>
              <div className='pb-10'>
                <FieldArray name='details'>
                  {() => (
                    <div className=''>
                      {values.details?.map((detail: any, index: number) => {
                        const schedule = data.participantSchedules[index];
                        const AssessmentDate = new Date(detail?.startTime);
                        const groupSchdule = data?.groups?.[index];
                        return (
                          <>
                            {data?.is_group_activity && (
                              <PageHeading variant='secondary' className='mb-2'>
                                Group {index + 1}
                              </PageHeading>
                            )}
                            <div
                              key={index}
                              className='relative rounded-lg bg-white'
                            >
                              <div className='relative mt-2 flex items-center py-5'>
                                <div className='w-full flex flex-wrap gap-4'>
                                  {!schedule?.isQuestionnaire && (
                                    <div>
                                      <Label>Date</Label>
                                      <div className='w-[223.60px] p-2 flex items-center text-sm text-gray-400 h-[46px] border border-gray-100 rounded-sm shadow-sm '>
                                        {moment(AssessmentDate).format(
                                          "DD MMM YYYY",
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {!schedule?.isQuestionnaire && (
                                    <div>
                                      <TimeRangePicker
                                        disabled
                                        label='Timings'
                                        startTimeName={`details[${index}].startTime`}
                                        endTimeName={`details[${index}].endTime`}
                                      />
                                    </div>
                                  )}
                                  {!schedule?.isQuestionnaire && (
                                    <div>
                                      <CustomSelect
                                        className='w-[223.60px] h-[46px]'
                                        label='Room Name'
                                        disabled
                                        name={`details[${index}].room_name`}
                                        getOptionLabel={(room) => room}
                                        getOptionValue={(room) => room}
                                        options={
                                          data?.is_group_activity
                                            ? [groupSchdule?.roomName]
                                            : [schedule?.roomName]
                                        }
                                      />
                                    </div>
                                  )}
                                  {data?.is_group_activity && (
                                    <div>
                                      <CustomSelect
                                        disabled
                                        className='w-[223.60px] h-[46px]'
                                        label='Assessor Name'
                                        name={`details[${index}].assessor_name`}
                                        getOptionLabel={(item) => item}
                                        getOptionValue={(item) => item}
                                        options={[groupSchdule?.assessorName]}
                                      />
                                    </div>
                                  )}
                                  {data?.is_group_activity && (
                                    <div className='min-h-[74px] w-[223.59px]'>
                                      <Label>Participant Name</Label>

                                      <div className='flex  gap-2 border min-h-[46px] p-1  items-center flex-wrap max-w-[223.59px] rounded-sm border-gray-100 shadow-sm '>
                                        {groupSchdule?.participants?.map(
                                          (par: any) => (
                                            <>
                                              <Badge
                                                key={par?.participantId}
                                                variant='default'
                                                className='mx-1 !h-[29px] rounded-sm py-1 flex assessors-center gap-1'
                                              >
                                                {par?.participantName}
                                              </Badge>
                                            </>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {!data?.is_group_activity && (
                                    <div>
                                      <CustomSelect
                                        disabled
                                        className='w-[223.60px] h-[46px]'
                                        label='Participant Name'
                                        name={`details[${index}].participant_name`}
                                        getOptionLabel={(item) => item}
                                        getOptionValue={(item) => item}
                                        options={[schedule?.participantName]}
                                      />
                                    </div>
                                  )}
                                  {!data?.is_group_activity && (
                                    <div className='h-[74px] w-[223.59px]'>
                                      <Label>Assessor Name</Label>

                                      <div className='flex gap-2 border min-h-[46px] items-center flex-wrap max-w-[223.59px] p-1 rounded-sm border-gray-100 shadow-sm '>
                                        {schedule?.assessorNames?.map(
                                          (assessor: any) => (
                                            <Badge
                                              key={assessor}
                                              variant='default'
                                              className='mx-1 !h-[29px] rounded-sm py-1 flex assessors-center gap-1'
                                            >
                                              {assessor}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  )}
                </FieldArray>
              </div>

              <DialogFooter className='py-4 mt-[-25px] px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton
                    variant='outline'
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default DetailsDialog;
