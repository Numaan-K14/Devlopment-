import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CheckBoxAutocomplete from "@/components/checkbox-autocomplet";
import AlertComponent from "@/components/error-alert";
import CustomSelect from "@/components/inputs/custom-select";
import TimeRangePicker from "@/components/inputs/range-time-picker";
import { DialogFooter } from "@/components/ui/dialog";
import { AssessorsInterface } from "@/interfaces/assessors";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const CheckerError = ({
  setConflictRows,
  conflicts,
}: {
  setConflictRows: (_: any) => void;
  conflicts: any;
}) => {
  const { values } = useFormikContext<any>();
  useEffect(() => {
    let conflictMap: any = {};
    values?.details?.forEach((data: any, index: number) => {
      let startTime =
        data.startTime instanceof Date
          ? `${String(data.startTime.getHours()).padStart(2, "0")}:${String(
              data.startTime.getMinutes(),
            ).padStart(2, "0")}`
          : data.startTime;

      let endTime =
        data.endTime instanceof Date
          ? `${String(data.endTime.getHours()).padStart(2, "0")}:${String(
              data.endTime.getMinutes(),
            ).padStart(2, "0")}`
          : data.endTime;

      let roomConflict = conflicts?.filter(
        (conflict: any) =>
          conflict.type === "room" &&
          conflict.id === data.room_name?.id &&
          conflict.startTime === startTime &&
          conflict.endTime === endTime,
      );

      let participantConflict = conflicts?.filter(
        (conflict: any) =>
          conflict.type === "participant" &&
          conflict.id === data?.participant_name?.id &&
          conflict.startTime === startTime &&
          conflict.endTime === endTime,
      );

      let assessorConflict =
        data.assessor_name &&
        data.assessor_name
          ?.map((assessor: any) =>
            conflicts?.find(
              (conflict: any) =>
                conflict.type === "assessor" &&
                conflict.id === assessor?.id &&
                conflict.startTime === startTime &&
                conflict.endTime === endTime,
            ),
          )
          ?.filter(Boolean);

      if (roomConflict || participantConflict || assessorConflict) {
        conflictMap[index] = {
          roomConflict,
          participantConflict,
          assessorConflict,
        };
      }
    });

    setConflictRows(conflictMap);
  }, [values, conflicts]);
  return <></>;
};

const DetailsDialoag = ({
  handleClose,
  data,
  handleFormSubmit,
  selectedAssesment,
  facilityData,
  updateData,
  conflicts,
  selectedAssesmentName,
  isQuesionnaire,
  assessorsData = [],
}: {
  handleClose: (item: boolean) => void;
  data: any;
  handleFormSubmit: any;
  selectedAssesment: any;
  facilityData: any;
  updateData?: any;
  conflicts?: any;
  selectedAssesmentName?: string;
  isQuesionnaire?: any;
  assessorsData?: AssessorsInterface[];
}) => {
  //-------- api call ---------//
  // const { data: AssessorsData } = useQuery<AssessorsInterface[]>({
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
        participant_name: Yup.mixed().required("This field is required"),
        assessor_name: Yup.mixed().required("This field is required"),
      }),
    ),
  });

  //-------- useeffect hook -----------//
  useEffect(() => {
    if (updateData) {
      setInitialValues({ details: updateData || [] });
    } else if (data) {
      let startTime = 9 * 60;
      const interval = 30;
      const newDetails =
        data?.participants?.map((participant: any) => {
          const startHour = Math.floor(startTime / 60);
          const startMinute = startTime % 60;
          const endHour = Math.floor((startTime + interval) / 60);
          const endMinute = (startTime + interval) % 60;

          const formattedStartTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
          const formattedEndTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

          startTime += interval;

          if (isQuesionnaire) {
            return {
              participant_name: participant || "",
              assessor_name: "",
            };
          } else {
            return {
              startTime: formattedStartTime,
              endTime: formattedEndTime,
              break: "none",
              room_name: "",
              participant_name: participant || "",
              assessor_name: "",
            };
          }
        }) || [];

      setInitialValues({ details: newDetails });
    }
  }, [data, updateData]);

  //-------- handle time change funtion  ------------//
  const handleTimeChange = (
    newStart: Date,
    index: number,
    setFieldValue: any,
    values: any,
    isBreak?: boolean,
    breakeValue?: string,
  ) => {
    const interval = 30;
    let currentEnd = new Date(newStart);

    if (isBreak === true && breakeValue) {
      const breakMinutes = Number(breakeValue) || 0;
      currentEnd.setMinutes(currentEnd.getMinutes() + breakMinutes);
    }

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

  //--- time conversion function ----//
  const convertToTime = (timeString: string): Date => {
    const [hours, minutes] = timeString?.split(":")?.map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // ---------- assossesor and room change function -----------//
  const handleAssessorChange = (
    selected: any,
    setFieldValue: any,
    values: any,
    index: number,
  ) => {
    if (
      selectedAssesmentName?.toLowerCase() !== "business case study" &&
      index === 0
    ) {
      values.details.forEach((_: any, index: number) => {
        setFieldValue(`details[${index}].assessor_name`, selected);
      });
    }
  };
  const handleRoomChange = (
    selected: any,
    setFieldValue: any,
    values: any,
    index: number,
  ) => {
    if (index === 0) {
      values.details.forEach((_: any, index: number) => {
        setFieldValue(`details[${index}].room_name`, selected);
      });
    }
  };
  const [conflictRows, setConflictRows] = useState<any>({});

  return (
    <div>
      <CustomDialog
        title={selectedAssesmentName}
        className={"!max-w-[1278px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose(false);
        }}
      >
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
              />
              <div className='pb-10'>
                <FieldArray name='details'>
                  {({}) => (
                    <div className=''>
                      {values.details?.map((_: any, index: any) => (
                        <div
                          key={index}
                          className='relative rounded-lg bg-white'
                        >
                          <div className='relative mt-2 flex items-center py-5'>
                            <div className='w-full flex flex-wrap gap-5'>
                              {!isQuesionnaire && (
                                <>
                                  <div>
                                    <CustomSelect
                                      className='w-[223.60px] h-[46px]'
                                      label='Room Name'
                                      name={`details[${index}].room_name`}
                                      getOptionLabel={(item) => item?.room}
                                      getOptionValue={(item) => item?.id}
                                      options={facilityData?.room || []}
                                      onChange={(selected: any) => {
                                        handleRoomChange(
                                          selected,
                                          setFieldValue,
                                          values,
                                          index,
                                        );
                                      }}
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
                                        values.details[index]?.endTime ||
                                        "09:30.00"
                                      }
                                      onTimeChange={(newStart: any) => {
                                        for (
                                          let i = index;
                                          i < values.details.length;
                                          i++
                                        ) {
                                          setFieldValue(
                                            `details[${i}].break`,
                                            "none",
                                          );
                                        }
                                        handleTimeChange(
                                          newStart,
                                          index,
                                          setFieldValue,
                                          values,
                                        );
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                              <div>
                                <CustomSelect
                                  disabled={true}
                                  className='w-[223.60px] h-[46px]'
                                  label='Participant Name'
                                  name={`details[${index}].participant_name`}
                                  getOptionLabel={(item) =>
                                    item?.participant_name
                                  }
                                  getOptionValue={(item) => item?.id}
                                  options={data?.participants || []}
                                />
                              </div>
                              <div>
                                <CheckBoxAutocomplete
                                  label='Assessor Name'
                                  levels={assessorsData || []}
                                  name={`details[${index}].assessor_name`}
                                  className='!w-[223.60px]'
                                  onChange={(selected: any) => {
                                    handleAssessorChange(
                                      selected,
                                      setFieldValue,
                                      values,
                                      index,
                                    );
                                  }}
                                />
                              </div>
                              {!isQuesionnaire && (
                                <div className='flex'>
                                  <CustomSelect
                                    name={`details[${index}].break`}
                                    className=' h-[46px] !rounded-r-none'
                                    label='Break'
                                    getOptionLabel={(item) => item}
                                    getOptionValue={(item) => item}
                                    options={["none", "15", "60"]}
                                    onChange={(item) => {
                                      setFieldValue(
                                        `details[${index}].break`,
                                        item,
                                      );
                                      handleTimeChange(
                                        convertToTime(
                                          values?.details[index]?.endTime,
                                        ),
                                        index,
                                        setFieldValue,
                                        values,
                                        true,
                                        item,
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {conflictRows[index] && (
                            <div className='flex gap-2 flex-wrap'>
                              {conflictRows[index].roomConflict?.length > 0 && (
                                <AlertComponent
                                  message={`Selectd Room is occupied in assessment: ${[
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
                                  message={`Selectd Participant is occupied in assessment:  ${[
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
                                  message={`Selectd Assessor is occupied in assessment: ${[
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
                  <CustomButton type='submit'>{"Save"}</CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default DetailsDialoag;
