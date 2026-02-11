import { CustomDialog, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import CheckBoxAutocomplete from "@/components/checkbox-autocomplet";
import AlertComponent from "@/components/error-alert";
import CustomSelect from "@/components/inputs/custom-select";
import TimeRangePicker from "@/components/inputs/range-time-picker";
import { DialogFooter } from "@/components/ui/dialog";
import { AssessorsInterface } from "@/interfaces/assessors";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";

const CheckerError = ({
  setConflictRows,
  conflicts,
  assesmentData,
}: {
  setConflictRows: (_: any) => void;
  conflicts: any;
  assesmentData: any;
}) => {
  const { values } = useFormikContext<any>();

  useEffect(() => {
    let conflictMap: any = {};
    values?.details?.forEach((data: any, index: number) => {
      const { startTime, endTime } = data;
      let roomConflict = conflicts?.filter((conflict: any) => {
        if (conflict?.isGroupActivity === true) {
          return;
        } else
          return (
            conflict.type === "room" &&
            conflict.id === data.room_name?.id &&
            conflict.startTime === startTime &&
            conflict.endTime === endTime
          );
      });

      let assessorConflict = conflicts?.filter((conflict: any) => {
        return (
          conflict.type === "assessor" &&
          conflict.id === data.assessor_name?.id &&
          conflict.startTime === startTime &&
          conflict.endTime === endTime
        );
      });

      let participants = Array.isArray(data?.participant_name)
        ? data.participant_name
        : [data?.participant_name];

      let participantConflict = participants
        ?.map((participant: any) => {
          return conflicts?.find(
            (conflict: any) =>
              conflict.type === "participant" &&
              conflict.id === participant?.id &&
              conflict.startTime === startTime &&
              conflict.endTime === endTime,
          );
        })
        ?.filter(Boolean);

      conflictMap[index] = {
        roomConflict: roomConflict?.map((c: any) => ({
          ...c,
          assessment_name:
            assesmentData?.find((a: any) => a.id === c.conflictingWith)
              ?.assessment_name || c.conflictingWith,
        })),
        assessorConflict: assessorConflict?.map((c: any) => ({
          ...c,
          assessment_name:
            assesmentData?.find((a: any) => a.id === c.conflictingWith)
              ?.assessment_name || c.conflictingWith,
        })),
        participantConflict: participantConflict?.map((c: any) => ({
          ...c,
          assessment_name:
            assesmentData?.find((a: any) => a.id === c.conflictingWith)
              ?.assessment_name || c.conflictingWith,
        })),
      };
    });

    setConflictRows(conflictMap);
  }, [values, conflicts, assesmentData]);

  return null;
};

const GroupActivityDetailsDialoag = ({
  handleClose,
  data,
  handleFormSubmit,
  selectedAssesment,
  facilityData,
  updateData,
  conflicts,
  assesmentData,
  assessorsData = [],
}: {
  handleClose: (item: boolean) => void;
  data: any;
  handleFormSubmit: (item: any) => void;
  selectedAssesment: any;
  facilityData: any;
  updateData?: any;
  conflicts?: any;
  assesmentData?: any;
  assessorsData?: AssessorsInterface[];
}) => {
  //-------- api call ---------//
  // const { data: AssessorsData } = useQuery<any[]>({
  //   queryKey: [`/assessors/active-assessors`],
  //   select: (data: any) => data?.data?.data?.rows,
  //   enabled: true,
  // });

  //-------- state management --------//
  const [initialValues, setInitialValues] = useState<any>({ details: [] });

  //------- yup validations -------//
  const validationSchema = Yup.object().shape({
    details: Yup.array().of(
      Yup.object({
        room_name: Yup.mixed().required("This field is required"),
        participant_name: Yup.mixed().required("This field is required"),
        assessor_name: Yup.mixed().required("This field is required"),
      }),
    ),
  });

  //------- useEffect ------//
  useEffect(() => {
    if (updateData) {
      setInitialValues({ details: updateData || [] });
    } else if (data) {
      let startTime = 9 * 60;
      const interval = 30;
      const slotsCount = 1;

      const newDetails = Array.from({ length: slotsCount }).map(() => {
        const startHour = Math.floor(startTime / 60);
        const startMinute = startTime % 60;
        const endHour = Math.floor((startTime + interval) / 60);
        const endMinute = (startTime + interval) % 60;

        const formattedStartTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
        const formattedEndTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

        startTime += interval;

        return {
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          room_name: "",
          participant_name: "",
          assessor_name: "",
        };
      });

      setInitialValues({ details: newDetails });
    }
  }, [data, updateData]);

  //---------- handle time change function ---------//
  const handleTimeChange = (
    newStart: Date,
    index: number,
    setFieldValue: any,
    values: any,
  ) => {
    const interval = 30;
    let currentEnd = new Date(newStart);

    for (let i = index + 1; i < values.details.length; i++) {
      const nextStart = new Date(currentEnd);
      const nextEnd = new Date(nextStart);

      nextEnd.setMinutes(nextEnd.getMinutes() + interval);

      setFieldValue(
        `details[${i}].startTime`,
        `${String(nextStart.getHours()).padStart(2, "0")}:${String(
          nextStart.getMinutes(),
        ).padStart(2, "0")}`,
      );

      setFieldValue(
        `details[${i}].endTime`,
        `${String(nextEnd.getHours()).padStart(2, "0")}:${String(
          nextEnd.getMinutes(),
        ).padStart(2, "0")}`,
      );

      currentEnd = new Date(nextEnd);
    }
  };

  //------ state management ----------//
  const [conflictRows, setConflictRows] = useState<any>({});

  return (
    <div>
      <CustomDialog title={"Group Activity"} className='!max-w-[1278px]'>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleFormSubmit({ [selectedAssesment]: values.details });
            handleClose(false);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <CheckerError
                setConflictRows={setConflictRows}
                conflicts={conflicts}
                assesmentData={assesmentData}
              />
              <div className='pb-10'>
                <FieldArray name='details'>
                  {({ push, remove }) => (
                    <div className=''>
                      {values.details?.map((_: any, index: any) => (
                        <div
                          key={index}
                          className='relative rounded-lg bg-white'
                        >
                          <PageHeading className='mb-2' variant='secondary'>
                            Team {index + 1}
                          </PageHeading>
                          <div className='relative mt-2 flex items-center py-5'>
                            <div className='w-full flex flex-wrap gap-5'>
                              <div>
                                <CustomSelect
                                  className='w-[223.60px] h-[46px]'
                                  label='Room Name'
                                  name={`details[${index}].room_name`}
                                  getOptionLabel={(item) => item?.room}
                                  getOptionValue={(item) => item?.id}
                                  options={facilityData?.room || []}
                                />
                              </div>
                              <div>
                                <TimeRangePicker
                                  label='Timings'
                                  startTimeName={`details[${index}].startTime`}
                                  endTimeName={`details[${index}].endTime`}
                                  defaultStartTime={
                                    values.details[index]?.startTime ||
                                    "09:00.00"
                                  }
                                  defaultEndTime={
                                    values.details[index]?.endTime || "09:30.00"
                                  }
                                  onTimeChange={(newStart: any) =>
                                    handleTimeChange(
                                      newStart,
                                      index,
                                      setFieldValue,
                                      values,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <CheckBoxAutocomplete
                                  label='Participants'
                                  levels={data?.participants || []}
                                  name={`details[${index}].participant_name`}
                                  className='!w-[223.60px] '
                                />
                              </div>
                              <div>
                                <CustomSelect
                                  className='w-[223.60px] h-[46px]'
                                  label='Assessor Name'
                                  name={`details[${index}].assessor_name`}
                                  getOptionLabel={(item) => item.assessor_name}
                                  getOptionValue={(item) => item?.id}
                                  options={assessorsData || []}
                                />
                              </div>
                              <div className='ml-5 mt-10 flex space-x-10'>
                                {index === values.details.length - 1 && (
                                  <IoMdAdd
                                    size={20}
                                    className='text-green-500 size-6 cursor-pointer hover:text-green-700'
                                    onClick={() =>
                                      push({
                                        startTime: "",
                                        endTime: "",
                                        room_name: "",
                                        participant_name: "",
                                        assessor_name: "",
                                      })
                                    }
                                  />
                                )}
                                {values.details.length > 1 && (
                                  <RxCross2
                                    size={20}
                                    className='text-red-500 size-6 cursor-pointer hover:text-red-700'
                                    onClick={() => remove(index)}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          {conflictRows[index] && (
                            <div className='flex gap-2 flex-wrap'>
                              {conflictRows[index].roomConflict?.length > 0 && (
                                <AlertComponent
                                  message={`Selectd Room is occupied in assessment :  ${[
                                    ...new Set(
                                      conflictRows[index].roomConflict
                                        .map((c: any) => c.conflictingWith)
                                        .filter(Boolean),
                                    ),
                                  ].join(", ")}`}
                                  type='destructive'
                                />
                              )}

                              {conflictRows[index].participantConflict?.length >
                                0 && (
                                <AlertComponent
                                  message={`Selectd Participant is occupied in assessment :  ${[
                                    ...new Set(
                                      conflictRows[index].participantConflict
                                        .map((c: any) => c.conflictingWith)
                                        .filter(Boolean),
                                    ),
                                  ].join(", ")}`}
                                  type='destructive'
                                />
                              )}

                              {conflictRows[index].assessorConflict?.length >
                                0 && (
                                <AlertComponent
                                  message={`Selectd Assessor is occupied in assessment : ${[
                                    ...new Set(
                                      conflictRows[index].assessorConflict
                                        .map((c: any) => c.conflictingWith)
                                        .filter(Boolean),
                                    ),
                                  ].join(", ")}`}
                                  type='destructive'
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>
              </div>
              <DialogFooter className='py-4 mt-[-25px] px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton
                    variant='outline'
                    onClick={() => handleClose(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton type='submit'>Save</CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default GroupActivityDetailsDialoag;
