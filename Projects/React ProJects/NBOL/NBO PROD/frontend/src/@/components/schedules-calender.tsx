import { useQuery } from "@/hooks/useQuerry";
import moment from "moment";
import CustomCalendarEvent from "pages/schedules/components/custom-event-month";
import {
  DayNavProvider,
  useDayNav,
} from "pages/schedules/components/dayNavContext";
import ScheduleDetailsDialog from "pages/schedules/components/details-dialoag";
import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  ToolbarProps,
  View,
  ViewProps,
  ViewStatic,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import CustomButton from "./button";
import CommonScheduleTable from "./common-schdule-table";

const localizer = momentLocalizer(moment);

interface CustomViewComponent extends React.FC<ViewProps> {
  title: (date: Date, options: { localizer?: any }) => string;
  range: (date: Date) => Date[];
  navigate: (date: Date, action: "PREV" | "NEXT" | "TODAY") => Date;
}

const users_obj = localStorage.getItem("users_obj");
const user = users_obj ? JSON.parse(users_obj) : null;
const CustomDayTableView: CustomViewComponent = (props: any) => {
  const { events } = props;
  const { isPrevDisabled, isNextDisabled } = useDayNav();
  console.log("day view flags", { isPrevDisabled, isNextDisabled });

  console.log(props, ",----------- props");
  const data: any[] = [];
  events.forEach((element: any) => {
    if (element?.classConfigAssm) {
      element?.classConfigAssm?.map((i: any) => {
        if (i?.assessment?.assessment_name !== "Business Case") {
          data.push({ ...i, type: "COMMON" });
        } else {
          data.push({ ...i, type: "BUSINESS" });
        }
      });
    }
    if (element?.classConfigGrp) {
      element?.classConfigGrp?.map((i: any) =>
        data?.push({ ...i, type: "GROUP" }),
      );
    }
    if (element?.classConfigQuess) {
      element?.classConfigQuess?.map((i: any) =>
        data.push({ ...i, type: "QUESIONNAIRE" }),
      );
    }
  });

  console.log(events, "<--------------- events");
  if (user?.role === "admin") {
    return (
      <>
        <CommonScheduleTable
          key={`assm`}
          item={data}
          view='ADMIN'
          break={events?.[0]?.breaks}
          WelcomeSessDuration={
            events?.[0]?.welcome_sess_duration
              ? events?.[0]?.welcome_sess_duration
              : 15
          }
          isFirstDay={isPrevDisabled}
          isLastDay={isNextDisabled}
        />
      </>
    );
  } else if (user?.role === "participant") {
    return (
      <>
        {/* <CommonScheduleTable
          key={`assm`}
          item={events}
          view='PARTICIPANT'
          break={events?.breaks}
          WelcomeSessDuration={
            events?.[0]?.welcome_sess_duration
              ? events?.[0]?.welcome_sess_duration
              : 15
          }
          isFirstDay={isPrevDisabled}
          isLastDay={isNextDisabled}
        /> */}
        <CommonScheduleTable
          key={`assm`}
          item={events?.slice(0, -1)}
          view='PARTICIPANT'
          break={[events?.[events.length - 1]]}
          WelcomeSessDuration={
            events?.[0]?.welcome_sess_duration
              ? events?.[0]?.welcome_sess_duration
              : 15
          }
          isFirstDay={isPrevDisabled}
          isLastDay={isNextDisabled}
        />
      </>
    );
  } else if (user?.role === "assessor") {
    return (
      <>
        <CommonScheduleTable
          key={`assm`}
          item={data}
          view='ASSESSOR'
          break={events?.[0]?.breaks}
          WelcomeSessDuration={
            events?.[0]?.welcome_sess_duration
              ? events?.[0]?.welcome_sess_duration
              : 15
          }
          isFirstDay={isPrevDisabled}
          isLastDay={isNextDisabled}
        />
      </>
    );
  }
};

CustomDayTableView.title = (date, { localizer }) =>
  `Day View - ${localizer.format(date, "MMMM DD, YYYY")}`;

CustomDayTableView.range = (date: Date) => [date];

CustomDayTableView.navigate = (
  date: Date,
  action: "PREV" | "NEXT" | "TODAY",
) => {
  switch (action) {
    case "PREV":
      return moment(date).subtract(1, "day").toDate();
    case "NEXT":
      return moment(date).add(1, "day").toDate();
    default:
      return new Date();
  }
};

type CustomToolbarProps = ToolbarProps & {
  classDate: { start: Date; end: Date };
  currentView: string;
  setDayViewNavigationState: any;
};
const CustomToolbar = ({
  label,
  onNavigate,
  view,
  onView,
  classDate,
  currentView,
  setDayViewNavigationState,
}: CustomToolbarProps) => {
  console.log(label, "<-------------- label");
  const { setNavState } = useDayNav();
  // const viewToMomentUnit: Record<View, moment.unitOfTime.StartOf> = {
  //   month: "month",
  //   week: "week",
  //   work_week: "week",
  //   day: "day",
  //   agenda: "day",
  // };
  const viewToStartUnit: Record<View, moment.unitOfTime.StartOf> = {
    month: "month",
    week: "week",
    work_week: "week",
    day: "day",
    agenda: "day",
  };

  const viewToDurationUnit: Record<
    View,
    moment.unitOfTime.DurationConstructor
  > = {
    month: "months",
    week: "weeks",
    work_week: "weeks",
    day: "days",
    agenda: "days",
  };
  const isPrevDisabled = moment(label)
    .startOf(viewToStartUnit[view])
    .subtract(1, viewToDurationUnit[view])
    .isBefore(moment(classDate?.start), viewToStartUnit[view]);

  const isNextDisabled = moment(label)
    .endOf(viewToStartUnit[view])
    .add(1, viewToDurationUnit[view])
    .isAfter(moment(classDate?.end), viewToStartUnit[view]);

  useEffect(() => {
    setNavState((prev) => ({
      ...prev,
      isPrevDisabled,
      isNextDisabled,
    }));
  }, [isPrevDisabled, isNextDisabled, setNavState]);

  return (
    <div className='flex items-center  gap-6 !pt-[16px]  !pb-[30px]'>
      <div className='flex items-center border !rounded-[5px] !w-[237px] !h-[44px]'>
        <CustomButton
          className='px-3 py-1 !rounded-[5px] !rounded-tr-none !rounded-br-none border-0 !bg-white !shadow-none !w-[40px] !h-[42px] hover:bg-gray-200'
          onClick={() => onNavigate("PREV")}
          variant='outline'
          disabled={isPrevDisabled && currentView === "day"}
        >
          <FaArrowLeft className='text-[#5F6D7E]' />
        </CustomButton>
        <span className='text-sm font-medium flex justify-center rounded-md items-center border-l bg-white border-r  !w-[157px] !h-[42px]'>
          {view === "month" ? (
            <>
              {moment(label).format("MMM DD")} –{" "}
              {moment(label)
                .endOf(viewToDurationUnit[view] || "month")
                .format("DD, YYYY")}
            </>
          ) : view === "week" ? (
            <>{label}</>
          ) : (
            moment(label).format("DD MMM YYYY")
          )}
        </span>
        <CustomButton
          className='px-3 py-1 !rounded-[5px] border-0 !bg-white !w-[40px] !rounded-tl-none !rounded-bl-none !shadow-none !h-[42px] hover:bg-gray-200'
          onClick={() => onNavigate("NEXT")}
          variant='outline'
          disabled={isNextDisabled && currentView === "day"}
        >
          <FaArrowRight className='text-[#5F6D7E]' />
        </CustomButton>
      </div>

      {/* <CustomSelect
        getOptionLabel={(item) => item?.title}
        getOptionValue={(item) => item?.value}
        value={selectedView ? { label: viewObj[view], value: view } : null}
        options={viewOptions}
        onChange={(item) => {
          onView(item?.value as View);
        }}
      /> */}

      <div className='flex gap-5'>
        <CustomButton
          className={`px-3 py-1 !rounded-[8px]   !w-[100px] !shadow-none !h-[42px]  `}
          onClick={() => onView("month" as View)}
          variant={view === "month" ? "default" : "outline"}
        >
          Month
        </CustomButton>{" "}
        <CustomButton
          className='px-3 py-1 !rounded-[8px]   !w-[100px] !shadow-none !h-[42px] '
          onClick={() => onView("week" as View)}
          variant={view === "week" ? "default" : "outline"}
        >
          Week
        </CustomButton>
      </div>
    </div>
  );
};

const ScheduleCalendar = ({
  events,
  initialView = "month",
}: {
  events: any;
  initialView?: View;
}) => {
  console.log(events, "<----------------- eventseventsevents");
  const [dayViewNavigationState, setDayViewNavigationState] = useState({
    isPrevDisabled: false,
    isNextDisabled: false,
  });

  const [eventsData, setEventsData] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formatedCurrentDate, setFormatedCurrentDate] = useState<any>();
  const [currentView, setCurrentView] = useState<View>(initialView);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsDialogData, setDetailsDialogData] = useState<any>();
  const [classDate, setClassDate] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });

  const { data: DayViewData, refetch } = useQuery<any>({
    queryKey: [
      `/class/class-details/${selectedCohort}?date=${formatedCurrentDate}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: false,
  });

  const { data: assessorDayViewData, refetch: assessorDayViewDataRefetch } =
    useQuery<any>({
      queryKey: [
        `/class/assessor-schedule/${selectedCohort}/${user?.assessor_id}?date=${formatedCurrentDate}`,
      ],
      select: (data: any) => data?.data?.data,
      enabled: false,
    });

  console.log(assessorDayViewData, "<---- assessorDayViewData");

  const { data: PdfData, refetch: PdfDatarefetch } = useQuery<any>({
    queryKey: [`/class/class-details/${selectedCohort}`],
    select: (data: any) => data?.data?.data,
    enabled: false,
  });

  useEffect(() => {
    if (PdfData) getPDF(PdfData);
  }, [PdfData]);

  useEffect(() => {
    console.log(events, "<---- events");
    let transformedEvents: any[] = [];
    if (currentView === "day") {
      user?.role === "admin"
        ? (transformedEvents = [DayViewData])
        : user?.role === "assessor"
          ? (transformedEvents = [assessorDayViewData])
          : (transformedEvents = events?.classes?.flatMap((event: any) => {
              // return
              // event?.grp_act_rooms
              //   ? event?.grp_act_rooms?.map((e: any) => ({
              //       id: e.class_id,
              //       title: e.assessment?.assessment_name || "No Title",
              //       start: e?.start_time,
              //       end: e.end_time,
              //       client_name: DayViewData?.client_name,
              //       room: e?.room?.room,
              //       cohort_name: e.client?.cohort_name,
              //       participant: e?.participant?.participant_name,
              //       assessors: e?.assessors,
              //       duration: e?.duration,
              //     }))
              //   : event?.participant_assessments?.map((cls: any) => ({
              //       id: cls.client_id,
              //       title: cls.assessment?.assessment_name || "No Title",
              //       start: cls?.start_time,
              //       end: cls.end_time,
              //       client_name: DayViewData?.client_name,
              //       room: cls?.room?.room,
              //       cohort_name: cls.client?.cohort_name,
              //       participant: cls?.participant?.participant_name,
              //       assessors: cls?.assessors,
              //       duration: cls?.duration,
              //     }));

              const participants =
                event?.participant_assessments?.map((cls: any) => ({
                  id: cls.client_id,
                  title: cls.assessment?.assessment_name || "No Title",
                  start: cls?.start_time,
                  end: cls.end_time,
                  client_name: DayViewData?.client_name,
                  room: cls?.room?.room,
                  cohort_name: cls.client?.cohort_name,
                  participant: cls?.participant?.participant_name,
                  assessors: cls?.assessors,
                  duration: cls?.duration,
                })) || [];

              const rooms =
                event?.grp_act_rooms?.map((e: any) => ({
                  id: e.class_id,
                  title: e.assessment?.assessment_name || "No Title",
                  start: e?.start_time,
                  end: e.end_time,
                  client_name: DayViewData?.client_name,
                  room: e?.room?.room,
                  cohort_name: e.client?.cohort_name,
                  participant: e?.participant?.participant_name,
                  assessors: [e?.assessor],
                  duration: e?.duration,
                })) || [];

              return [...participants, ...rooms, ...events?.breaks];
            }));
    } else {
      user?.role === "admin" || user?.role === "assessor"
        ? (transformedEvents = (events || [])?.map(
            (event: any, index: number) => ({
              id: event.client_id,
              title: event.client?.client_name + index || "No Title",
              start: new Date(event.start_date),
              end: new Date(event.end_date),
              project_name:
                user?.role === "admin"
                  ? event.client?.projects?.[0]?.project_name
                  : user?.role === "assessor"
                    ? event.cohort?.project?.project_name
                    : "",
              client_name:
                user?.role === "admin"
                  ? event.client?.client_name
                  : user?.role === "assessor"
                    ? event.cohort?.project?.client?.client_name
                    : "",
              cohort_name: event.client?.cohort_name,
              cohort_id: event?.cohort_id,
            }),
          ))
        : (transformedEvents = events?.classes?.map((item: any) => ({
            event: item,
            id: events?.id,
            client_name: events?.client_name,
            room: item?.room?.room,
            start: new Date(events?.classes?.[0]?.start_date),
            end: new Date(events?.classes?.[0]?.end_date),
          })));
    }

    setEventsData(transformedEvents);
  }, [events, DayViewData, currentView, assessorDayViewData]);

  useEffect(() => {
    if (selectedClient && currentDate) {
      const date = new Date(currentDate);
      const formatted = date.toISOString().split("T")[0];
      setFormatedCurrentDate(formatted);
    }
  }, [selectedClient, currentDate]);

  useEffect(() => {
    if (formatedCurrentDate) {
      refetch();
      if (user?.role === "assessor") {
        assessorDayViewDataRefetch();
      }
    }
  }, [formatedCurrentDate]);

  const handleNavigate = (date: Date) => setCurrentDate(date);

  const handleViewChange = (view: View) => setCurrentView(view);

  const handleScheduleDetailsDialogClose = () => {
    setOpenDetailsDialog(false);
  };

  const printRef: any = useRef("");

  const getPDFHTML = (item: any) => {
    const data: any[] = [];
    [item].forEach((element: any) => {
      if (element?.classConfigAssm) {
        element?.classConfigAssm?.map((i: any) =>
          data.push({ ...i, type: "COMMON" }),
        );
      }
      if (element?.classConfigGrp) {
        element?.classConfigGrp?.map((i: any) =>
          data?.push({ ...i, type: "GROUP" }),
        );
      }
      if (element?.classConfigQuess) {
        element?.classConfigQuess?.map((i: any) =>
          data.push({ ...i, type: "QUESIONNAIRE" }),
        );
      }
    });

    return `<div id="print-area">
  <table
    style="width:100%; border-collapse:collapse; border:1px solid #d1d5db;"
  >
    <thead
      style="background:#EFF4FF; text-align:left; height:60px; font-size:14px; font-weight:400;"
    >
      <tr>
        <th style="border:1px solid #d1d5db; padding:8px 16px;">Assessment</th>
        <th style="border:1px solid #d1d5db; padding:8px 16px;">Time</th>
        <th style="border:1px solid #d1d5db; padding:8px 16px;">Participant</th>
        <th style="border:1px solid #d1d5db; padding:8px 16px;">Room</th>
        <th style="border:1px solid #d1d5db; padding:8px 16px;">Details</th>
      </tr>
    </thead>
    <tbody>
      ${data?.map((s: any) => {
        if (s?.type === "COMMON" || s?.type === "QUESIONNAIRE") {
          return `${s?.part_assessment?.map((event: any, idx: number) => {
            const isLunch = event?.title === "LUNCH BREAK";

            return `<tr
              key=${idx}
              style="${
                isLunch
                  ? "background:#FFD08A; height:72px; text-align:center; color:#71717A; font-size:13px;"
                  : "background:#FAFAFA; color:#71717A; font-size:13px;"
              }"
            >
              ${
                idx === 0
                  ? `<td
                      style="border:1px solid #d1d5db; padding:8px 16px;"
                      rowSpan=${s.part_assessment.length}
                    >
                      ${s?.assessment?.assessment_name} - ${
                        s?.quesionnaire_name
                          ? s?.quesionnaire_name
                          : s?.scenerio_name
                      }
                    </td>`
                  : ""
              }

              <td style="border:1px solid #d1d5db; padding:8px 16px;">
                ${
                  event?.start_time && event?.end_time
                    ? `${moment(event.start_time).format("hh:mm A")} - ${moment(
                        event.end_time,
                      ).format("hh:mm A")}`
                    : "All Day"
                }
              </td>

              <td style="border:1px solid #d1d5db; padding:8px 16px;">
                ${event?.participant?.participant_name || "-"}
              </td>
              <td style="border:1px solid #d1d5db; padding:8px 16px;">
                ${event?.room?.room || "-"}
              </td>
              <td style="border:1px solid #d1d5db; padding:8px 16px;">
                ${
                  isLunch
                    ? "LUNCH BREAK"
                    : `<p>
                        Assessor:
                        ${
                          event?.assessors
                            ?.map((assessor: any) => assessor.assessor_name)
                            .join(" || ") || "-"
                        }
                      </p>`
                }
              </td>
            </tr>`;
          })}`;
        } else if (s?.type === "GROUP") {
          return `
            ${(() => {
              const rows =
                s?.gr_act_rooms?.flatMap((event: any) =>
                  event?.gr_act_part?.map((e: any) => ({ event, e })),
                ) || [];

              return rows
                .map(
                  ({ event, e }: { event: any; e: any }, rowIndex: number) => {
                    const isLunch = e?.title === "LUNCH BREAK";

                    return `<tr
                    key=${rowIndex}
                    style="${
                      isLunch
                        ? "background:#FFD08A; height:72px; text-align:center; color:#71717A; font-size:13px;"
                        : "background:#FAFAFA; color:#71717A; font-size:13px;"
                    }"
                  >
                    ${
                      rowIndex === 0
                        ? `<td
                            style="border:1px solid #d1d5db; padding:8px 16px;"
                            rowSpan=${rows.length}
                          >
                            ${s?.assessment?.assessment_name} - ${
                              s?.quesionnaire_name
                                ? s?.quesionnaire_name
                                : s?.scenerio_name
                            }
                          </td>`
                        : ""
                    }

                    ${
                      rowIndex === 0
                        ? `<td
                            style="border:1px solid #d1d5db; padding:8px 16px;"
                            rowSpan=${rows.length}
                          >
                            ${
                              event?.start_time && event?.end_time
                                ? `${moment(event.start_time).format(
                                    "hh:mm A",
                                  )} - ${moment(event.end_time).format(
                                    "hh:mm A",
                                  )}`
                                : "All Day"
                            }
                          </td>`
                        : ""
                    }

                    <td style="border:1px solid #d1d5db; padding:8px 16px;">
                      ${e?.participants?.participant_name || "-"}
                    </td>

                    <td style="border:1px solid #d1d5db; padding:8px 16px;">
                      ${event?.room?.room || "-"}
                    </td>

                    <td style="border:1px solid #d1d5db; padding:8px 16px;">
                      ${
                        isLunch
                          ? "LUNCH BREAK"
                          : `<p>
                              Assessor:
                              ${event?.assessor?.assessor_name || "-"}
                            </p>`
                      }
                    </td>
                  </tr>`;
                  },
                )
                .join("");
            })()}
          `;
        }
      })}
    </tbody>
  </table>
</div>
`.replace(/,/g, "");
  };

  const getPDF = (data: any) => {
    const printable = document.getElementById("printable");
    // console.log("prinateblellelelele", printable);
    if (printable) printable.innerHTML = getPDFHTML(data);
    // if (printable) printable.innerHTML = printRef.current.innerHTML;
    window.print();
    return false;
  };

  // console.log(classDate, "<-------------- datattatttsjgbfjhsj");
  const handleEventClick = (event: any) => {
    // console.log(event, "<_____________________ enenenenen");
    setClassDate({ start: event?.start, end: event?.end });
    setOpenDetailsDialog(false);
    setSelectedClient(event?.id);
    setSelectedCohort(event?.cohort_id);
    setCurrentDate(new Date(event.start));
    setCurrentView("day");
    setDetailsDialogData(event);
  };

  const CustomEventWrapper = ({ event }: any) => {
    return (
      <div onClick={() => handleEventClick(event)}>
        <CustomCalendarEvent event={event} />
      </div>
    );
  };

  type DayWrapperInterface = {} & React.ComponentType<any> & ViewStatic;

  return (
    <div className='h-[626px]' ref={printRef}>
      <DayNavProvider>
        {currentView === "day" && user?.role === "admin" && (
          <div className='flex absolute top-14 right-10'>
            <CustomButton
              onClick={async () => {
                if (PdfData) {
                  getPDF(PdfData);
                } else {
                  PdfDatarefetch();
                }
              }}
            >
              print
            </CustomButton>
          </div>
        )}
        <Calendar
          className=''
          selectable
          localizer={localizer}
          defaultDate={currentDate}
          date={currentDate}
          view={currentView}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          events={eventsData ? [...eventsData] : []}
          style={{ height: "100vh" }}
          onShowMore={(events) => {
            setDetailsDialogData(events);
            setOpenDetailsDialog(true);
            setCurrentView("month");
          }}
          views={{
            month: true,
            week: true,
            day: CustomDayTableView as DayWrapperInterface,
            agenda: true,
          }}
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                currentView={currentView}
                classDate={classDate}
                view={currentView}
                onView={handleViewChange}
                setDayViewNavigationState={setDayViewNavigationState}
              />
            ),
            eventWrapper: CustomEventWrapper,
          }}
        />

        {openDetailsDialog && (
          <ScheduleDetailsDialog
            open={openDetailsDialog}
            onClose={handleScheduleDetailsDialogClose}
            data={detailsDialogData}
            handleEventClick={handleEventClick}
          />
        )}
      </DayNavProvider>
    </div>
  );
};

export default ScheduleCalendar;
