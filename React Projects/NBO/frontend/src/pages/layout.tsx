import { AppSidebar } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlinePresentationChartBar } from "react-icons/hi2";
import { IoDocumentTextOutline, IoSettingsOutline } from "react-icons/io5";
import { PiChalkboardTeacher, PiExamLight } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  // const isMobile = useIsMobile();

  // if (location.pathname === "/login") {
  //   return <>{children}</>;
  // }

  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;
  const [cookies] = useCookies(["current_role"]);
  const currentRole = cookies.current_role || user?.role;
  if (!users_obj) {
    return <Navigate to='/login' replace />;
  }

  // const adminMenu = [
  //   {
  //     title: "Client",
  //     url: "clients-config",
  //     icon: "/icons/Load-balancer--vpc.svg",
  //     id: 0,
  //   },
  //   {
  //     title: "Facility",
  //     url: "facilities-config",
  //     icon: "/icons/Group--presentation.svg",
  //     id: 1,
  //   },
  //   {
  //     title: "Leadership Levels",
  //     url: "leadership-levels-config",
  //     icon: "/icons/Id-management.svg",
  //     id: 2,
  //   },
  //   {
  //     title: "Participant",
  //     url: "participants-config",
  //     icon: "/icons/Events.svg",
  //     id: 3,
  //   },

  //   {
  //     title: "Competency",
  //     url: "competencies-config",
  //     icon: "/icons/Report--data.svg",
  //     id: 4,
  //   },
  //   {
  //     title: "Assessment Configurations",
  //     url: "assessment-config",
  //     icon: "/icons/Scalpel--select.svg",
  //     id: 5,
  //   },
  //   {
  //     title: "Assessors",
  //     url: "assessors-config",
  //     icon: "/icons/Chart--stepper.svg",
  //     id: 6,
  //   },
  //   {
  //     title: "CLASS Configuration",
  //     url: "class-configuration-config",
  //     icon: "/icons/Cognitive.svg",
  //     id: 7,
  //   },
  //   {
  //     title: "Assessments",
  //     url: "assessments",
  //     icon: "/icons/Scalpel--select.svg",
  //     id: 8,
  //   },
  //   {
  //     title: "Schedules",
  //     url: "schedules",
  //     icon: "/icons/Calendar.svg",
  //     id: 9,
  //   },
  //   {
  //     title: "Users",
  //     url: "users",
  //     icon: "/icons/Events.svg",
  //     id: 9,
  //   },
  //   {
  //     title: "Coaching Session",
  //     url: "coaching-session",
  //     icon: "/icons/User--identification.svg",
  //     id: 9,
  //   },
  //   {
  //     title: "Reports",
  //     url: "reports",
  //     icon: "/icons/Report.svg",
  //     id: 10,
  //   },
  // ];

  const adminMenu = [
    {
      title: "Client Configuration",
      url: "client configuration",
      icon: <RiAdminLine className='!size-6' />,
      id: 100,
      children: [
        {
          title: "Clients",
          url: "client-configuration",
          // icon: "/icons/Load-balancer--vpc.svg",
          id: 0,
        },

        {
          title: "Projects",
          url: "project-configuration",
          icon: "/icons/Id-management.svg",
          id: 1,
        },
        {
          title: "Facilities",
          url: "facilities-configuration",
          icon: "/icons/Group--presentation.svg",
          id: 2,
        },
        {
          title: "Participants",
          url: "participant-configuration",
          icon: "/icons/Events.svg",
          id: 3,
        },
        {
          title: "Competencies",
          url: "competencies-configuration",
          icon: "/icons/Report--data.svg",
          id: 4,
        },
      ],
    },
    // {
    //   title: "NBO Configuration",
    //   url: "nbo configuration",
    //   icon: "/icons/Id-management.svg",
    //   id: 101,
    //   children: [
    //     {
    //       title: "Competency",
    //       url: "competencies-configuration",
    //       icon: "/icons/Report--data.svg",
    //       id: 5,
    //     },
    //     {
    //       title: "Assessors",
    //       url: "assessors-configuration",
    //       icon: "/icons/Chart--stepper.svg",
    //       id: 6,
    //     },
    //   ],
    // },
    {
      title: "TADC Configurations",
      url: "class management",
      icon: <HiOutlinePresentationChartBar className='!size-6' />,
      id: 101,
      children: [
        {
          title: "Assessors",
          url: "assessors",
          icon: "/icons/Chart--stepper.svg",
          id: 5,
        },
        {
          title: "Activities",
          url: "activities",
          icon: "/icons/Scalpel--select.svg",
          id: 6,
        },
        {
          title: "Activity Weightage",
          url: "activity-weightages",
          icon: "/icons/weightage-config.svg",
          id: 7,
        },
        {
          title: "Generate Schedule",
          url: "generate-schedule",
          icon: "/icons/Cognitive.svg",
          id: 8,
        },
        {
          title: "Draft Schedules",
          url: "draft-schedule",
          icon: "/icons/Cognitive.svg",
          id: 9,
        },
        {
          title: "Activity Calendar",
          url: "activity-calendar",
          icon: "/icons/Calendar.svg",
          id: 10,
        },
      ],
    },
    {
      title: "Reports",
      url: "reports",
      icon: <IoDocumentTextOutline className='!size-6' />,
      id: 102,
      // children: [
      //   {
      //     title: "Reports",
      //     url: "reports",
      //     icon: "/icons/Report.svg",
      //     id: 11,
      //   },
      // ],
    },

    // {
    //   title: "Feedback Session",
    //   url: "coaching-session",
    //   icon: <MdOutlineDocumentScanner className='!size-6' />,
    //   id: 12,
    // },
    {
      title: "Settings",
      url: "settings",
      icon: <IoSettingsOutline className='!size-6' />,
      id: 103,
      children: [
        {
          title: "Leadership Levels",
          url: "leadership-levels-configuration",
          icon: "/icons/Id-management.svg",
          id: 13,
        },
        {
          title: "Nbol Competencies",
          url: "nbol-competencies",
          icon: "/icons/Events.svg",
          id: 14,
        },
        {
          title: "Users",
          url: "users",
          icon: "/icons/Events.svg",
          id: 15,
        },
      ],
    },

    {
      title: "CBI Dashboard",
      url: "cbi",
      icon: <PiChalkboardTeacher className='!size-6' />,
      id: 103,
    },
    // {
    //   title: "Participant",
    //   url: "cbi/participant",
    //   icon: <TbReportAnalytics className='!size-6' />,
    //   id: 104,
    // },
    // {
    //   title: "Competency",
    //   url: "cbi/competency",
    //   icon: <TbReportAnalytics className='!size-6' />,
    //   id: 105,
    // },

    // {
    //   title: "Report",
    //   url: "cbi/report",
    //   icon: <TbReportAnalytics className='!size-6' />,
    //   id: 107,
    // },
  ];

  const participantMenu = [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: <TbReportAnalytics className='!size-6' />,
      id: 0,
    },
    {
      title: "Assessments",
      url: "assessments",
      icon: <PiExamLight className='!size-6' />,
      id: 1,
    },

    {
      title: "Activity Calendar",
      url: "activity-calendar",
      icon: <FaRegCalendarAlt className='!size-6' />,
      id: 2,
    },
    {
      title: "Reports",
      url: "reports",
      icon: <IoDocumentTextOutline className='!size-6' />,
      id: 3,
    },
    // {
    //   title: "Overview",
    //   url: "cbi/cbi-assessment",
    //   icon: <TbReportAnalytics className='!size-6' />,
    //   id: 106,
    // },
    // {
    //   title: "Feedback Session",
    //   url: "coaching-session",
    //   icon: <MdOutlineDocumentScanner className='!size-6' />,
    //   id: 4,
    // },
  ];
  const assessorMenu = [
    {
      title: "Assessments",
      url: "assessments",
      icon: <PiExamLight className='!size-6' />,
      id: 0,
    },
    {
      title: "Activity Calendar",
      url: "activity-calendar",
      icon: <FaRegCalendarAlt className='!size-6' />,
      id: 1,
    },

    {
      title: "Reports",
      url: "reports",
      icon: <IoDocumentTextOutline className='!size-6' />,
      id: 2,
    },
    // {
    //   title: "Feedback Session",
    //   url: "coaching-session",
    //   icon: <MdOutlineDocumentScanner className='!size-6' />,
    //   id: 3,
    // },
  ];

  // let menu: any[] = [];
  // if (user?.role === "admin") {
  //   menu = adminMenu;
  // } else if (user?.role === "participant") {
  //   menu = participantMenu;
  // } else if (user?.role === "assessor") {
  //   menu = assessorMenu;
  // }
  let menu: any[] = [];
  if (currentRole === "admin") {
    menu = adminMenu;
  } else if (currentRole === "participant") {
    menu = participantMenu;
  } else if (currentRole === "assessor") {
    menu = assessorMenu;
  }

  // eslint-disable-next-line
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // eslint-disable-next-line
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line
  const location = useLocation();
  // eslint-disable-next-line
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (open: boolean) => setIsSidebarOpen(open);

  // console.log(location, "<---- loc");
  console.log(
    location?.pathname?.startsWith("/cbi"),
    "<location?.pathname?.startsWith",
  );
  return (
    // <div className='flex flex-col'>
    //   {/* <AppBar /> */}
    //   <SidebarProvider>
    //     <AppSidebar items={menu} />
    //  {/* <BreadcrumbBar /> */}
    //     <main
    //       className={`flex-1 py-6 px-7 fixed ${
    //         isMobile ? "w-full" : "w-[calc(100vw_-_374px)] left-[374px]"
    //       } mt-[72px] h-[calc(100vh_-_132px)] overflow-auto`}
    //     >
    //       <Outlet />
    //     </main>
    //   </SidebarProvider>
    // </div>

    <div className='flex flex-col'>
      {/* <BreadcrumbBar
        className={` ${
          isMobile
            ? "w-full left-0"
            : isSidebarOpen
              ? "w-[calc(100vw_-_374px)] left-[374px]"
              : "w-[calc(100vw_-_80px)] left-[80px]"
        }`}
      /> */}
      {/* <AppBar isSidebarOpen={isSidebarOpen} /> */}
      <SidebarProvider>
        <AppSidebar items={menu} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 py-6 px-7 fixed ${location?.pathname?.startsWith("/cbi") ? "mt-[70px] h-[calc(100vh_-_130px)]" : "mt-[130px] h-[calc(100vh_-_190px)]"}   overflow-auto transition-all duration-300 ${
            isMobile
              ? "w-full left-0"
              : isSidebarOpen
                ? "w-[calc(100vw_-_350px)] left-[350px]"
                : "w-[calc(100vw_-_80px)] left-[80px]"
          }`}
        >
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
