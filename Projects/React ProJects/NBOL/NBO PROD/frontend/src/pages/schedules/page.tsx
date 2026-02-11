import AppBar from "@/components/app-bar";
import { CustomLoader } from "@/components/custom-loader";
import ScheduleCalendar from "@/components/schedules-calender";
import { useQuery } from "@/hooks/useQuerry";
import { useCookies } from "react-cookie";

const SchedulesPage = () => {
  const user = JSON.parse(localStorage.getItem("users_obj") || "{}");
  const [cookies] = useCookies(["current_role"]);
  const currentRole = cookies.current_role;
  const { data: AllEventData } = useQuery<any>({
    queryKey: [
      user?.role === "admin" && user?.assessor_id && currentRole === "assessor"
        ? `/class/assessor-classess-schedule/${user?.assessor_id}`
        : user?.role === "admin"
          ? `/class/all-class-schedule`
          : user?.role === "assessor"
            ? `/class/assessor-classess-schedule/${user?.assessor_id}`
            : user?.role === "participant"
              ? `/class/class-details-participant/${user?.client_id}/${user?.participant_id}`
              : "/class/all-class-schedule",
    ],
    select: (data: any) => data?.data?.data,
    enabled: true,
  });

  return (
    <div>
      {/* <PageHeading>Schedules</PageHeading> */}
      <AppBar
        title='Activity Calendar'
        subTitle='View all scheduled classes and activities in the calendar'
      />
      {/* <ScheduleCalendar events={AllEventData} /> */}
      {AllEventData ? (
        <ScheduleCalendar events={AllEventData} />
      ) : (
        <CustomLoader />
      )}
    </div>
  );
};

export default SchedulesPage;
