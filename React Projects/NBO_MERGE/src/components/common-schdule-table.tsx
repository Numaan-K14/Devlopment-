import moment from "moment";
import { useEffect, useState } from "react";
import { CustomLoader } from "./custom-loader";
import { NoData } from "./no-data";
import { PageHeading } from "./page-heading";

interface Assessor {
  assessor_name: string;
}

interface Participant {
  participant_name: string;
}

interface Room {
  room: string;
}

interface EventItem {
  title: string;
  start_time: string | null;
  end_time: string | null;
  duration: string;
  participant?: Participant;
  room?: Room;
  assessors?: Assessor[];
  assessor: any;
  gr_act_part: any[];
}

const CommonScheduleTable = ({
  item,
  // type,
  view,
  break: breakProp,
  // WelcomeSessDuration = 15,
  isFirstDay,
  isLastDay,
}: {
  item: any;
  type?: "COMMON" | "QUESIONNAIRE" | "GROUP";
  view: "ADMIN" | "PARTICIPANT" | "ASSESSOR";
  break?: any[];
  WelcomeSessDuration: number;
  isFirstDay: boolean;
  isLastDay: boolean;
}) => {
  console.log(breakProp, ",---------- break");
  // console.log(item, "<------------- item");
  // const mergedData = (() => {
  //   let all: any[] = [];
  //   item.forEach((assessment: any, index: number) => {
  //     console.log(assessment, "<------------ assessmeenenen", index);
  //     if (assessment?.type === "COMMON") {
  //       assessment.part_assessment?.forEach((pa: any) => {
  //         // console.log(pa, "<------------ pa");
  //         all.push({
  //           assessment_name: assessment.assessment.assessment_name || "",
  //           scenario_name: assessment.scenerio_name || "",
  //           participant_name: pa.participant?.participant_name || "-",
  //           assessors:
  //             pa.assessors.map((a: any) => a.assessor_name).join(" || ") || "",
  //           room: pa.room?.room || "",
  //           start: moment(pa.start_time).format("hh:mm A"),
  //           end: moment(pa.end_time).format("hh:mm A"),
  //         });
  //       });
  //     }
  //   });
  //   console.log(all, "<---------- all datat");
  //   // group by time
  //   const TOYFANDRPALLGOUPED: any = {};
  //   all.forEach((a) => {
  //     const key = `${a.start}-${a.end}`;
  //     if (!TOYFANDRPALLGOUPED[key]) TOYFANDRPALLGOUPED[key] = [];
  //     TOYFANDRPALLGOUPED[key].push(a);
  //   });
  //   return TOYFANDRPALLGOUPED;
  // })();

  // const timeSlots = Object.keys(mergedData);

  const mergedData = (() => {
    const TOYFANDRPALL: any[] = [];
    const BUSINESSCASEALL: any[] = [];
    item.forEach((assessment: any) => {
      if (assessment?.type === "COMMON") {
        assessment.part_assessment?.forEach((pa: any) => {
          TOYFANDRPALL.push({
            assessment_name: assessment.assessment.assessment_name || "",
            scenario_name: assessment.scenerio_name || "",
            participant_name: pa.participant?.participant_name || "-",
            assessors:
              pa.assessors?.map((a: any) => a.assessor_name).join(" || ") || "",
            room: pa.room?.room || "",
            start: moment(pa.start_time).format("hh:mm A"),
            end: moment(pa.end_time).format("hh:mm A"),
          });

          breakProp?.forEach((element) => {
            if (element?.first_br_st === pa.end_time) {
              TOYFANDRPALL.push({
                assessment_name: assessment.assessment.assessment_name || "",
                scenario_name: assessment.scenerio_name || "",
                participant_name: "Short Break",
                assessors: "Short Break",
                room: "Short Break",
                start: moment(element?.first_br_st).format("hh:mm A"),
                end: moment(element?.first_br_en).format("hh:mm A"),
              });
            } else if (element?.lunch_br_st === pa.end_time) {
              TOYFANDRPALL.push({
                assessment_name: assessment.assessment.assessment_name || "",
                scenario_name: assessment.scenerio_name || "",
                participant_name: "Lunch Break",
                assessors: "Lunch Break",
                room: "Lunch Break",
                start: moment(element?.lunch_br_st).format("hh:mm A"),
                end: moment(element?.lunch_br_en).format("hh:mm A"),
              });
            } else if (element?.second_br_st === pa.end_time) {
              TOYFANDRPALL.push({
                assessment_name: assessment.assessment.assessment_name || "",
                scenario_name: assessment.scenerio_name || "",
                participant_name: "Short Break",
                assessors: "Short Break",
                room: "Short Break",
                start: moment(element?.second_br_st).format("hh:mm A"),
                end: moment(element?.second_br_en).format("hh:mm A"),
              });
            }
          });
        });
      } else if (assessment?.type === "BUSINESS") {
        assessment.part_assessment?.forEach((pa: any) => {
          BUSINESSCASEALL.push({
            assessment_name: assessment.assessment.assessment_name || "",
            scenario_name: assessment.scenerio_name || "",
            participant_name: pa.participant?.participant_name || "-",
            assessors:
              pa.assessors?.map((a: any) => a.assessor_name).join(" || ") || "",
            room: pa.room?.room || "",
            start: moment(pa.start_time).format("hh:mm A"),
            end: moment(pa.end_time).format("hh:mm A"),
          });
          breakProp?.forEach((element) => {
            if (element?.first_br_st === pa.end_time) {
              BUSINESSCASEALL.push({
                assessment_name: assessment.assessment.assessment_name || "",
                scenario_name: assessment.scenerio_name || "",
                participant_name: "Short Break",
                assessors: "Short Break",
                room: "Short Break",
                start: moment(element?.first_br_st).format("hh:mm A"),
                end: moment(element?.first_br_en).format("hh:mm A"),
              });
            } else if (element?.lunch_br_st === pa.end_time) {
              BUSINESSCASEALL.push({
                assessment_name: assessment.assessment.assessment_name || "",
                scenario_name: assessment.scenerio_name || "",
                participant_name: "Launch Break",
                assessors: "Launch Break",
                room: "Launch Break",
                start: moment(element?.lunch_br_st).format("hh:mm A"),
                end: moment(element?.lunch_br_en).format("hh:mm A"),
              });
            } else if (element?.second_br_st === pa.end_time) {
              BUSINESSCASEALL.push({
                assessment_name: assessment.assessment.assessment_name || "",
                scenario_name: assessment.scenerio_name || "",
                participant_name: "Short Break",
                assessors: "Short Break",
                room: "Short Break",
                start: moment(element?.second_br_st).format("hh:mm A"),
                end: moment(element?.second_br_en).format("hh:mm A"),
              });
            }
          });
        });
      }
    });

    // console.log(BUSINESSCASEALL, "<--------------- BUSINESSCASEALL");
    // console.log(BUSINESSCASEALL, "<-0------ BUSINESS");
    const TOYFANDRPALLGOUPED: Record<string, any[]> = {};
    const BUSINESSCASEALLGOUPED: Record<string, any[]> = {};

    TOYFANDRPALL.forEach((a) => {
      const key = `${a.start}-${a.end}`;
      if (!TOYFANDRPALLGOUPED[key]) TOYFANDRPALLGOUPED[key] = [];
      TOYFANDRPALLGOUPED[key].push(a);
    });
    BUSINESSCASEALL.forEach((a) => {
      const key = `${a.start}-${a.end}`;
      if (!BUSINESSCASEALLGOUPED[key]) BUSINESSCASEALLGOUPED[key] = [];
      BUSINESSCASEALLGOUPED[key].push(a);
    });

    // console.log(TOYFANDRPALLGOUPED, "<--------- TOYFANDRPALLGOUPED");
    // console.log(BUSINESSCASEALLGOUPED, "<--------- BUSINESSCASEALLGOUPED");

    const allTimeSlotsForRpandTOYF = Object.keys(TOYFANDRPALLGOUPED);
    // const allTimeSlotsForBUSINESS = Object.keys(BUSINESSCASEALLGOUPED);

    // console.log(
    //   allTimeSlotsForBUSINESS,
    //   "<------------ allTimeSlotsForBUSINESS",
    // );

    allTimeSlotsForRpandTOYF.forEach((slot) => {
      const slotDataforTOYFandRP = TOYFANDRPALLGOUPED[slot];
      const hasRolePlay = slotDataforTOYFandRP.find(
        (d) => d.assessment_name === "Role Play",
      );
      const hasThink = slotDataforTOYFandRP.find(
        (d) => d.assessment_name === "Think On Your Feet",
      );

      if (!hasRolePlay) {
        slotDataforTOYFandRP.push({
          assessment_name: "Role Play",
          scenario_name: "-",
          participant_name: "-",
          assessors: "-",
          room: "-",
          start: slot.split("-")[0],
          end: slot.split("-")[1],
          placeholder: true,
        });
      }

      if (!hasThink) {
        slotDataforTOYFandRP.push({
          assessment_name: "Think On Your Feet",
          scenario_name: "-",
          participant_name: "-",
          assessors: "-",
          room: "-",
          start: slot.split("-")[0],
          end: slot.split("-")[1],
          placeholder: true,
        });
      }

      TOYFANDRPALLGOUPED[slot] = slotDataforTOYFandRP.sort((a, b) =>
        a.assessment_name.localeCompare(b.assessment_name),
      );
    });

    return { TOYFANDRPALLGOUPED, BUSINESSCASEALLGOUPED };
  })();

  const timeSlotsForTOYFandRP = Object.keys(mergedData?.TOYFANDRPALLGOUPED);
  const timeSlotsForBC = Object.keys(mergedData?.BUSINESSCASEALLGOUPED);

  // console.log(timeSlots, "<------------ time slot");
  // console.log(mergedData, "<------------ mergedData");

  const [showLoadder, setShowLoader] = useState(true);
  useEffect(() => {
    if (Array.isArray(item) && item.length === 0) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [item]);

  const businessItems = item?.filter((s: any) => s?.type === "BUSINESS");
  const QuestionnairItems = item?.filter(
    (s: any) => s?.type === "QUESIONNAIRE",
  );
  const breakRows =
    breakProp && breakProp?.length > 0
      ? [
          {
            title: "BREAK 1",
            start_time: breakProp[0]?.first_br_st,
            end_time: breakProp[0]?.first_br_en,
            isBreak: true,
          },
          {
            title: "BREAK 2",
            start_time: breakProp[0]?.second_br_st,
            end_time: breakProp[0]?.second_br_en,
            isBreak: true,
          },
          {
            title: "LUNCH BREAK",
            start_time: breakProp[0]?.lunch_br_st,
            end_time: breakProp[0]?.lunch_br_en,
            isBreak: true,
          },
        ]
      : [];

  console.log(breakRows, "<-------- breakRows");
  const assessmentRows = item.flatMap((s: any) =>
    s?.type === "GROUP"
      ? s?.gr_act_rooms?.[0]
        ? [
            {
              s,
              p: s.gr_act_rooms[0],
              start_time: s.gr_act_rooms[0].start_time,
              end_time: s.gr_act_rooms[0].end_time,
              isBreak: false,
            },
          ]
        : []
      : s?.part_assessment?.map((p: any) => ({
          s,
          p,
          start_time: p.start_time,
          end_time: p.end_time,
          isBreak: false,
        })),
  );

  const merged = [...assessmentRows, ...breakRows]
    .filter((r) => r?.start_time)
    .sort((a, b) => {
      const ta = a?.start_time ? new Date(a?.start_time).getTime() : 0;
      const tb = b?.start_time ? new Date(b?.start_time).getTime() : 0;
      return ta - tb;
    });

  console.log(merged, "<----------- merged");

  const getWelcomeTime = (slot: string, duration = 15) => {
    if (slot) {
      console.log(slot, "<----------- slot");
      const [startTime] = slot?.split("-");

      const [time, meridian] = startTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      // console.log(hours, minutes, ",====hours minutss,", slot);

      if (meridian === "PM" && hours !== 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;

      const totalMinutes = hours * 60 + minutes - duration;
      console.log(
        totalMinutes,
        "totalmimites",
        totalMinutes / 60,
        "duratuon",
        duration,
      );
      const beforeHours = Math.floor(totalMinutes / 60);
      const beforeMinutes = totalMinutes % 60;

      const format = (h: number, m: number) =>
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

      return `${format(beforeHours, beforeMinutes)} - ${format(hours, minutes)}`;
    }
  };

  const getClosureTime = (slot: string, duration = 15) => {
    const [, endTime] = slot.split("-"); // "05:30 PM"

    const [time, meridian] = endTime.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour for calculation
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    // Add duration
    const totalMinutes = hours * 60 + minutes + duration;
    const afterHours24 = Math.floor(totalMinutes / 60);
    const afterMinutes = totalMinutes % 60;

    // Convert back to 12-hour format
    const format12 = (h24: number, m: number) => {
      const h12 = h24 % 12 || 12;
      const mer = h24 >= 12 ? "PM" : "AM";
      return `${h12.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")} ${mer}`;
    };

    const startFormatted = format12(hours, minutes);
    const endFormatted = format12(afterHours24, afterMinutes);

    return `${startFormatted} - ${endFormatted}`;
  };

  console.log(item, "<----------- item");
  const allEvents =
    item?.flatMap(
      (s: any) =>
        s?.gr_act_rooms?.flatMap(
          (event: any) => event?.gr_act_part?.map(() => event) ?? [],
        ) ?? [],
    ) ?? [];

  console.log(allEvents, "<----- allevents");
  const lastEndTime = allEvents?.at(-1)?.end_time;
  const formattedEnd = lastEndTime
    ? moment(lastEndTime).format("hh:mm A")
    : null;

  const lastEndTimeForGp = item?.find(
    (g: any) => g?.title === "Group Activity",
  )?.end;

  const formatedEndForGP = lastEndTimeForGp
    ? moment(lastEndTimeForGp).format("hh:mm A")
    : null;
  console.log(formatedEndForGP, "<------------ lastEndTimeForGp");
  console.log(breakProp, "<------------ breakProp");

  return item?.length ? (
    <div className=''>
      {view === "ADMIN" && (
        <div className='overflow-x-auto mb-10 p-4'>
          <div className='flex flex-col gap-10'>
            {mergedData &&
              (timeSlotsForTOYFandRP?.length > 0 ||
                timeSlotsForBC?.length > 0) && (
                <div className='flex flex-col '>
                  <PageHeading>
                    Role Play | Think On Your Feet | Business Case{" "}
                  </PageHeading>
                  <table className='table-auto w-full border border-gray-300 '>
                    <thead>
                      <tr className='bg-white text-left h-[60px] text-sm font-normal '>
                        <th className='border px-4 py-2 w-[16.6%]'>
                          Participant
                        </th>
                        <th className='border px-4 py-2 w-[16.6%]'>Details</th>
                        <th className='border px-4 py-2 w-[16.6%]'>Time</th>
                        <th className='border px-4 py-2 w-[16.6%]'>Details</th>
                        <th className='border px-4 py-2 w-[16.6%]'>
                          Participant
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {isFirstDay ? (
                        <tr className=' h-[60px] text-center bg-white text-[13px] font-bold'>
                          <td colSpan={5} className='w-full'>
                            <p>Welcome Session</p>
                            <p>
                              {/* {getWelcomeTime(
                                timeSlotsForTOYFandRP[0],
                                WelcomeSessDuration,
                              )} */}
                              {moment(breakProp?.[0]?.wlc_sess_st).format(
                                "hh:mm A",
                              )}{" "}
                              -{" "}
                              {moment(breakProp?.[0]?.wlc_sess_en).format(
                                "hh:mm A",
                              )}
                            </p>
                          </td>
                        </tr>
                      ) : null}
                      {timeSlotsForTOYFandRP.map((slot, index) => {
                        const Data = mergedData?.TOYFANDRPALLGOUPED;
                        // console.log(slot);
                        const events = Data[slot];
                        // console.log(events, "<-------------- events");
                        return (
                          <tr
                            key={slot}
                            className={`${events?.[0]?.participant_name?.includes("Break") ? "bg-[#FFD08A] h-[60px] text-center text-[13px]" : "bg-[#FAFAFA]"} text-[#71717A] text-center text-[13px]`}
                          >
                            <td className='border px-4 py-2 w-[16.6%] text-start'>
                              {events?.[0]?.participant_name || "-"}
                            </td>
                            {index === 0 && (
                              <td
                                className='border px-4 py-2 w-[16.6%]'
                                rowSpan={timeSlotsForTOYFandRP.length}
                              >
                                <div className='text-center'>
                                  <p>
                                    Assessment -{" "}
                                    {events?.[0]?.assessment_name || "-"}
                                  </p>
                                  <p>Room - {events?.[0]?.room || "-"}</p>
                                  <p>
                                    Assessors - {events?.[0]?.assessors || "-"}
                                  </p>
                                </div>
                              </td>
                            )}
                            <td className='border px-4 py-2 text-center w-[16.6%]'>
                              {slot}
                            </td>
                            {index === 0 && (
                              <td
                                className='border px-4 py-2 w-[16.6%]'
                                rowSpan={timeSlotsForTOYFandRP.length}
                              >
                                <div className='text-center'>
                                  <p>
                                    Assessment -{" "}
                                    {events?.[1]?.assessment_name || "-"}
                                  </p>
                                  <p>Room - {events?.[1]?.room || "-"}</p>
                                  <p>
                                    Assessors - {events?.[1]?.assessors || "-"}
                                  </p>
                                </div>
                              </td>
                            )}
                            <td className='border px-4 py-2 w-[16.6%] text-start'>
                              {events?.[1]?.participant_name || "-"}
                            </td>
                          </tr>
                        );
                      })}
                      {timeSlotsForBC.map((slot, index) => {
                        const Data = mergedData?.BUSINESSCASEALLGOUPED;
                        // console.log(Data, "<------- Data", slot);
                        const events = Data[slot];
                        // console.log(events, "<-------------- events");
                        return (
                          <tr
                            key={slot}
                            className={`${events?.[0]?.participant_name?.includes("Break") ? "bg-[#FFD08A] h-[60px] text-center text-[13px]" : "bg-[#FAFAFA]"} text-[#71717A] text-[13px] `}
                          >
                            <td className='border   px-4 py-2 w-[16.6%]'>
                              {events?.[0]?.participant_name || "-"}
                            </td>
                            {index === 0 && (
                              <td
                                className='border px-4 py-2 w-[16.6%] '
                                rowSpan={timeSlotsForBC.length}
                              >
                                <div className='text-center'>
                                  <p>
                                    Assessment -{" "}
                                    {events?.[0]?.assessment_name || "-"}
                                  </p>
                                  <p>Room - {events?.[0]?.room || "-"}</p>
                                  <p>
                                    Assessors - {events?.[0]?.assessors || "-"}
                                  </p>
                                </div>
                              </td>
                            )}
                            <td className='border px-4 py-2 w-[16.6%] text-center'>
                              {slot}
                            </td>
                            {index === 0 && (
                              <td
                                className='border px-4 py-2 w-[16.6%]'
                                rowSpan={timeSlotsForBC.length}
                              >
                                <div className='text-center'>
                                  <p>
                                    Assessment -{" "}
                                    {events?.[1]?.assessment_name || "-"}
                                  </p>
                                  <p>Room - {events?.[1]?.room || "-"}</p>
                                  <p>
                                    Assessors - {events?.[1]?.assessors || "-"}
                                  </p>
                                </div>
                              </td>
                            )}
                            <td className='border px-4 py-2 w-[16.6%]'>
                              {events?.[1]?.participant_name || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            {/* {businessItems?.length > 0 && (
              <div className='flex flex-col'>
                <PageHeading>Business Case</PageHeading>
                <table className='table-auto w-full border border-gray-300'>
                  <thead className='bg-[#EFF4FF] text-left h-[60px] text-sm font-normal'>
                    <tr>
                      <th className='border px-4 py-2 w-[16.6%]'>Assessment</th>
                      <th className='border px-4 py-2 w-[16.6%]'>Time</th>
                      <th className='border px-4 py-2 w-[16.6%]'>
                        Participant
                      </th>
                      <th className='border px-4 py-2 w-[16.6%]'>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessItems.map((s: any) =>
                      s.part_assessment?.map((event: any, idx: number) => {
                        const isLunch = event?.title === "LUNCH BREAK";
                        return (
                          <tr
                            key={idx}
                            className={
                              isLunch
                                ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                                : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                            }
                          >
                            {idx === 0 && (
                              <td
                                className='border px-4 py-2'
                                rowSpan={s.part_assessment?.length}
                              >
                                {`${s?.assessment?.assessment_name} - ${
                                  s?.quesionnaire_name
                                    ? s?.quesionnaire_name
                                    : s?.scenerio_name
                                }`}
                              </td>
                            )}
                            <td className='border px-4 py-2'>
                              {`${moment(event?.start_time).format("hh:mm A")} - ${moment(event?.end_time).format("hh:mm A")}`}
                            </td>
                            <td className='border px-4 py-2'>
                              {event?.participant?.participant_name || "-"}
                            </td>
                            <td className='border px-4 py-2'>
                              {isLunch ? (
                                "LUNCH BREAK"
                              ) : (
                                <>
                                  <p>
                                    Assessor:{" "}
                                    {event?.assessors
                                      ?.map(
                                        (assessor: any) =>
                                          assessor?.assessor_name,
                                      )
                                      .join(" || ") || "-"}
                                  </p>
                                  <p>Room - {event?.room?.room || "-"}</p>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      }),
                    )}
                  </tbody>
                </table>
              </div>
            )} */}

            {QuestionnairItems?.length > 0 && (
              <div className='flex flex-col '>
                <PageHeading>
                  Leadership Questionnaire & Group Activity
                </PageHeading>
                <table className='table-auto w-full border border-gray-300'>
                  <thead className='bg-white text-left h-[60px] text-sm font-normal'>
                    <tr>
                      <th className='border px-4 py-2 w-[16.6%]'>Assessment</th>
                      <th className='border px-4 py-2 w-[16.6%]'>Time</th>
                      <th className='border px-4 py-2 w-[16.6%]'>
                        Participant
                      </th>
                      {/* <th className='border px-4 py-2 w-[16.6%]'>Room</th> */}
                      <th className='border px-4 py-2 w-[16.6%]'>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item?.map((s: any) => {
                      if (s?.type === "QUESIONNAIRE") {
                        return s?.part_assessment?.map(
                          (event: EventItem, idx: number) => {
                            const isLunch = event?.title === "LUNCH BREAK";

                            return (
                              <tr
                                key={idx}
                                className={
                                  isLunch
                                    ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                                    : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                                }
                              >
                                {idx === 0 && (
                                  <td
                                    className='border px-4 py-2 '
                                    rowSpan={s.part_assessment.length}
                                  >
                                    {`${s?.assessment?.assessment_name} - ${
                                      s?.quesionnaire_name
                                        ? s?.quesionnaire_name
                                        : s?.scenerio_name
                                    }`}
                                  </td>
                                )}
                                {idx === 0 && (
                                  <td
                                    className='border px-4 py-2'
                                    rowSpan={s?.part_assessment?.length}
                                  >
                                    {"All Day"}
                                  </td>
                                )}

                                <td className='border px-4 py-2'>
                                  {event?.participant?.participant_name || "-"}
                                </td>
                                {/* <td className='border px-4 py-2'>
                                {event?.room?.room || "-"}
                              </td> */}
                                <td className='border px-4 py-2'>
                                  {isLunch ? (
                                    "LUNCH BREAK"
                                  ) : (
                                    <>
                                      <p>
                                        Assessor:{" "}
                                        {event?.assessors
                                          ?.map(
                                            (assessor) =>
                                              assessor?.assessor_name,
                                          )
                                          .join(" || ") || "-"}
                                      </p>
                                      <p>Room - {event?.room?.room || "-"}</p>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          },
                        );
                      } else if (s?.type === "GROUP") {
                        return (
                          <>
                            {(() => {
                              const rows =
                                s?.gr_act_rooms?.flatMap((event: any) =>
                                  event?.gr_act_part?.map((e: any) => ({
                                    event,
                                    e,
                                  })),
                                ) || [];

                              return rows.map(
                                (
                                  { event, e }: { event: any; e: any },
                                  rowIndex: number,
                                ) => {
                                  const isLunch = e?.title === "LUNCH BREAK";

                                  return (
                                    <tr
                                      key={rowIndex}
                                      className={
                                        isLunch
                                          ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                                          : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                                      }
                                    >
                                      {rowIndex === 0 && (
                                        <td
                                          className='border px-4 py-2'
                                          rowSpan={rows?.length}
                                        >
                                          {`${s?.assessment?.assessment_name} - ${
                                            s?.quesionnaire_name
                                              ? s?.quesionnaire_name
                                              : s?.scenerio_name
                                          }`}
                                        </td>
                                      )}

                                      {rowIndex === 0 && (
                                        <td
                                          className='border px-4 py-2'
                                          rowSpan={rows.length}
                                        >
                                          {event?.start_time && event?.end_time
                                            ? `${moment(event?.start_time).format("hh:mm A")} - ${moment(
                                                event?.end_time,
                                              ).format("hh:mm A")}`
                                            : "All Day"}
                                        </td>
                                      )}

                                      <td className='border px-4 py-2'>
                                        {e?.participants?.participant_name ||
                                          "-"}
                                      </td>

                                      {/* <td className='border px-4 py-2'>
                                      {event?.room?.room || "-"}
                                    </td> */}

                                      <td className='border px-4 py-2'>
                                        {isLunch ? (
                                          "LUNCH BREAK"
                                        ) : (
                                          <>
                                            <p>
                                              Assessor:{" "}
                                              {event?.assessor?.assessor_name ||
                                                "-"}
                                            </p>
                                            <p>
                                              Room - {event?.room?.room || "-"}
                                            </p>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                },
                              );
                            })()}
                          </>
                        );
                      }
                    })}
                    {isLastDay ? (
                      <tr className=' h-[60px] text-center bg-white text-[13px] font-bold'>
                        <td colSpan={5} className='w-full'>
                          <p>Concluding Session</p>

                          {/* <p>5.00 - 5.30</p> */}
                          <p>
                            {" "}
                            {/* {formattedEnd
                              ? getClosureTime(
                                  `${formattedEnd}-${formattedEnd}`,
                                  WelcomeSessDuration,
                                )
                              : "-"} */}
                            {moment(breakProp?.[0]?.ending_sess_st).format(
                              "hh:mm A",
                            )}{" "}
                            -{" "}
                            {moment(breakProp?.[0]?.ending_sess_en).format(
                              "hh:mm A",
                            )}
                          </p>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {view === "PARTICIPANT" && (
        <div className='overflow-x-auto p-4'>
          <table className='table-auto w-full border border-gray-300'>
            <thead className='bg-[#EFF4FF] text-left h-[60px] text-sm font-normal'>
              <tr>
                <th className='border px-4 py-2'>Time</th>
                <th className='border px-4 py-2'>Details</th>
                <th className='border px-4 py-2'>Assessors</th>
              </tr>
            </thead>

            <tbody>
              {isFirstDay ? (
                <tr className=' h-[60px] text-center bg-white text-[13px] font-bold'>
                  <td colSpan={3} className='w-full'>
                    <p>Welcome Session</p>
                    <p>
                      {" "}
                      {moment(breakProp?.[0]?.wlc_sess_st).format(
                        "hh:mm A",
                      )} -{" "}
                      {moment(breakProp?.[0]?.wlc_sess_en).format("hh:mm A")}
                    </p>
                  </td>
                </tr>
              ) : null}
              {item?.map((event: any, idx: number) => {
                const isLunch = event?.title === "LUNCH BREAK";
                return (
                  <tr
                    key={idx}
                    className={
                      isLunch
                        ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                        : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                    }
                  >
                    <td className='border px-4 py-2'>
                      {event?.start && event?.end
                        ? `${moment(event?.start).format("hh:mm A")} - ${moment(event?.end).format("hh:mm A")}`
                        : "All Day"}
                    </td>
                    <td className='border px-4 py-2'>
                      {isLunch ? (
                        "LUNCH BREAK"
                      ) : (
                        <>
                          <p>Assessment: {event?.title || "-"}</p>
                          <p>Room: {event?.room || "-"}</p>
                        </>
                      )}
                    </td>
                    <td className='border px-4 py-2'>
                      {event?.assessors
                        ?.map((a: any) => a?.assessor_name)
                        .join(" || ") || "-"}
                    </td>
                  </tr>
                );
              })}
              {isLastDay ? (
                <tr className=' h-[60px] text-center bg-white text-[13px] font-bold'>
                  <td colSpan={5} className='w-full'>
                    <p>Concluding Session</p>
                    <p>
                      {" "}
                      {/* {formatedEndForGP
                        ? getClosureTime(
                            `${formatedEndForGP}-${formatedEndForGP}`,
                            WelcomeSessDuration,
                          )
                        : "-"} */}
                      {moment(breakProp?.[0]?.ending_sess_st).format("hh:mm A")}{" "}
                      -{" "}
                      {moment(breakProp?.[0]?.ending_sess_en).format("hh:mm A")}
                    </p>
                  </td>
                </tr>
              ) : null}
            </tbody>
            {/* {type === "GROUP" && (
              <tbody>
                {item?.flatMap((event: any, idx: number) =>
                  event?.gr_act_part?.map((item: any, subIdx: number) => {
                    const isLunch = item?.title === "LUNCH BREAK";
                    return (
                      <tr
                        key={`${idx}-${subIdx}`}
                        className={
                          isLunch
                            ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                            : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                        }
                      >
                        <td className='border px-4 py-2'>{`${moment(event?.start_time).format("hh:mm A")} - ${moment(event?.end_time).format("hh:mm A")}`}</td>

                        <td className='border px-4 py-2'>
                          {isLunch ? (
                            "LUNCH BREAK"
                          ) : (
                            <>
                              <p>Assessment: {item?.title || "-"}</p>
                              <p>Room: {event?.room || "-"}</p>
                            </>
                          )}
                        </td>
                        <td className='border px-4 py-2'>
                          {event?.assessor?.assessor_name || "-"}
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            )} */}
          </table>
        </div>
      )}

      {view === "ASSESSOR" && (
        <div className='overflow-x-auto !h-full p-4'>
          <table className='table-auto w-full border border-gray-300'>
            <thead className='bg-[#EFF4FF] text-left h-[60px] text-sm font-normal'>
              <tr>
                <th className='border px-4 py-2'>Assessment</th>
                <th className='border px-4 py-2'>Time</th>
                <th className='border px-4 py-2'>Details</th>
                <th className='border px-4 py-2'>Room</th>
                <th className='border px-4 py-2'>Participant</th>
              </tr>
            </thead>

            {/* <tbody>
              {item?.map((s: any) => {
                if (s?.type === "COMMON" || s?.type === "QUESIONNAIRE") {
                  return s?.part_assessment?.map((event: any, idx: number) => {
                    const isLunch = event?.title === "LUNCH BREAK";

                    return (
                      <tr
                        key={idx}
                        className={
                          isLunch
                            ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                            : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                        }
                      >
                        {idx === 0 && (
                          <td
                            className='border px-4 py-2 '
                            rowSpan={s?.part_assessment?.length}
                          >
                            {`${s?.assessment?.assessment_name} - ${
                              s?.quesionnaire_name
                                ? s?.quesionnaire_name
                                : s?.scenerio_name
                            }`}
                          </td>
                        )}
                        <td className='border px-4 py-2'>
                          {event?.start_time && event?.end_time
                            ? `${moment(event?.start_time).format("hh:mm A")} - ${moment(event?.end_time).format("hh:mm A")}`
                            : "All Day"}
                        </td>

                        <td className='border px-4 py-2'>
                          {isLunch ? (
                            "LUNCH BREAK"
                          ) : (
                            <>
                              <p>
                                Client Name:{" "}
                                {event?.class?.client?.client_name || "-"}
                              </p>
                            </>
                          )}
                        </td>
                        <td className='border px-4 py-2'>
                          {event?.room?.room || "-"}
                        </td>
                        <td className='border px-4 py-2'>
                          {event?.participant?.participant_name || "-"}
                        </td>
                      </tr>
                    );
                  });
                } else if (s?.type === "GROUP") {
                  return (
                    <>
                      {(() => {
                        const rows =
                          s?.gr_act_rooms?.flatMap((event: any) =>
                            event?.gr_act_part?.map((e: any) => ({
                              event,
                              e,
                            })),
                          ) || [];

                        return rows.map(
                          (
                            { event, e }: { event: any; e: any },
                            rowIndex: number,
                          ) => {
                            const isLunch = e?.title === "LUNCH BREAK";

                            return (
                              <tr
                                key={rowIndex}
                                className={
                                  isLunch
                                    ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                                    : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                                }
                              >
                                {rowIndex === 0 && (
                                  <td
                                    className='border px-4 py-2'
                                    rowSpan={rows?.length}
                                  >
                                    {`${s?.assessment?.assessment_name} - ${
                                      s?.quesionnaire_name
                                        ? s?.quesionnaire_name
                                        : s?.scenerio_name
                                    }`}
                                  </td>
                                )}

                                <td className='border px-4 py-2'>
                                  {event?.start_time && event?.end_time
                                    ? `${moment(event?.start_time).format("hh:mm A")} - ${moment(
                                        event?.end_time,
                                      ).format("hh:mm A")}`
                                    : "All Day"}
                                </td>

                                <td className='border px-4 py-2'>
                                  {e?.participants?.participant_name || "-"}
                                </td>

                                <td className='border px-4 py-2'>
                                  {event?.room?.room || "-"}
                                </td>

                                <td className='border px-4 py-2'>
                                  {isLunch ? (
                                    "LUNCH BREAK"
                                  ) : (
                                    <p>
                                      Assessor:{" "}
                                      {event?.assessor?.assessor_name || "-"}
                                    </p>
                                  )}
                                </td>
                              </tr>
                            );
                          },
                        );
                      })()}
                    </>
                  );
                }
              })}
            </tbody> */}

            {/* {type === "GROUP" && (
              <tbody>
                {item?.gr_act_rooms?.flatMap((event: any, idx: number) =>
                  event?.gr_act_part?.map((item: any, subIdx: number) => {
                    const isLunch = item?.title === "LUNCH BREAK";

                    return (
                      <tr
                        key={`${idx}-${subIdx}`}
                        className={
                          isLunch
                            ? "bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]"
                            : "bg-[#FAFAFA] text-[#71717A] text-[13px]"
                        }
                      >
                        <td className='border px-4 py-2'>{`${moment(event?.start_time).format("hh:mm A")} - ${moment(event?.end_time).format("hh:mm A")}`}</td>

                        <td className='border px-4 py-2'>
                          {isLunch ? (
                            "LUNCH BREAK"
                          ) : (
                            <>
                              <p>
                                Assessment: {event?.assessment?.assessment_name}
                              </p>
                              <p>Room: {event?.room?.room || "-"}</p>
                            </>
                          )}
                        </td>
                        <td className='border px-4 py-2'>
                          {item?.participants?.participant_name || "-"}
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            )} */}

            <tbody>
              {isFirstDay ? (
                <tr className=' h-[60px] text-center bg-white text-[13px] font-bold'>
                  <td colSpan={5} className='w-full'>
                    <p>Welcome Session</p>
                    <p>
                      {/* {getWelcomeTime(
                        moment(merged[0]?.start_time).format("hh:mm A") +
                          "-" +
                          moment(merged[0]?.end_time).format("hh:mm A"),
                        WelcomeSessDuration,
                      )} */}
                      {moment(breakProp?.[0]?.wlc_sess_st).format("hh:mm A")} -{" "}
                      {moment(breakProp?.[0]?.wlc_sess_en).format("hh:mm A")}
                    </p>
                  </td>
                </tr>
              ) : null}
              {merged.map((row, idx) => {
                if (row.isBreak) {
                  return (
                    <tr
                      key={idx}
                      className='bg-[#FFD08A] h-[72px] text-center text-[#71717A] text-[13px]'
                    >
                      <td className='border px-4 py-2'>{row.title}</td>
                      <td className='border px-4 py-2'>
                        {moment(row.start_time).format("hh:mm A")} -{" "}
                        {moment(row.end_time).format("hh:mm A")}
                      </td>
                      <td className='border px-4 py-2'>-</td>
                      <td className='border px-4 py-2'>-</td>
                      <td className='border px-4 py-2'>-</td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={idx}
                    className='bg-[#FAFAFA] text-[#71717A] text-[13px]'
                  >
                    <td className='border px-4 py-2'>
                      {`${row.s?.assessment?.assessment_name} - ${
                        row.s?.quesionnaire_name ?? row.s?.scenerio_name
                      }`}
                    </td>
                    <td className='border px-4 py-2'>
                      {row.start_time && row.end_time
                        ? `${moment(row.start_time).format("hh:mm A")} - ${moment(row.end_time).format("hh:mm A")}`
                        : "All Day"}
                    </td>
                    <td className='border px-4 py-2'>
                      Client: {row.p?.class?.client?.client_name ?? "-"}
                    </td>
                    <td className='border px-4 py-2'>
                      {row.p?.room?.room ?? "-"}
                    </td>
                    <td className='border px-4 py-2'>
                      {row.p?.participant?.participant_name ?? "-"}
                    </td>
                  </tr>
                );
              })}
              {isLastDay ? (
                <tr className=' h-[60px] text-center bg-white text-[13px] font-bold'>
                  <td colSpan={5} className='w-full'>
                    <p>Concluding Session</p>
                    {/* <p>5.00 - 5.30</p> */}
                    <p>
                      {/* {formattedEnd
                        ? getClosureTime(
                            `${formattedEnd}-${formattedEnd}`,
                            WelcomeSessDuration,
                          )
                        : "-"} */}
                      {moment(breakProp?.[0]?.ending_sess_st).format("hh:mm A")}{" "}
                      -{" "}
                      {moment(breakProp?.[0]?.ending_sess_en).format("hh:mm A")}
                    </p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ) : (
    <>
      {showLoadder ? (
        <CustomLoader />
      ) : (
        <NoData message='No schdule for selected date !' />
      )}
    </>
  );
};

export default CommonScheduleTable;
