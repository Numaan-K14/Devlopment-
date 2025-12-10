// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";

// export function LoginPage() {
// const {
// register,
// handleSubmit,
// formState: { errors },
// } = useForm();

// const onSubmit = (data) => console.log(data);

// return (
// <>
// <section className="w-full grid grid-cols-2 h-screen font-inter">
// {/_ LEFT SIDE SECTION _/}
// {/_ 👇 Added flex + padding to properly center & space content _/}
// <div className="flex flex-col  px-[180px] py-[235px]">
// <div className="mb-10">
// <h1 className="font-semibold text-[32px] leading-[38px] text-[#181D27] mb-2">
// Welcome back
// </h1>
// <p className="text-[#535862] text-base leading-6">
// Welcome back! Please enter your details.
// </p>
// </div>

// {/_ 👇 Added `space-y-5` to separate each form field properly _/}
// <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
// {/_ ----------- Email Field -------------- _/}
// <div>
// <label className="text-[#414651] font-medium text-base mb-1.5 leading-6 flex">
// Email
// </label>
// <input
// type="email"
// placeholder="Enter your email"
// {...register("email", { required: "This field is required" })}
// className="w-full border border-[#D5D7DA] rounded-md placeholder:text-[#717680] placeholder:text-base px-3.5 py-2.5
// focus:outline-none focus:ring-2 focus:ring-[#265BB8]" // 👈 Added focus ring styling for better UX
// />
// {errors.email && (
// <span className="text-xs text-red-600 mt-1 flex">
// {errors.email.message}
// </span>
// )}
// </div>

// {/_ ----------- Password Field ------------- _/}
// <div>
// <label className="text-[#414651] font-medium text-base mb-1.5 leading-6 flex">
// Password
// </label>
// <input
// type="password"
// placeholder="Enter your password"
// {...register("password", {
// required: "This field is required",
// })}
// className="w-full border border-[#D5D7DA] rounded-md placeholder:text-[#717680] placeholder:text-base px-3.5 py-2.5
// focus:outline-none focus:ring-2 focus:ring-[#265BB8]" // 👈 Same visual focus
// />
// {errors.password && (
// <span className="text-xs text-red-600 mt-1 flex">
// {errors.password.message}
// </span>
// )}
// </div>

// {/_ ----------- Remember + Forgot Password ------------- _/}
// <div className="flex justify-between items-center">
// <label className="flex items-center space-x-2 text-sm text-[#414651]">
// <input
// type="checkbox"
// {...register("remember")}
// className="w-4 h-4 rounded-sm accent-[#265BB8]" // 👈 Added accent color for checkbox
// />
// <span className="font-medium">Remember for 30 days</span>
// </label>

// {/_ ❌ You used <a to=""> — invalid in React Router _/}
// {/_ ✅ Fixed: use <Link to=""> instead _/}
// <a
// to="/forgot-password"
// className="text-[#1F4B9E] font-semibold text-sm leading-5 hover:underline"
// >
// Forgot password
// </a>
// </div>

// {/_ ----------- Buttons ------------- _/}
// {/_ 👇 Changed padding to width-based button for cleaner alignment _/}
// <button
// type="submit"
// className="w-full bg-[#265BB8] py-2.5 text-base font-semibold text-white leading-6 rounded-lg hover:bg-[#1f4b9e] transition-all"
// >
// Sign in
// </button>

// {/_ 👇 Improved Google button alignment & spacing _/}
// <button
// type="button"
// className="w-full border border-[#D5D7DA] py-2.5 text-base font-semibold text-[#414651] leading-6 rounded-lg
// flex justify-center items-center hover:bg-[#F9FAFB] transition-all"
// >
// <img
// src="icons/Social-icon.png"
// alt="Google icon"
// className="w-5 h-5 mr-3" // 👈 Balanced icon size
// />
// Sign in with Google
// </button>
// </form>
// </div>

// {/_ RIGHT SIDE IMAGE SECTION _/}
// {/_ ❌ You used only min-h-screen — image didn’t stretch properly _/}
// {/_ ✅ Fixed with w-full + h-full + object-cover _/}
// <div className="w-full h-full">
// <img
// src="images/Section.svg"
// alt="Section"
// className="w-full h-full object-cover"
// />
// </div>
// </section>
// </>
// );
// }

---------------------------------------OLD CODE --------------------------------------------------------------

https://prnt.sc/adFB-1cIOCIp
follow this i want to create like this and im creating but need small touch ups so please fixed it
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
export function LoginPage() {
const {
register,
handleSubmit,

    formState: { errors },

} = useForm();

const onSubmit = (data) => console.log(data);
return (
<>

<section className="w-full grid grid-cols-2 h-screen">
<div>
<h1 className="font-inter font-semibold text-3xl leading-[38px] text-[#181D27]">
Welcome back
</h1>
<p className="font-normal text-md leading-6 text-[#535862]">
Welcome back! Please enter your details.
</p>
<form onSubmit={handleSubmit(onSubmit)}>
{/_ -----------Email-------------- _/}
<div>
<label className="text-[#414651] flex font-medium text-base mb-1.5 leading-6">
Email
</label>
<input
type="email"
placeholder="Enter Your Mail "
{...register("email", { required: "This field is required" })}
className="outline outline-[#D5D7DA] rounded-md placeholder:font-normal placeholder:text-[#717680] placeholder:text-base px-3.5 py-2.5"
/>
{errors.email && (
<span className="text-xs text-red-600 flex">
{errors.email.message}
</span>
)}
</div>
{/_ -----------Password------------- _/}

            <div>
              <label className="text-[#414651] flex font-medium text-base mb-1.5 leading-6">
                Password
              </label>
              <input
                type="email"
                placeholder="Enter Your Mail "
                {...register("email", { required: "This field is required" })}
                className="outline outline-[#D5D7DA] rounded-md placeholder:font-normal placeholder:text-[#717680] placeholder:text-base px-3.5 py-2.5"
              />
              {errors.email && (
                <span className="text-xs text-red-600 flex">
                  {errors.email.message}
                </span>
              )}
            </div>
            {/* -------------------------- */}
            <div>
              <input
                type="checkbox"
                {...register("example")}
                className="w-4 h-4 rounded-sm mr-0.5"
              />
              <span className="font-inter font-medium text-sm leading-5 text-[#414651]">
                Remember for 30 days
              </span>
              <a
                to=""
                className="text-[#1F4B9E] font-semibold text-sm leading-5"
              >
                Forgot password
              </a>
            </div>
            <button className="bg-[#265BB8] px-[153px] py-2.5 text-base font-semibold text-white leading-6 rounded-lg mb-4">
              Sign in
            </button>
            <button className="border border-[#D5D7DA]  px-[87.5px] py-2.5 text-base font-semibold text-[#414651] leading-6 rounded-lg flex">
              <img src="icons/Social-icon.png" className="mr-3"/> Sign in with Google
            </button>
          </form>
        </div>
        <div className="w-full">
          <img src="Section.jpg" alt="Section" className="min-h-screen" />
        </div>
      </section>
    </>

);
}
------------Left Side Bar without styling --------------------------------------
"use client";
import { GrLinkPrevious } from "react-icons/gr";
import \* as React from "react";
import {
SidebarProvider,
Sidebar,
SidebarHeader,
SidebarContent,
SidebarFooter,
SidebarRail,
SidebarMenu,
SidebarMenuItem,
SidebarMenuButton,
SidebarGroup,
SidebarGroupLabel,
SidebarGroupContent,
useSidebar,
} from "@/components/ui/sidebar";
import { Home, User, Settings, LogOut, BarChart } from "lucide-react";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

// Helper to save sidebar state in cookie
function saveSidebarState(isOpen) {
document.cookie = `${SIDEBAR_COOKIE_NAME}=${isOpen}; path=/; max-age=${
    60 * 60 * 24 * 7
  }`;
}

export function SideMenu() {
// Helper to load sidebar state
function loadSidebarState() {
const cookie = document.cookie
.split("; ")
.find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
return cookie ? cookie.split("=")[1] === "true" : true;
}

function AppSidebar() {
const { open, setOpen } = useSidebar();

    const toggleSidebar = () => setOpen((prev) => !prev);
    // load saved state once on mount
    React.useEffect(() => {
      const saved = loadSidebarState();
      setOpen(saved);
    }, [setOpen]);

    // save sidebar state whenever it changes
    React.useEffect(() => {
      saveSidebarState(open);
    }, [open]);

    return (
      <Sidebar collapsible="icon" className="border-r bg-background">
        <SidebarHeader className="px-3 py-4 flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          <button
            onClick={toggleSidebar}
            className="flex justify-between items-center gap-2 w-full"
          >
            <img src="icons/Sidebar.png" alt="Sidebar logo" className="h-6" />
            <GrLinkPrevious className="text-xl" />
          </button>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          {/* Group: Main */}
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Dashboard" asChild>
                    <button className="flex items-center gap-2 w-full">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Profile" asChild>
                    <button className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings" asChild>
                    <button className="flex items-center gap-2 w-full">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Group: Other */}
          <SidebarGroup>
            <SidebarGroupLabel>Other</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Logout" asChild>
                    <button className="flex items-center gap-2 w-full text-red-500">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="border-t px-3 py-3 text-xs text-muted-foreground">
          <p>© 2025 MyApp</p>
        </SidebarFooter>

        {/* Sidebar Rail — enables hover expand effect */}
        <SidebarRail />
      </Sidebar>
    );

}

return (
<SidebarProvider>

<div>
<AppSidebar />
</div>
</SidebarProvider>
);
}
-----------------------------------DataTableDemo Without Sorting---------------
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { IoStar } from "react-icons/io5";

const participants = [
{
name: "Olivia Rhye",
employeeId: "EMP001",
email: "olivia@untitledui.com",
status: "Completed",
score: 4,
date: "Jan 4, 2025",
report: true,
},
{
name: "Phoenix Baker",
employeeId: "EMP001",
email: "phoenix@untitledui.com",
status: "In Progress",
score: null,
date: "-",
report: false,
},
{
name: "Lana Steiner",
employeeId: "EMP001",
email: "lana@untitledui.com",
status: "Paused",
score: null,
date: "-",
report: false,
},
{
name: "Demi Wilkinson",
employeeId: "EMP001",
email: "demi@untitledui.com",
status: "Completed",
score: 4,
date: "Jan 4, 2025",
report: true,
},
{
name: "Candice Wu",
employeeId: "EMP001",
email: "candice@untitledui.com",
status: "Completed",
score: 3,
date: "Jan 4, 2025",
report: true,
},
];

export function DataTableDemo() {
const getStatusBadge = (status) => {
if (status === "Completed") return "bg-[#ECFDF3] text-[#027A48]";
if (status === "In Progress") return "bg-[#EFF8FF] text-[#175CD3]";
if (status === "Paused") return "bg-[#FFF6ED] text-[#B54708]";
};

const renderStars = (count) => {
if (!count) return "-";
return (

<div className="flex items-center gap-1">
{[1, 2, 3, 4, 5].map((i) => (
<span
key={i}
className={`text-lg ${
              i <= count ? "text-[#FDB022]" : "text-[#D0D5DD]"
            }`} >
<IoStar />
</span>
))}
</div>
);
};

return (

<div className="bg-white  rounded-lg">
<Table className={"w-full"}>
{/_ Header _/}
<TableHeader className="bg-[#F9FAFB] border-b border-[#EAECF0] text-left ">
<TableRow>
<TableHead className="text-xs font-medium text-[#667085] py-3.25 px-6 ">
Name
</TableHead>
<TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
Empxoyee ID
</TableHead>
<TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
Email address
</TableHead>
<TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
Status
</TableHead>
<TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
Score
</TableHead>
<TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
Date of Completion
</TableHead>
<TableHead className=""></TableHead>
</TableRow>
</TableHeader>

        {/* Body */}
        <TableBody>
          {participants.map((p, i) => (
            <TableRow key={i} className=" border-b border-[#F2F4F7]">
              <TableCell className="font-medium text-[#101828] text-sm leading-5 py-3.25 px-6">
                {p.name}
              </TableCell>

              <TableCell className="text-[#535862] font-normal text-sm leading-5 py-3.25 px-6">
                {p.employeeId}
              </TableCell>

              <TableCell className=" text-sm text-[#475467] py-3.25 px-6">
                {p.email}
              </TableCell>

              <TableCell className="">
                <span
                  className={`text-xs px-2 py-[3px] rounded-full font-medium ${getStatusBadge(
                    p.status
                  )} py-3.25 `}
                >
                  {p.status}
                </span>
              </TableCell>

              <TableCell className="py-3.25 px-6">
                {renderStars(p.score)}
              </TableCell>

              <TableCell className=" text-sm text-[#475467] py-3.25 px-6">
                {p.date}
              </TableCell>

              <TableCell className="">
                {p.report ? (
                  <button className="flex items-center gap-1 text-[#344054] text-sm font-medium cursor-pointer p-3">
                    <Eye size={16} />
                    View Report
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-[#D0D5DD] text-sm font-medium cursor-not-allowed p-3">
                    <Eye size={16} />
                    View Report
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

);
}
----------------DataDemo Table With Admindash Data----------------------
// import {
// Table,
// TableBody,
// TableCell,
// // TableFooter,
// TableHead,
// TableHeader,
// TableRow,
// } from "@/components/ui/table";
// import { Eye } from "lucide-react";
// import { IoStar } from "react-icons/io5";
// // import {
// // Pagination,
// // PaginationContent,
// // PaginationEllipsis,
// // PaginationItem,
// // PaginationLink,
// // PaginationNext,
// // PaginationPrevious,
// // } from "@/components/ui/pagination";

// const participants = [
// {
// name: "Olivia Rhye",
// employeeId: "EMP001",
// email: "olivia@untitledui.com",
// status: "Completed",
// score: 4,
// date: "Jan 4, 2025",
// report: true,
// },
// {
// name: "Phoenix Baker",
// employeeId: "EMP001",
// email: "phoenix@untitledui.com",
// status: "In Progress",
// score: null,
// date: "-",
// report: false,
// },
// {
// name: "Lana Steiner",
// employeeId: "EMP001",
// email: "lana@untitledui.com",
// status: "Paused",
// score: null,
// date: "-",
// report: false,
// },
// {
// name: "Demi Wilkinson",
// employeeId: "EMP001",
// email: "demi@untitledui.com",
// status: "Completed",
// score: 4,
// date: "Jan 4, 2025",
// report: true,
// },
// {
// name: "Candice Wu",
// employeeId: "EMP001",
// email: "candice@untitledui.com",
// status: "Completed",
// score: 3,
// date: "Jan 4, 2025",
// report: true,
// },
// ];

// export function DataTableDemo() {
// const getStatusBadge = (status) => {
// if (status === "Completed") return "bg-[#ECFDF3] text-[#027A48]";
// if (status === "In Progress") return "bg-[#EFF8FF] text-[#175CD3]";
// if (status === "Paused") return "bg-[#FFF6ED] text-[#B54708]";
// };

// const renderStars = (count) => {
// if (!count) return "-";
// return (
// <div className="flex items-center gap-1">
// {[1, 2, 3, 4, 5].map((i) => (
// <span
// key={i}
// className={`text-lg ${
//               i <= count ? "text-[#FDB022]" : "text-[#D0D5DD]"
//             }`}
// >
// <IoStar />
// </span>
// ))}
// </div>
// );
// };

// return (
// <div className="bg-white  rounded-lg">
// <Table className={"w-full"}>
// {/_ Header _/}
// <TableHeader className="bg-[#F9FAFB] border-b border-[#EAECF0] text-left ">
// <TableRow>
// <TableHead className="text-xs font-medium text-[#667085] py-3.25 px-6 ">
// Name
// </TableHead>
// <TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
// Employee ID
// </TableHead>
// <TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
// Email address
// </TableHead>
// <TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
// Status
// </TableHead>
// <TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
// Score
// </TableHead>
// <TableHead className=" text-xs font-medium text-[#667085] py-3.25 px-6 ">
// Date of Completion
// </TableHead>
// <TableHead className=""></TableHead>
// </TableRow>
// </TableHeader>

// {/_ Body _/}
// <TableBody>
// {participants.map((p, i) => (
// <TableRow key={i} className=" border-b border-[#F2F4F7] hover:bg-[#F2F4F7]">
// <TableCell className="font-medium text-[#101828] text-sm leading-5 py-3.25 px-6">
// {p.name}
// </TableCell>

// <TableCell className="text-[#535862] font-normal text-sm leading-5 py-3.25 px-6">
// {p.employeeId}
// </TableCell>

// <TableCell className=" text-sm text-[#475467] py-3.25 px-6">
// {p.email}
// </TableCell>

// <TableCell className="">
// <span
// className={`text-xs px-2 py-[3px] rounded-full font-medium ${getStatusBadge(
//                     p.status
//                   )} py-3.25 `}
// >
// {p.status}
// </span>
// </TableCell>

// <TableCell className="py-3.25 px-6">
// {renderStars(p.score)}
// </TableCell>

// <TableCell className=" text-sm text-[#475467] py-3.25 px-6">
// {p.date}
// </TableCell>

// <TableCell className="">
// {p.report ? (
// <button className="flex items-center gap-1 text-[#344054] text-sm font-medium cursor-pointer p-3">
// <Eye size={16} />
// View Report
// </button>
// ) : (
// <button className="flex items-center gap-1 text-[#D0D5DD] text-sm font-medium cursor-not-allowed p-3">
// <Eye size={16} />
// View Report
// </button>
// )}
// </TableCell>
// </TableRow>
// ))}
// </TableBody>
// {/_ <TableFooter>
// <Pagination>
// <PaginationContent>
// <PaginationItem>
// <PaginationPrevious href="#" />
// </PaginationItem>
// <PaginationItem>
// <PaginationLink href="#">1</PaginationLink>
// </PaginationItem>
// <PaginationItem>
// <PaginationLink href="#" isActive>
// 2
// </PaginationLink>
// </PaginationItem>
// <PaginationItem>
// <PaginationLink href="#">3</PaginationLink>
// </PaginationItem>
// <PaginationItem>
// <PaginationEllipsis />
// </PaginationItem>
// <PaginationItem>
// <PaginationNext href="#" />
// </PaginationItem>
// </PaginationContent>
// </Pagination>
// </TableFooter> _/}
// </Table>
// </div>
// );
// }

---------------------------------Admin Dash with Static DataDemoTable----------
// import { Bell } from "lucide-react";
// import { Cards } from "../../components/custom/Cards";
// import { DataTableDemo } from "../../components/custom/DataTableDemo";
// // import { Datagrid } from "../Tables/Table";

// export function AdminDash() {
// const CardDetails = [
// {
// index: "1",
// label: "Total Participants",
// count: "2,000",
// per: "100",
// },
// {
// index: "2",
// label: "Total Participants",
// count: "2,000",
// per: "100",
// },
// {
// index: "3",
// label: "Total Participants",
// count: "2,000",
// per: "100",
// },
// {
// index: "4",
// label: "Total Participants",
// count: "2,000",
// per: "100",
// },
// ];
// return (
// <>
// {/_ ------------Header---------------- _/}
// <header className="flex justify-between items-center p-8">
// <div>
// <h1 className="text-[#181D27] font-semibold text-3xl leading-9.5 ">
// Admin Dashboard
// </h1>
// <p className="font-normal text-base text-[#535862] leading-6 ">
// Manage interviews, participants, competencies, and leadership levels
// </p>
// </div>
// <button className="font-semibold text-sm text-[#414651] bg-white border-2 border-[#D5D7DA] py-2 px-4 rounded-lg flex gap-1 items-center justify-center hover:bg-[#fafafade] transition cursor-pointer">
// <Bell className="h-4  w-4 " />
// Notifications
// </button>
// </header>
// {/_ -------------------Cards--------------- _/}
// <hr className="border-t-2 border-[#cfd2d4] w-full " />
// <div className="grid grid-cols-4 gap-8 p-6">
// {CardDetails.map((item, index) => (
// <Cards
// key={index}
// label={item.label}
// count={item.count}
// per={item.per}
// />
// ))}
// </div>
// {/_ -----------------DataGrid--------------- _/}
// <div className="bg-white rounded-lg shadow m-6 ">
// <div className="flex flex-row items-center gap-2 py-5 px-6">
// <h1 className="font-medium text-lg text-[#181D27]">Participants</h1>

// <span className="bg-[#D8E7FC] text-[#1F4B9E] rounded-xl px-2 text-xs font-medium leading-4">
// 100
// </span>
// </div>

// <DataTableDemo />
// </div>
// </>
// );
// }
---------------------------Sidedrawer raw code
// import { X } from "lucide-react";
// import { useForm } from "react-hook-form";

// export function SIdeDrawer() {
// const {
// register,
// handleSubmit,
// // formState: { errors },
// } = useForm();

// const onSubmit = (data) => console.log(data);
// return (
// <>
// <section className="w-[30%] bg-white  border shadow h-full">
// <div className="flex justify-between items-center py-4 px-6">
// <h1 className="text-[#272D37] font-bold text-lg leading-6">
// Add Competency
// </h1>
// <X strokeWidth={2.25} />
// </div>
// <hr className="border border-[#D0D0D7] w-full" />
// <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 p-7">
// <div>
// <label className="block mb-3 text-[#414651] text-sm font-medium leading-5 ">
// Competency Name
// </label>
// <input
// type="text"
// {...register("Competency_Name")}
// className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md w-full"
// />
// </div>
// <div>
// <label className="block mb-3 text-[#414651] text-sm font-medium leading-5  ">
// Description
// </label>
// <textarea
// placeholder="Enter a description..."
// {...register("description")}
// className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md placeholder:text-[#667085] placeholder:text-base placeholder:font-normal h-20 w-full"
// />
// </div>
// <div>
// <label className="block mb-3 text-[#414651] text-sm font-medium leading-5  ">
// Core Question
// </label>
// <textarea
// placeholder="What If ?"
// {...register("Core_Question")}
// className="outline outline-[#D5D7DA] px-3.5 py-2.5 rounded-md placeholder:text-[#667085] placeholder:text-base placeholder:font-normal h-20 w-full mb-32"
// />
// </div>
// <hr className="border border-[#D0D0D7] w-full" />

// <div className="py-4 flex justify-end gap-3 ">
// <button className="bg-white hover:bg-[#e8e9ec] text-[#414651] border border-[#D5D7DA] rounded-md px-8 py-2.5 focus:ring-2 focus:ring-[#e8e9ec]">
// Cancel
// </button>
// <button className="bg-[#3B7FE6] hover:bg-[#1666d6] text-white rounded-md px-8 py-2.5 focus:ring-2 focus:ring-blue-500">
// Next
// </button>
// </div>
// </form>
// </section>
// </>
// );
// }

-------------------------DataTabledemo (without styling)-----------------------------
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
// (getStatusBadge = () => null), (renderStars = () => null); Optional if present then show else null.
export function DataTableDemo({ data, getStatusBadge=()=>null, renderStars=()=>null, columns }) {
return (

<div className="bg-white rounded-lg">
<Table className="w-full">
<TableHeader className="bg-[#F9FAFB] border-b border-[#EAECF0] text-left">
<TableRow>
{columns.map((col, index) => (
<TableHead key={index} className={col.className}>
{col.label}
</TableHead>
))}
</TableRow>
</TableHeader>

        <TableBody>
          {data.map((p, i) => (
            <TableRow
              key={i}
              className="border-b border-[#F2F4F7] hover:bg-[#F2F4F7]"
            >
              <TableCell className="font-medium text-[#101828] text-sm leading-5 py-3.25 px-6">
                {p.name}
              </TableCell>

              <TableCell className="text-[#535862] font-normal text-sm leading-5 py-3.25 px-6">
                {p.employeeId}
              </TableCell>

              <TableCell className="text-sm text-[#475467] py-3.25 px-6">
                {p.email}
              </TableCell>

              <TableCell>
                <span
                  className={`text-xs px-2 py-[3px] rounded-full font-medium ${getStatusBadge(
                    p.status
                  )} py-3.25`}
                >
                  {p.status}
                </span>
              </TableCell>

              <TableCell className="py-3.25 px-6">
                {renderStars(p.score)}
              </TableCell>

              <TableCell className="text-sm text-[#475467] py-3.25 px-6">
                {p.date}
              </TableCell>

              <TableCell>
                {p.report ? (
                  <button className="flex items-center gap-1 text-[#344054] text-sm font-medium cursor-pointer p-3">
                    <Eye size={16} />
                    View Report
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-[#D0D5DD] text-sm font-medium cursor-not-allowed p-3">
                    <Eye size={16} />
                    View Report
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

);
}
----------------------------DataDemo Table Without Pagination---------------------
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

export function DataTableDemo({
data,
columns,
getStatusBadge = () => null,
renderStars = () => null,
}) {
return (

<div className="bg-white rounded-lg">
<div className="max-h-[400px] overflow-y-auto">
<Table className="w-full ">
<TableHeader className="bg-[#F9FAFB] border-b border-[#EAECF0] text-left">
<TableRow>
{columns.map((col, index) => (
<TableHead
                  key={index}
                  className="text-xs font-medium text-[#667085] py-3.25 px-6"
                >
{col.label}
</TableHead>
))}
</TableRow>
</TableHeader>

          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b border-[#F2F4F7] hover:bg-[#F2F4F7]"
              >
                {columns.map((col, colIndex) => {
                  const value = row[col.key];
                  if (col.key === "status") {
                    return (
                      <TableCell key={colIndex}>
                        <span
                          className={`text-xs px-2 py-[3px] rounded-full font-medium ${getStatusBadge(
                            value
                          )}`}
                        >
                          {value}
                        </span>
                      </TableCell>
                    );
                  }

                  if (col.key === "score") {
                    return (
                      <TableCell key={colIndex} className="py-3.25 px-6">
                        {renderStars(value)}
                      </TableCell>
                    );
                  }

                  if (col.key === "report") {
                    return (
                      <TableCell key={colIndex}>
                        {value ? (
                          <button className="flex items-center gap-1 text-[#344054] text-sm font-medium cursor-pointer p-3">
                            <Eye size={16} />
                            View Report
                          </button>
                        ) : (
                          <button className="flex items-center gap-1 text-[#D0D5DD] text-sm font-medium cursor-not-allowed p-3">
                            <Eye size={16} />
                            View Report
                          </button>
                        )}
                      </TableCell>
                    );
                  }

                  if (col.key === "name") {
                    return (
                      <TableCell
                        key={colIndex}
                        className="font-medium text-[#101828] text-sm leading-5 py-3.25 px-6"
                      >
                        {value}
                      </TableCell>
                    );
                  }

                  //else
                  return (
                    <TableCell
                      key={colIndex}
                      className="text-sm text-[#475467] py-3.25 px-6 max-w-[150px] truncate overflow-hidden whitespace-nowrap"
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

);
}
--------------------Fully Functionally Side Menu code -----------------
SideMenu.jsx

"use client";
// import { GrLinkPrevious } from "react-icons/gr";
import \* as React from "react";
import {
SidebarProvider,
Sidebar,
SidebarHeader,
SidebarContent,
// SidebarFooter,
SidebarRail,
SidebarMenu,
SidebarMenuItem,
SidebarMenuButton,
SidebarGroup,
SidebarGroupLabel,
SidebarGroupContent,
useSidebar,
} from "@/components/ui/sidebar";
// import { User, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
// import { LogOut, User } from "lucide-react";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

// Helper to save sidebar state in cookie
function saveSidebarState(isOpen) {
document.cookie = `${SIDEBAR_COOKIE_NAME}=${isOpen}; path=/; max-age=${
    60 * 60 * 24 * 7
  }`;
}

export function SideMenu({
sidemenuIcon1,
sidemenuIcon2,
sidemenuIcon3,
sidemenuIcon4,
sidemenuName1,
sidemenuName2,
sidemenuName3,
sidemenuName4,
}) {
const location = useLocation();
const isOverview = location.pathname === "/";
const Participant = location.pathname === "/Participants";
const Competency = location.pathname === "/Competency";
const Leadership = location.pathname === "/Leadership";

// Helper to load sidebar state
function loadSidebarState() {
const cookie = document.cookie
.split("; ")
.find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
return cookie ? cookie.split("=")[1] === "true" : true;
}

function AppSidebar() {
const { open, setOpen } = useSidebar();

    // const toggleSidebar = () => setOpen((prev) => !prev);
    // load saved state once on mount
    React.useEffect(() => {
      const saved = loadSidebarState();
      setOpen(saved);
    }, [setOpen]);

    // save sidebar state whenever it changes
    React.useEffect(() => {
      saveSidebarState(open);
    }, [open]);

    return (
      <Sidebar collapsible="icon">
        <SidebarHeader
          className={`flex items-center gap-2 ${
            open ? "pt-6 pb-9 px-3" : "py-6 px-1"
          } `}
        >
          {/* <div className="flex justify-center"> */}
          <img
            src="icons/Heading.png"
            alt="Sidebar logo"
            className={`transition-all duration-300 ${
              open ? "h-20 w-60 m-auto" : " h-3 w-full"
            }`}
          />
          {/* {open && (
              <button
                onClick={toggleSidebar}
                className="bg-[#8E9FC133] p-2 rounded-lg shadow-xs shadow-[#0A0D120D] transition-opacity duration-300"
              >
                <GrLinkPrevious className="text-xl text-white" />
              </button>
            )} */}
          {/* </div> */}
        </SidebarHeader>
        <div className="flex items-center gap-1 w-full px-3 ">
          {/* User Profile */}
          <img
            src="icons/Avatar.png"
            alt="User Avatar"
            className={`rounded-full transition-all duration-300 ${
              open ? "h-10 w-10 mx-2 " : "h-6 w-6 mx-0.9"
            }`}
          />

          {/* User Info — hidden when sidebar is collapsed */}
          {open && (
            <div className="flex flex-col">
              <span className="text-[#FDFDFD] font-semibold text-base leading-6">
                Olivia Rhye
              </span>
              <p className="text-[#F5F5F5] font-normal text-base leading-6 ">
                Admin
              </p>
            </div>
          )}
        </div>
        {/* Sidebar Content */}
        <SidebarContent>
          {/* Group: Main */}
          <SidebarGroup>
            <hr className="border-t border-white my-3" />
            <SidebarGroupLabel
              className={`text-white  font-medium text-base leading-5`}
            >
              Main Menu
            </SidebarGroupLabel>
            {/* -----SidebarGroupContent----- */}
            <SidebarGroupContent>
              <SidebarMenu>
                {/* ----SidebarMenu-1--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      isOverview
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/">
                      <img
                        src={`/icons/${sidemenuIcon1}`}
                        alt={sidemenuName1}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName1}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* ----SidebarMenu-2--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      Participant
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/Participants">
                      <img
                        src={`/icons/${sidemenuIcon2}`}
                        alt={sidemenuName2}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName2}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* ----SidebarMenu-3--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      Competency
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/Competency">
                      <img
                        src={`/icons/${sidemenuIcon3}`}
                        alt={sidemenuName3}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName3}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* ----SidebarMenu-4--- */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`text-white ${
                      Leadership
                        ? "bg-[#ffffff6b] hover:bg-[#ffffff93]"
                        : "hover:bg-[#ffffff26]"
                    }`}
                  >
                    <Link to="/Leadership">
                      <img
                        src={`/icons/${sidemenuIcon4}`}
                        alt={sidemenuName4}
                        className={`${open ? "h-6 w-6" : "h-4 w-4"} `}
                      />
                      <span className="font-medium text-base leading-6 text-white">
                        {sidemenuName4}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
            {/* --------------------------------------- */}
          </SidebarGroup>

          {/* Group: Other */}
          {/* <SidebarGroup>
            <SidebarGroupLabel>Other</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Logout" asChild>
                    <button className="flex items-center gap-2 w-full text-red-500">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
        </SidebarContent>

        {/* Sidebar Rail — enables hover expand effect */}
        <SidebarRail />
      </Sidebar>
    );

}

return (
<SidebarProvider>

<div>
<AppSidebar />
</div>
</SidebarProvider>
);
}

{
/_ <img src="icons/Overview.png" className="h-7 w-7 items-center" />; _/
}

// const sidebarRef = React.useRef(null);
// Outside click to close
// function handleClickOutside(e) {
// if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
// setOpen(false);
// }
// }
// document.addEventListener("mousedown", handleClickOutside);

      //  return () => {
      //    document.removeEventListener("mousedown", handleClickOutside);
      //  };
      ------------------------------------

data: {
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjI1ODI1LTE3MTgtNGQ2NC1iYzE2LTRjYmUxZDIxY2IxYyIsImVtYWlsIjoicGVkcmlAbWFpbC5jb20iLCJyb2xlIjoicGFydGljaXBhbnQiLCJpYXQiOjE3NjQyMzc2MDksImV4cCI6MTc2NDMyNDAwOX0.nNK04XAWss_KBr7LkjLD3RC6d537KaJ6aFdFaT9C9uI",

user: {
id: "66625825-1718-4d64-bc16-4cbe1d21cb1c",
name: "Pedri",
email: "pedri@mail.com",
role: "participant",
phone_number: null,
assessor_id: null,
client_id: "bdf76f41-2126-4e01-bff2-4329dc1bd064",
participant_id: "9fc71158-3085-4971-839b-eb13cf6dea7a",
"participants.cohort_id": "79f5b3ae-69cb-46a5-87cb-fe114e8da78c",
createdAt: "2025-11-25T08:01:57.673Z",
updatedAt: "2025-11-25T08:01:57.673Z"
},

status: 201,
success: true
}
