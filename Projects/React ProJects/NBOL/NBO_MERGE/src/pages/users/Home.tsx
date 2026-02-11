import { IoArrowForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import { useQuery } from "../../hooks/useQuerry";
import { CustomHeading } from "../components/custom/Heading";
export function Home() {
  const navigate = useNavigate();
  function HandleChanger() {
    navigate("/Section1", { state: QuestionerId });
  }
  // ------------Bullets Data-------------------
  const Bullets = [
    {
      index: "1",
      label: "Stable internet connection required",
    },
    {
      index: "2",
      label: "Use a desktop or laptop (mobile not recommended)",
    },
    {
      index: "3",
      label: "Ensure microphone access if audio recording is enabled",
    },
    {
      index: "4",
      label: "Close unnecessary applications to prevent interruptions",
    },
    {
      index: "5",
      label: "Complete the assessment in one sitting when possible",
    },
    {
      index: "6",
      label: "Answer all questions honestly and completely",
    },
    {
      index: "7",
      label: "Do not seek external assistance or use reference materials",
    },
    {
      index: "8",
      label: "Maintain professional conduct throughout",
    },
    {
      index: "9",
      label: "Your responses are confidential and secure",
    },
    {
      index: "10",
      label: "Data is processed in accordance with privacy policies",
    },
    {
      index: "11",
      label: "Results are only accessible to authorized personnel",
    },
    {
      index: "12",
      label: "Do not share assessment content with others",
    },
  ];
  //------------CompetencyCards Data Fetching-------------------
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data: Competency, isPending } = useQuery<unknown>({
    queryKey: [
      `/competency/participant-dashboard/${user?.participant_id}/${user?.client_id}`,
    ],

    select: (Competency: any) => Competency?.data?.data,
    enabled: !!user?.participant_id,
  });
  if (Competency) console.log(Competency, "CompetencyCards>>>>>>>>>>>>>>>");

  // ---QuestionerID data fetching-----------------
  const { data: QuestionerId } = useQuery<any>({
    queryKey: [
      `/cbi/participant-assessment/${user?.participant_id}/${user?.client_id}/${user?.["participants.cohort_id"]}`,
    ],
    select: (QuestionerId: any) => QuestionerId?.data?.data,
    enabled: !!user?.participant_id,
  });
  console.log(QuestionerId, "QuestionerId>>>>>>>>>>>>>>>");

  //------------Loading State------------------
  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <BiLoaderAlt className="animate-spin rounded-full h-16 w-16" />
      </div>
    );
  // ---------------------------------
  return (
    <div>
      <section>
        {/* -------------------------Heading and Button----------------- */}
        <CustomHeading
          heading="Welcome to the Competency Based Interview Portal"
          description="Assess your professional skills across key competencies"
        />

        {/* -------------------------Hero Section---------------- */}

        <div className="flex flex-col items-center p-8">
          <img src="icons/Container.png" />
          <h1 className="text-[#2F6DD1] text-4xl font-bold leading-11">
            Competency-Based Interview Portal
          </h1>
          <p className="text-base font-normal leading-6 text-[#181D27]">
            Assess your professional skills across six key competencies with
            AI-powered questions and personalized feedback
          </p>
        </div>
        {/* -------------------------Blocks---------------- */}
        <div className="grid grid-cols-3 gap-6 px-8">
          {Array.isArray(Competency) &&
            Competency.map((item, index) => (
              <Boxes
                key={index}
                number={index + 1}
                label={item.competency}
                paragraph={item.description}
              />
            ))}
        </div>
        {/* -------------------Bullet Section--------------- */}
        <div className="px-8 py-10 ">
          {/* ------  Container Heading------------ */}
          <div className="border-2 border-[#BEDBFF] bg-[#EFF6FF] p-6 rounded-lg">
            <h1 className="text-[#1447E6] text-base font-normal leading-6">
              Rules & Regulations
            </h1>
            <p className="text-[#155DFC] text-sm font-normal leading-5">
              Please read carefully before starting your assessment
            </p>
            {/* ------------Bullet Icons-------------- */}
            <div className="my-10">
              {Bullets.map((items, index) => (
                <BulletPoints key={index} label={items.label} />
              ))}
            </div>
            {/* -------------Container Footer----------- */}
            <footer className="border-t border-[#BEDBFF]">
              <p className="text-[#364153] text-sm font-normal leading-5 text-center py-4">
                By proceeding, you acknowledge that you have read and agree to
                abide by these rules and regulations.
              </p>
              <button
                onClick={HandleChanger}
                className="text-base font-semibold leading-6 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 m-auto hover:bg-[#75a5ee] transition-all"
              >
                Start Assessment <IoArrowForwardOutline />
              </button>
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Boxes = ({
  number,
  label,
  paragraph,
}: {
  number: number;
  label: string;
  paragraph: string;
}) => {
  return (
    <>
      <div className="border border-[#0000001A] w-full bg-white p-5 rounded-xl">
        <div className="flex justify-center items-center gap-2 mb-3">
          <span className="rounded-full bg-[#D8E7FC80] text-base font-normal leading-6 px-3 py-1 text-[#3B7FE6] ">
            {number}
          </span>
          <h1 className="font-normal text-lg leading-7 text-[#0A0A0A]">
            {label}
          </h1>
        </div>

        <p className="text-[#717182] leading-5 text-base font-normal">
          {paragraph}
        </p>
      </div>
    </>
  );
};

export const BulletPoints = ({ label }: { label: string }) => {
  return (
    <>
      <div>
        <ul className="flex gap-2 items-center mb-2.5">
          <img src="icons/Bullet-Icon.png" className="h-4 w-4" />
          <li className="font-normal text-sm leading-5 text-[#364153] ">
            {label}
          </li>
        </ul>
      </div>
    </>
  );
};
