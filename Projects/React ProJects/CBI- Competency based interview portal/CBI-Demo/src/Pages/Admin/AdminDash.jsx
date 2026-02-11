import { Bell } from "lucide-react";
import { Cards } from "../../components/custom/Cards";
import { DataTableDemo } from "../../components/custom/DataTableDemo";
import { IoStar } from "react-icons/io5";
import { ParticipantCount } from "@/components/custom/UIElements";

export function AdminDash() {
  const CardDetails = [
    { index: "1", label: "Total Participants", count: "2,000", per: "100" },
    { index: "2", label: "Total Participants", count: "2,000", per: "100" },
    { index: "3", label: "Total Participants", count: "2,000", per: "100" },
    { index: "4", label: "Total Participants", count: "2,000", per: "100" },
  ];
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
  const columns = [
    { key: "name", label: "Name" },
    { key: "employeeId", label: "Employee ID" },
    { key: "email", label: "Email address" },
    { key: "status", label: "Status" },
    { key: "score", label: "Score" },
    { key: "date", label: "Date of Completion" },
    { key: "report", label: "" },
  ];

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
            }`}
          >
            <IoStar />
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <header className="flex justify-between items-center p-8">
        <div>
          <h1 className="text-[#181D27] font-semibold text-3xl leading-9.5">
            Admin Dashboard
          </h1>
          <p className="font-normal text-base text-[#535862] leading-6">
            Manage interviews, participants, competencies, and leadership levels
          </p>
        </div>
        <button className="font-semibold text-sm text-[#414651] bg-white border-2 border-[#D5D7DA] py-2 px-4 rounded-lg flex gap-1 items-center justify-center hover:bg-[#fafafade] transition cursor-pointer">
          <Bell className="h-4 w-4" />
          Notifications
        </button>
      </header>

      <hr className="border-t-2 border-[#cfd2d4] w-full" />

      <div className="grid grid-cols-4 gap-8 p-6">
        {CardDetails.map((item, index) => (
          <Cards
            key={index}
            label={item.label}
            count={item.count}
            per={item.per}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow m-6">
        <ParticipantCount label="Participants" count={participants.length} />

        <DataTableDemo
          data={participants}
          getStatusBadge={getStatusBadge}
          renderStars={renderStars}
          columns={columns}
          count={participants.length}
        />
      </div>
    </>
  );
}
