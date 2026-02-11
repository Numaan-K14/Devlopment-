import { useQuery } from "@/hooks/useQuerry";
import moment from "moment";
import { useParams, useSearchParams } from "react-router-dom";
import CustomBarChart from "./components/BarChart";

const ReportUI = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const onlyView = searchParams.get("onlyView");

  const { data: SingleReportData } = useQuery<any>({
    queryKey: [`/report/participant-details/${id}`],
    select: (data: any) => data?.data?.data,
    enabled: !!id,
  });

  const clean = (s: string) => s.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

  const report = SingleReportData?.participant?.class_part_report;
  const devCompArray = (report?.dev_comp || "")
    .split(",")
    .map((item: any) => clean(item));

  const strCompArray = (report?.str_comp || "")
    .split(",")
    .map((item: any) => clean(item));

  const avgComps = report?.par_avg_comp || [];

  const developmentScores = avgComps
    .filter((item: any) =>
      devCompArray.includes(clean(item?.competency?.competency)),
    )
    .map((item: any, index: number) => ({
      id: item.id,
      comp_id: item.comp_id,
      category: `C${index + 1}`,
      categoryFullName: item.competency.competency.trim(),
      value: item.average_score,
    }));
  const strengthScores = avgComps
    .filter((item: any) =>
      strCompArray.includes(clean(item?.competency?.competency)),
    )
    .map((item: any, index: number) => ({
      id: item.id,
      comp_id: item.comp_id,
      category: `C${index + 1}`,
      categoryFullName: item.competency.competency.trim(),
      value: item.average_score,
    }));

  const scores = [3, 3, 2.5, 3.5, 2, 3];
  const competency = "Business Acumen and Financial Stewardship";

  const content = [
    { title: "Executive Summary of NBO CLASS", pageNo: 1 },
    { title: "Group Report", pageNo: 2 },
    { title: "Individual Score", pageNo: 3 },
    { title: "Individual Executive Summary", pageNo: 4 },
    { title: "Competencies and their Definition", pageNo: 5 },
    { title: "Participant’s Score", pageNo: 6 },
    { title: "Competency based Evaluation", pageNo: 7 },
    { title: "Conclusion and Recommendation", pageNo: 8 },
  ];

  const barChartDataOfStrengths = [
    { category: "Respect", value: 0.2 },
    { category: "Adaptability", value: 0.22 },
    { category: "Strategic Awareness", value: 0.25 },
    { category: "Growth", value: 0.2 },
  ];
  const barChartDataOfAreaOfDevelopment = [
    { category: "Team Collaboration", value: 1.6 },
    { category: "Develop Others", value: 1.4 },
    { category: "Accountability", value: 1.3 },
    { category: "Lead", value: 1.4 },
  ];
  // const barChartDataOfCompetencyBasedEvaluation =
  //   SingleReportData?.participant?.class_part_report?.par_avg_comp?.map(
  //     (item: any, index: number) => {
  //       return {
  //         category: item?.competency?.competency,
  //         value: item?.average_score,
  //       };
  //     },
  //   );
  const rawData =
    SingleReportData?.participant?.class_part_report?.par_avg_comp;
  const shortLabelMap: Record<string, string> = {};
  const barChartDataOfCompetencyBasedEvaluation = rawData?.map(
    (item: any, index: number) => {
      const fullName = item?.competency?.competency;
      const shortKey = `C${index + 1}`;
      shortLabelMap[shortKey] = fullName;
      return {
        category: shortKey,
        value: item?.average_score,
      };
    },
  );
  const data = [
    {
      rank: 1,
      participant: "James",
      scores: [4, 4, 4, 4, 4, 4, 4],
      overall: 4,
    },
    {
      rank: 2,
      participant: "Abdu",
      scores: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5],
      overall: 3.5,
    },
    {
      rank: 3,
      participant: "Reaz",
      scores: [3, 3, 3, 3, 3, 3, 3],
      overall: 3,
    },
    {
      rank: 4,
      participant: "Anas",
      scores: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
      overall: 2.5,
    },
    {
      rank: 5,
      participant: "Faisal",
      scores: [2, 2, 2, 2, 2, 2, 2],
      overall: 2,
    },
  ];

  // let SankeyChartNode: { id: any }[] = [];
  // let SankeyChartLinks: { source: any; target: any; value: any }[] = [];
  // const SankeyChartData =
  //   SingleReportData?.participant?.class_part_report?.par_avg_comp?.map(
  //     (item: any, index: number) => {
  //       SankeyChartNode.push({
  //         id: "C" + index,
  //       });
  //       SankeyChartLinks.push({
  //         source: "C" + index,
  //         target: SingleReportData?.over_all_score,
  //         value: item?.average_score,
  //       });
  //     },
  //   );

  // let SankeyChartDataFinal = {
  //   nodes: [
  //     {
  //       id: SingleReportData?.over_all_score,
  //     },
  //     ...SankeyChartNode,
  //   ],
  //   links: SankeyChartLinks,
  // };

  const headers = [
    "Strategic Vision",
    "Business Acumen",
    "Business Acumen",
    "Business Acumen",
    "Business Acumen",
    "Business Acumen",
    "Strategic Vision",
  ];

  const ParticipantScoreData =
    SingleReportData?.participant?.class_part_report?.par_avg_comp?.map(
      (item: any, index: number) => ({
        score: item?.average_score,
        shortName: "C" + (index + 1),
        competency: item?.competency?.competency,
        strength: item?.strength,
        area_for_dev: item?.area_for_dev,
      }),
    ) || [];
  // data={[
  //                   { language: "Competency 1", john: 12 },
  //                   { language: "Competency 2", john: 25 },
  //                   { language: "Competency 3", john: 5 },
  //                   { language: "Competency 4", john: 19 },
  //                   { language: "Competency 5", john: 29 },
  //                   { language: "Competency 6", john: 9 },
  //                 ]}
  //                 indexBy='language'
  //                 keys={["john"]}

  const radarData = ParticipantScoreData.map((item: any, index: number) => ({
    competency: "C" + (index + 1),
    score: item?.score,
  }));

  const assessments = [
    {
      assessment: "Think on Your Feet",
      defination:
        "An activity where participants are required to respond to unexpected questions or scenarios, testing their ability to think quickly, communicate clearly, and align responses with organizational objectives.",
    },
    {
      assessment: "Role Play",
      defination:
        "A simulated activity where participants act out specific scenarios (e.g., managing a team or resolving conflicts) to demonstrate their leadership, communication, and problem-solving skills.",
    },
    {
      assessment: "Business Case",
      defination:
        "A presentation or analysis of a real or hypothetical business scenario, requiring participants to demonstrate strategic thinking, financial acumen, and problem-solving abilities.",
    },
    {
      assessment: "Leadership Questionnaire",
      defination:
        "A written assessment where participants answer questions related to leadership competencies, providing insights into their leadership style, decision-making, and self-awareness.",
    },
    {
      assessment: "Group Activity",
      defination:
        "A collaborative exercise where participants work in teams to solve problems, make decisions, or complete tasks, demonstrating their ability to work effectively with others and influence group outcomes",
    },
  ];

  const compentencys =
    SingleReportData?.participant?.class_part_report?.par_avg_comp?.map(
      (item: any) => ({
        competencies: item?.competency?.competency,
        description: item?.competency?.description,
      }),
    ) || [];
  // const compentencys = [
  //   {
  //     competencies: "Strategic Vision and Insight",
  //     defination:
  //       "Anticipate industry shifts, aligning organisational goals with long-term trends, and inspiring a culture of strategic thinking.",
  //   },
  //   {
  //     competencies: "Business Acumen and Financial Stewardship",
  //     defination:
  //       "Balanced financial stewardship with strategic decision-making, resource efficiency, and ethical business practices.",
  //   },
  //   {
  //     competencies: "Innovation and Transformation Leadership",
  //     defination:
  //       "Champion innovation, foster adaptability, and lead transformation initiatives to align with organisational goals.",
  //   },
  //   {
  //     competencies: "Inspirational Leadership and Decision-Making",
  //     defination:
  //       "Inspire confidence, model resilience, and make impactful decisions to guide teams effectively.",
  //   },
  //   {
  //     competencies: "Collaborative Influence and Stakeholder Engagement",
  //     defination:
  //       "Build trust with stakeholders, influence outcomes, and foster cross-functional collaboration.",
  //   },
  //   {
  //     competencies: "Talent Development and Inclusion",
  //     defination:
  //       "Nurture talent, promote diversity, and create a high-performing, inclusive organisational culture.",
  //   },
  // ];
  const scoreStanding = [
    {
      score: 1,
      rating: "Poor",
      description:
        "Performance falls significantly below expectations. Significant improvement needed.",
    },
    {
      score: 2,
      rating: "Below Average",
      description:
        "Performance is below the expected level. Notable gaps in understanding or execution.",
    },
    {
      score: 3,
      rating: "Competent",
      description:
        "Performance meets the expected level. Adequate but with room for improvement.",
    },
    {
      score: 4,
      rating: "Good",
      description:
        "Performance exceeds expectations. Strong understanding and execution.",
    },
    {
      score: 5,
      rating: "Excellent",
      description:
        "Performance significantly surpasses expectations. Exceptional execution and creativity.",
    },
  ];
  return (
    <>
      {/* <div className='my-10'>
        <div className='flex flex-col gap-10 items-center justify-center'>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col justify-center items-center'>
              <img
                src='./nboleadershiplogo.png'
                className='h-[104px] !w-[339px]'
              ></img>
              <div className='border-t mt-[23px] border-[#006B00] w-[297px] py-[23px] text-center text-[#49556D] text-[28px] font-medium'>
                NBOL CLASS
              </div>
              <div className='!w-[297px] !mx-[23px] flex flex-col gap-[6px]'>
                <div className='!text-start flex gap-2 text-[13px] text-[#242424]'>
                  <span className='!text-[#242424] !w-[113px]  font-medium'>
                    Participant Name:
                  </span>{" "}
                  <span>group 1</span>
                </div>
                <div className='!text-start flex gap-2 text-[13px] text-[#242424]'>
                  <span className=' !w-[113px]  font-medium'>
                    Company Name:
                  </span>{" "}
                  <span>Apsis Consultancy</span>
                </div>
                <div className='!text-start flex gap-2 text-[13px] text-[#242424]'>
                  <span className='!text-[#242424] !w-[113px]  font-medium'>
                    Report By:
                  </span>{" "}
                  <span>Reaz</span>
                </div>
                <div className='!text-start flex gap-2 text-[13px] text-[#242424]'>
                  <span className='!text-[#242424] !w-[113px]  font-medium'>
                    Date:
                  </span>{" "}
                  <span>20/02/2025</span>
                </div>
              </div>
              <div className='border border-[#FF2600] p-1 w-[515px] text-[#FF2600] text-[10px] absolute bottom-6 text-center'>
                All rights reserved. This is a confidential and proprietary
                information of NBO group.
                <br /> Duplication in any form is strictly prohibited without
                written consent from NBO group.
              </div>
            </div>
          </div>
          <div className='!w-[595px]  !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col p-5'>
              <img
                src='./icons/rectangle.svg'
                className='rotate-180 absolute top-0 left-0'
              ></img>
              <img
                src='./icons/rectangle.svg'
                className='-rotate-90 absolute top-0 right-0'
              ></img>
              <img
                src='./icons/rectangle.svg'
                className='rotate-90 bottom-0 left-0 absolute'
              ></img>
              <img
                src='./icons/rectangle.svg'
                className='absolute bottom-0 right-0'
              ></img>
              <div className='bg-[#F5F9FF] mb-5 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                content page
              </div>
              <div>
                {content?.map(
                  (item: { title: string; pageNo: number }, index: number) => {
                    return (
                      <div
                        className={`flex gap-1 text-[10px] text-[#404040] ${content?.length - 1 !== index ? "border-b border-[#CBCBCB]" : ""}  py-3`}
                      >
                        <div className='text-[#404040]'>{index + 1}</div>
                        <div className='flex w-full !justify-between text-[#404040]'>
                          <div>{item?.title}</div>
                          <div>{item?.pageNo}</div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2  flex p-5 '>
            <div className='w-full relative border flex flex-col  p-5'>
              <div className='bg-[#F5F9FF] mb-5 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Summary of NbOL Class
              </div>
              <div className='bg-[rgba(239,239,241,0.45)] text-[10px] p-3 tracking-widest text-[#404040]'>
                The NBOL CLASS is designed to assess leadership potential and
                competency development through interactive learning experiences.
                Participants engage in a series of structured activities,
                including Think on Your Feet, Role Plays, Case Study Analysis,
                Competency-Based Questionnaires, and Group Activities. These
                assessments measure various Competencies, such as Strategic
                Vision and Insight, Business Acumen and Financial Stewardship,
                Innovation and Transformation Leadership, Inspirational
                Leadership and Decision-Making, Collaborative Influence and
                Stakeholder Engagement and Talent Development and Inclusion. The
                goal of the NBOL class is to provide insights into strengths and
                areas for development, equipping participants with actionable
                strategies for leadership growth.
              </div>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] mt-10 text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Group Summary table
              </div>
              <div>
                <div className='w-[521px]  '>
                  <div className='!w-[521px] rounded-lg '>
                    <table className='min-w-full   text-sm text-center'>
                      <thead>
                        <tr className=' text-gray-700'>
                          <th className=' border-b !w-[57px] text-[#171717] !font-normal text-start p-2 !h-[32px] text-[7px] leading-[8px] '>
                            Rank
                          </th>
                          <th className='!w-[57px] text-start text-[#171717] !font-normal !h-[32px] leading-[8px] p-2 text-[7px] border-b'>
                            Participant
                          </th>
                          {headers.map((h, idx) => (
                            <th
                              key={idx}
                              className='p-2 text-start text-[#171717] !w-[57px] !font-normal text-[7px] !h-[32px] leading-[8px] border-b'
                            >
                              {h}
                            </th>
                          ))}
                          <th className='p-2 border-b !w-[57px] text-[#171717] text-start text-[7px] !h-[32px] !font-normal leading-[8px] '>
                            Overall Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, i) => (
                          <tr key={i} className='hover:bg-gray-50 !h-[32px]'>
                            <td className='p-2 border-b text-start !w-[57px] !h-[32px] text-[7px] '>
                              {row.rank}
                            </td>
                            <td className='p-2 text-start !w-[57px] !h-[32px] text-[7px] border-b'>
                              {row.participant}
                            </td>
                            {row.scores.map((score, j) => (
                              <td
                                key={j}
                                className='p-2 text-start !w-[57px] !h-[32px] text-[7px] border-b'
                              >
                                {score}
                              </td>
                            ))}
                            <td className='p-2 border-b !w-[57px] !h-[32px] text-start text-[7px]  '>
                              {row.overall}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Participant 1: James’ score
              </div>
              <div className='flex flex-col gap-5'>
                <div className=' text-[10px] bg-[rgba(239,239,241,0.45)] text-[#404040] p-3 rounded-[3px]'>
                  The participant received an overall score of 2.8 out of 5,
                  indicating that while they demonstrate competency in key
                  areas, there is room for improvement. Below is a summary of
                  their strengths and areas for development:
                </div>
                <div className='!h-[406px] !w-[521px] p-4  rounded-[4px]'>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm text-left  !rounded-[3px]'>
                      <thead>
                        <tr className=' !h-[41px] bg-[#F5F9FF]'>
                          <th className='px-3 font-medium  !h-[41px] text-[7.87px] border-b'>
                            Competency
                          </th>
                          <th className='px-3 font-medium text-[7.87px] border-b '>
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score, idx) => (
                          <tr key={idx} className={"!h-[41px]"}>
                            <td className='px-3 border-b text-[7.87px] text-[#525252] border-gray-100'>
                              {competency}
                            </td>
                            <td className='px-3 border-b text-[7.87px] text-[#525252] border-gray-100 '>
                              {score}
                            </td>
                          </tr>
                        ))}
                        <tr className='border-b border-gray-100 font-semibold'>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            Overall Score
                          </td>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            2.8
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Executive Summary of Participant: James
              </div>
              <div className='text-[10px] text-[#404040] pb-7'>
                The participant received an overall score of 2.8 out of 5,
                indicating that while they demonstrate competency in key areas,
                there is room for improvement. Below is a summary of their
                strengths and areas for development:
              </div>
              <div className='flex flex-col w-full gap-5'>
                <div className='bg-[#0069FF0D] border border-[#0069FF] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Strengths
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Strong ability to build relationships and partnerships.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Demonstrates structured planning and task execution.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Encourages communication and team engagement
                    </li>
                  </ol>
                </div>
                <div className='bg-[#FFF9F0] border border-[#F08F00] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold !border-b-[0.3px] border-[#F08F00]'>
                    Areas for development
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term
                      planning.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence..
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term planning
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                  </ol>
                </div>
                <div className='bg-[#E2FFE24D] border border-[#2B952B] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Recommendations
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Attend a leadership communication program to enhance
                      speaking clarity
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Engage in critical thinking and innovation exercises.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Participate in stakeholder engagement and negotiation
                      training.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Participant 2: Abdu’s score
              </div>
              <div className='flex flex-col gap-5'>
                <div className='border-t text-[10px] text-[#404040] py-3'>
                  The participant received an overall score of 2.8 out of 5,
                  indicating that while they demonstrate competency in key
                  areas, there is room for improvement. Below is a summary of
                  their strengths and areas for development:
                </div>
                <div className='!h-[406px] !w-[521px] p-4 border border-[#D4D4D4] rounded-[4px]'>
                  <h2 className='text-center text-[#525252] text-[10px] font-medium mb-4 pb-2 border-b uppercase border-[#2B952B] '>
                    SCORE
                  </h2>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm text-left border !rounded-[3px]'>
                      <thead>
                        <tr className=' !h-[41px] '>
                          <th className='px-3 font-medium bg-[#F5F8FF]  !h-[41px] text-[7.87px] border-b border-gray-200'>
                            Competency
                          </th>
                          <th className='px-3 font-medium text-[7.87px] border-b border-gray-200 '>
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score, idx) => (
                          <tr key={idx} className={"!h-[41px]"}>
                            <td className='px-3 border-b text-[7.87px] bg-[#F5F8FF] text-[#525252] border-gray-100'>
                              {competency}
                            </td>
                            <td className='px-3 border-b text-[7.87px] text-[#525252] border-gray-100 '>
                              {score}
                            </td>
                          </tr>
                        ))}
                        <tr className='bg-[#D1E0FF] font-semibold'>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            Overall Score
                          </td>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            2.8
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Executive Summary of Participant: abdu
              </div>
              <div className='text-[10px] text-[#404040] pb-7'>
                The participant received an overall score of 2.8 out of 5,
                indicating that while they demonstrate competency in key areas,
                there is room for improvement. Below is a summary of their
                strengths and areas for development:
              </div>
              <div className='flex flex-col w-full gap-5'>
                <div className='bg-[#0069FF0D] border border-[#0069FF] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Strengths
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Strong ability to build relationships and partnerships.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Demonstrates structured planning and task execution.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Encourages communication and team engagement
                    </li>
                  </ol>
                </div>
                <div className='bg-[#FFF9F0] border border-[#F08F00] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold !border-b-[0.3px] border-[#F08F00]'>
                    Areas for development
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term
                      planning.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence..
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term planning
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                  </ol>
                </div>
                <div className='bg-[#E2FFE24D] border border-[#2B952B] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Recommendations
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Attend a leadership communication program to enhance
                      speaking clarity
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Engage in critical thinking and innovation exercises.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Participate in stakeholder engagement and negotiation
                      training.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Participant 3: reaz’s score
              </div>
              <div className='flex flex-col gap-5'>
                <div className='border-t text-[10px] text-[#404040] py-3'>
                  The participant received an overall score of 2.8 out of 5,
                  indicating that while they demonstrate competency in key
                  areas, there is room for improvement. Below is a summary of
                  their strengths and areas for development:
                </div>
                <div className='!h-[406px] !w-[521px] p-4 border border-[#D4D4D4] rounded-[4px]'>
                  <h2 className='text-center text-[#525252] text-[10px] font-medium mb-4 pb-2 border-b uppercase border-[#2B952B] '>
                    SCORE
                  </h2>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm text-left border !rounded-[3px]'>
                      <thead>
                        <tr className=' !h-[41px] '>
                          <th className='px-3 font-medium bg-[#F5F8FF]  !h-[41px] text-[7.87px] border-b border-gray-200'>
                            Competency
                          </th>
                          <th className='px-3 font-medium text-[7.87px] border-b border-gray-200 '>
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score, idx) => (
                          <tr key={idx} className={"!h-[41px]"}>
                            <td className='px-3 border-b text-[7.87px] bg-[#F5F8FF] text-[#525252] border-gray-100'>
                              {competency}
                            </td>
                            <td className='px-3 border-b text-[7.87px] text-[#525252] border-gray-100 '>
                              {score}
                            </td>
                          </tr>
                        ))}
                        <tr className='bg-[#D1E0FF] font-semibold'>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            Overall Score
                          </td>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            2.8
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Executive Summary of Participant: Reaz
              </div>
              <div className='text-[10px] text-[#404040] pb-7'>
                The participant received an overall score of 2.8 out of 5,
                indicating that while they demonstrate competency in key areas,
                there is room for improvement. Below is a summary of their
                strengths and areas for development:
              </div>
              <div className='flex flex-col w-full gap-5'>
                <div className='bg-[#0069FF0D] border border-[#0069FF] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Strengths
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Strong ability to build relationships and partnerships.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Demonstrates structured planning and task execution.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Encourages communication and team engagement
                    </li>
                  </ol>
                </div>
                <div className='bg-[#FFF9F0] border border-[#F08F00] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold !border-b-[0.3px] border-[#F08F00]'>
                    Areas for development
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term
                      planning.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence..
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term planning
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                  </ol>
                </div>
                <div className='bg-[#E2FFE24D] border border-[#2B952B] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Recommendations
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Attend a leadership communication program to enhance
                      speaking clarity
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Engage in critical thinking and innovation exercises.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Participate in stakeholder engagement and negotiation
                      training.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Participant 4: anas’s score
              </div>
              <div className='flex flex-col gap-5'>
                <div className='border-t text-[10px] text-[#404040] py-3'>
                  The participant received an overall score of 2.8 out of 5,
                  indicating that while they demonstrate competency in key
                  areas, there is room for improvement. Below is a summary of
                  their strengths and areas for development:
                </div>
                <div className='!h-[406px] !w-[521px] p-4 border border-[#D4D4D4] rounded-[4px]'>
                  <h2 className='text-center text-[#525252] text-[10px] font-medium mb-4 pb-2 border-b uppercase border-[#2B952B] '>
                    SCORE
                  </h2>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm text-left border !rounded-[3px]'>
                      <thead>
                        <tr className=' !h-[41px] '>
                          <th className='px-3 font-medium bg-[#F5F8FF]  !h-[41px] text-[7.87px] border-b border-gray-200'>
                            Competency
                          </th>
                          <th className='px-3 font-medium text-[7.87px] border-b border-gray-200 '>
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score, idx) => (
                          <tr key={idx} className={"!h-[41px]"}>
                            <td className='px-3 border-b text-[7.87px] bg-[#F5F8FF] text-[#525252] border-gray-100'>
                              {competency}
                            </td>
                            <td className='px-3 border-b text-[7.87px] text-[#525252] border-gray-100 '>
                              {score}
                            </td>
                          </tr>
                        ))}
                        <tr className='bg-[#D1E0FF] font-semibold'>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            Overall Score
                          </td>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            2.8
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Executive Summary of Participant: anas
              </div>
              <div className='text-[10px] text-[#404040] pb-7'>
                The participant received an overall score of 2.8 out of 5,
                indicating that while they demonstrate competency in key areas,
                there is room for improvement. Below is a summary of their
                strengths and areas for development:
              </div>
              <div className='flex flex-col w-full gap-5'>
                <div className='bg-[#0069FF0D] border border-[#0069FF] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Strengths
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Strong ability to build relationships and partnerships.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Demonstrates structured planning and task execution.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Encourages communication and team engagement
                    </li>
                  </ol>
                </div>
                <div className='bg-[#FFF9F0] border border-[#F08F00] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold !border-b-[0.3px] border-[#F08F00]'>
                    Areas for development
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term
                      planning.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence..
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term planning
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                  </ol>
                </div>
                <div className='bg-[#E2FFE24D] border border-[#2B952B] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Recommendations
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Attend a leadership communication program to enhance
                      speaking clarity
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Engage in critical thinking and innovation exercises.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Participate in stakeholder engagement and negotiation
                      training.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Participant 5: faisal’s score
              </div>
              <div className='flex flex-col gap-5'>
                <div className='border-t text-[10px] text-[#404040] py-3'>
                  The participant received an overall score of 2.8 out of 5,
                  indicating that while they demonstrate competency in key
                  areas, there is room for improvement. Below is a summary of
                  their strengths and areas for development:
                </div>
                <div className='!h-[406px] !w-[521px] p-4 border border-[#D4D4D4] rounded-[4px]'>
                  <h2 className='text-center text-[#525252] text-[10px] font-medium mb-4 pb-2 border-b uppercase border-[#2B952B] '>
                    SCORE
                  </h2>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm text-left border !rounded-[3px]'>
                      <thead>
                        <tr className=' !h-[41px] '>
                          <th className='px-3 font-medium bg-[#F5F8FF]  !h-[41px] text-[7.87px] border-b border-gray-200'>
                            Competency
                          </th>
                          <th className='px-3 font-medium text-[7.87px] border-b border-gray-200 '>
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score, idx) => (
                          <tr key={idx} className={"!h-[41px]"}>
                            <td className='px-3 border-b text-[7.87px] bg-[#F5F8FF] text-[#525252] border-gray-100'>
                              {competency}
                            </td>
                            <td className='px-3 border-b text-[7.87px] text-[#525252] border-gray-100 '>
                              {score}
                            </td>
                          </tr>
                        ))}
                        <tr className='bg-[#D1E0FF] font-semibold'>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            Overall Score
                          </td>
                          <td className='px-3 text-[7.87px] !h-[41px] font-medium'>
                            2.8
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Executive Summary of Participant: faisal
              </div>
              <div className='text-[10px] text-[#404040] pb-7'>
                The participant received an overall score of 2.8 out of 5,
                indicating that while they demonstrate competency in key areas,
                there is room for improvement. Below is a summary of their
                strengths and areas for development:
              </div>
              <div className='flex flex-col w-full gap-5'>
                <div className='bg-[#0069FF0D] border border-[#0069FF] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Strengths
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Strong ability to build relationships and partnerships.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Demonstrates structured planning and task execution.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Encourages communication and team engagement
                    </li>
                  </ol>
                </div>
                <div className='bg-[#FFF9F0] border border-[#F08F00] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold !border-b-[0.3px] border-[#F08F00]'>
                    Areas for development
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term
                      planning.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence..
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Needs to improve strategic thinking and long-term planning
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Should enhance critical analysis and decision-making
                      confidence.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Must develop a stronger stakeholder engagement approach.
                    </li>
                  </ol>
                </div>
                <div className='bg-[#E2FFE24D] border border-[#2B952B] p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[10px] uppercase pb-1 text-[#404040] font-bold border-b'>
                    Recommendations
                  </h2>
                  <ol className='px-3 pt-3 flex flex-col gap-3 list-decimal'>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Attend a leadership communication program to enhance
                      speaking clarity
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Engage in critical thinking and innovation exercises.
                    </li>
                    <li className='text-[#404040] text-[10px] font-normal'>
                      Participate in stakeholder engagement and negotiation
                      training.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className='!w-[595px] !h-[842px] border-2 flex p-5 '>
            <div className='w-full relative border flex flex-col p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-xs font-semibold tracking-widest uppercase px-2 flex items-center text-[#0069FF]'>
                Conclusion and recommendation
              </div>
              <div className='bg-[#F5F5F5] text-[10px] p-3 tracking-widest text-[#404040]'>
                The group demonstrates strengths in teamwork and leadership
                engagement but requires improvements in strategic planning,
                financial acumen, and decision-making under pressure. A
                structured development plan focused on training in these areas
                will enhance overall leadership effectiveness.
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <GroupReport></GroupReport> */}
      {/* single report */}

      <div className='my-10 !inter'>
        <div className='flex flex-col gap-10 items-center justify-center'>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"}   !min-h-[842px] flex pt-5 pb-4 `}
          >
            <div
              className={`w-full relative   flex flex-col justify-center items-center`}
            >
              {SingleReportData && (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/${SingleReportData?.participant?.client?.logo?.replace(/^\/?public\//, "")}`}
                  className='h-[104px] !w-[339px]'
                  alt='Client Logo'
                />
              )}
              <div className='border-t uppercase my-[23px]  w-[397px] py-[23px] text-center  text-[16px] font-medium'>
                NBO center for leadership assessment (nbo.class)
              </div>

              <div className='!w-[297px] !mx-[23px] flex flex-col gap-[6px]'>
                <div className='!text-start flex gap-2 text-[13px] text-[#242424]'>
                  <span className='!text-[#242424] !w-[113px]  font-medium'>
                    Participant Name:
                  </span>{" "}
                  <span>{SingleReportData?.participant?.participant_name}</span>
                </div>
                <div className='!text-start flex gap-2 text-[13px] text-[#242424]'>
                  <span className=' !w-[113px]  font-medium'>
                    Company Name:
                  </span>{" "}
                  <span>
                    {SingleReportData?.participant?.client?.client_name}
                  </span>
                </div>
                <div className='!text-start flex gap-2 text-[13px] text-[#242424]'>
                  <span className='!text-[#242424] !w-[113px]  font-medium'>
                    Report By:
                  </span>{" "}
                  <span>
                    {SingleReportData?.participant?.class_part_report
                      ?.admin_name === "Admin Name"
                      ? `< ${
                          SingleReportData?.participant?.class_part_report
                            ?.admin_name
                        } >`
                      : SingleReportData?.participant?.class_part_report
                          ?.admin_name}
                  </span>
                </div>
                <div className='!text-start flex gap-2 text-[13px] mb-32 text-[#242424]'>
                  <span className='!text-[#242424] !w-[113px]   font-medium'>
                    Date:
                  </span>{" "}
                  <span>
                    {moment(SingleReportData?.participant?.updatedAt).format(
                      "DD MMM YYYY",
                    )}
                  </span>
                </div>
                <div className='flex items-center justify-center'>
                  <img
                    src='/nboleadershiplogo.png'
                    className='h-[58px] !w-[200px]'
                  ></img>
                </div>
              </div>
              {/* <div className=' absolute bottom-32 text-center'>
                <img
                  src='/nboleadershiplogo.png'
                  className='h-[58px] !w-[200px]'
                ></img>
              </div> */}
              <div className='border border-[#FF2600] p-1 w-[515px] text-[#FF2600] text-[10px] absolute bottom-6 text-center'>
                All rights reserved. This is a confidential and proprietary
                information of NBO group.
                <br /> Duplication in any form is strictly prohibited without
                written consent from NBO group.
              </div>
            </div>
          </div>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !h-[842px]  flex pt-5 pb-4`}
          >
            <div
              className='w-full
             relative  flex flex-col  items-center p-5'
            >
              <div className='bg-[#F5F9FF] mb-5 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                content page
              </div>
              <div className='w-full'>
                {content?.map(
                  (item: { title: string; pageNo: number }, index: number) => {
                    return (
                      <div
                        className={`flex gap-1 text-[12px] text-[#40404] ${content?.length - 1 !== index ? "border-b border-[#CBCBCB]" : ""}  py-3`}
                      >
                        {/* <div className='text-[#40404]'>{index + 1}</div> */}
                        <div className='flex w-full !justify-between text-[#40404]'>
                          <div>{item?.title}</div>
                          <div>{item?.pageNo}</div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !min-h-[842px] flex pt-5 pb-4 !px-5`}
          >
            <div className='!w-full relative  flex flex-col p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] text-xs font-semibold   uppercase px-2 flex items-center text-[#0069FF]'>
                Summary of Nbo Class
              </div>
              <div className='bg-[rgba(239,239,241,0.45)] text-[12px] p-3 leading-[18px] tracking-[0.3px] rounded-[3px] text-[#404040]'>
                The NBO CLASS is designed to assess leadership potential and
                competency development through interactive learning experiences.
                Participants engage in a series of structured activities,
                including Think on Your Feet, Role Plays, Case Study Analysis,
                Competency-Based Questionnaires, and Group Activities. These
                assessments measure various Competencies, such as Strategic
                Vision and Insight, Business Acumen and Financial Stewardship,
                Innovation and Transformation Leadership, Inspirational
                Leadership and Decision-Making, Collaborative Influence and
                Stakeholder Engagement and Talent Development and Inclusion. The
                goal of the NBO class is to provide insights into strengths and
                areas for development, equipping participants with actionable
                strategies for leadership growth.
              </div>
            </div>
          </div>

          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !min-h-[842px] flex pt-5 pb-4 `}
          >
            <div className='w-full relative  flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Assessments and their definition
              </div>
              <div className='flex flex-col gap-5'>
                <div className=' text-[12px] leading-[18px] tracking-[0.3px]  text-[#404040] pb-3'>
                  Assessments are structured evaluations designed to measure
                  specific leadership competencies in various real-world
                  scenarios. Each assessment provides insights into an
                  individual’s strengths and areas for development, enabling
                  targeted improvement. Below are the key assessments used in
                  the NBO class:
                </div>

                <div className='overflow-x-auto'>
                  <table className='min-w-full text-sm text-left  !rounded-[3px]'>
                    <thead>
                      <tr className=' !h-[41px] '>
                        <th className='px-3 font-medium bg-[#F5F8FF] text-[#171717]  !h-[41px] text-[10px] border-b border-gray-100'>
                          Assessments
                        </th>
                        <th className='px-3 font-medium text-center bg-[#F5F8FF] text-[#171717] text-[10px] border-b border-gray-100 '>
                          Definition
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((item: any, idx) => (
                        <tr key={idx} className={"!h-[41px]"}>
                          <td className='px-3 border-b text-[10px] leading-[14px] tracking-[0.2px]  text-[#525252] border-gray-100'>
                            {item?.assessment}
                          </td>
                          <td className='px-3 py-1 border-b text-[10px] leading-[14px] tracking-[0.2px] text-[#525252] border-gray-100 '>
                            {item?.defination}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !min-h-[842px] !px-5 flex pt-5 pb-4 `}
          >
            <div className='w-full relative  flex flex-col items-center p-5'>
              <div className='!bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Competencies and their definition
              </div>
              <div className='flex flex-col gap-5'>
                <div className=' text-[12px] leading-[18px] tracking-[0.3px]  text-[#404040] pb-3'>
                  Competencies are essential leadership qualities that define an
                  individual’s ability to perform effectively in various
                  professional scenarios. These competencies are assessed to
                  identify strengths and areas for improvement, forming the
                  basis for targeted leadership development. Below are the key
                  competencies evaluated in the NBO class:
                </div>

                <div className='overflow-x-auto'>
                  <table className='min-w-full text-sm text-left  !rounded-[3px]'>
                    <thead>
                      <tr className=' !h-[41px] '>
                        <th className='px-3 font-medium bg-[#F5F8FF] !h-[41px] text-[10px] leading-[14px] tracking-[0.2px] border-b border-gray-100'>
                          Competencies
                        </th>
                        <th className='px-3 font-medium bg-[#F5F8FF]  text-[10px] leading-[14px] tracking-[0.2px] border-b border-gray-100 '>
                          Definition
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {compentencys.map(
                        (item: any, idx: number) => (
                          console.log(item, "<----------dkfjkdjfks"),
                          (
                            <tr key={idx} className={"!h-[41px]"}>
                              <td className='px-3 border-b  py-1 text-[10px] leading-[14px] tracking-[0.2px]  text-[#525252] border-gray-100'>
                                {item?.competencies}
                              </td>
                              <td className='px-3 py-1 border-b  text-[10px] leading-[14px] tracking-[0.2px]  text-[#525252] border-gray-100 '>
                                {item?.description}
                              </td>
                            </tr>
                          )
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !min-h-[842px] !px-5 flex pt-5 pb-4 `}
          >
            <div className='w-full relative  flex flex-col items-center p-5'>
              <div className='!bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                NBO CLass scoring standard
              </div>
              <div className='flex flex-col gap-5'>
                <div className=' text-[12px] leading-[18px] tracking-[0.3px]  text-[#404040] pb-3'>
                  The scoring standard provides a structured evaluation
                  framework, allowing for a clear assessment of leadership
                  competencies. Each score reflects the participant's
                  proficiency level, from basic understanding to excellence.
                  This system helps identify areas where further development is
                  required, ensuring a targeted improvement plan.
                </div>

                <div className='border border-[#D4D4D4] rounded-[4px] p-6 '>
                  <div className='border-b mb-[18px]  border-[#2B952B] flex items-center justify-center'>
                    <h2 className='text-[#525252] uppercase mb-[6px] font-medium text-[10px] items-center'>
                      Scoring Standard
                    </h2>
                  </div>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm  border-[0.5px] border-[#DAE0E6]  !rounded-md'>
                      <thead className=''>
                        <tr className=' !h-[41px]'>
                          <th className='w-[92px] borber-b text-[7.87px] font-normal text-[#171717]'>
                            Score
                          </th>
                          <th className='w-[92px] borber-b text-[7.87px] font-normal text-[#171717] '>
                            Rating
                          </th>
                          <th className='w-[289px] borber-b text-[7.87px] font-normal text-[#171717]'>
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={"!h-[32px]"}>
                          <td className='px-3 text-center border-t-[0.5px] border-[#DAE0E6]  text-black w-[92px] py-1 text-[7.87px] leading-[14px] tracking-[0.2px] bg-[#FF0000]'>
                            1
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px] border-t-[0.5px] border-[#DAE0E6] text-[7.87px] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Poor
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  border-[#DAE0E6] border-t text-[7.87px] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance falls significantly below expectations.
                            Significant improvement needed.
                          </td>
                        </tr>
                        <tr className={"!h-[32px]"}>
                          <td className='px-3  w-[92px] text-center text-black py-1 text-[7.87px] leading-[14px] tracking-[0.2px] bg-[#FFCCFF]  '>
                            2
                          </td>
                          <td className='px-3 py-1  border-b-[0.5px] text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Below Average
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance is below the expected level. Notable
                            gaps in understanding or execution.
                          </td>
                        </tr>
                        <tr className={"!h-[32px]"}>
                          <td className='px-3   w-[92px] py-1 text-center text-black text-[7.87px] leading-[14px] tracking-[0.2px] bg-[#FFCC00]  '>
                            3
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Competent
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance meets the expected level. Adequate but
                            with room for improvement.
                          </td>
                        </tr>
                        <tr className={"!h-[32px]"}>
                          <td className='px-3  w-[92px] py-1 text-center text-black text-[7.87px] leading-[14px] tracking-[0.2px] bg-[#92D050]  '>
                            4
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Good
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance exceeds expectations. Strong
                            understanding and execution.
                          </td>
                        </tr>
                        <tr className={"!h-[32px]"}>
                          <td className='px-3   w-[92px] py-1 text-center text-black text-[7.87px] leading-[14px] tracking-[0.2px] bg-[#3D80C2]  '>
                            5
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Excellent
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance significantly surpasses expectations.
                            Exceptional execution and creativity.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !min-h-[842px] !px-5  flex pt-5 pb-4 `}
          >
            <div className='!w-full relative  flex flex-col gap-5  p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Summary for {SingleReportData?.participant?.participant_name}
              </div>

              <div className=' flex flex-col items-center gap-5'>
                <CustomBarChart
                  data={
                    barChartDataOfCompetencyBasedEvaluation
                      ? barChartDataOfCompetencyBasedEvaluation
                      : []
                  }
                  layout='vertical'
                  valueKey='value'
                  indexKey='category'
                  height={231}
                  width={520}
                  enableGridY
                  // marginLeft={30}
                  // enableGridY={true}
                  // enableGridX={false}
                />
              </div>
              <div style={{ marginBottom: 10, fontSize: 12 }}>
                {Object.entries(shortLabelMap).map(
                  ([short, full], idx, arr) => (
                    <div
                      key={short}
                      style={{ marginBottom: idx === arr.length - 1 ? 0 : 6 }}
                    >
                      <strong>{short}</strong>: {full}
                    </div>
                  ),
                )}
              </div>
              <div>
                <h2 className='text-[12px] uppercase pb-1 text-[#404040] font-bold border-b mb-4'>
                  Summary
                </h2>
                <div
                  className='text-[12px] leading-[18px] tracking-[0.3px] text-[#404040] pb-7'
                  dangerouslySetInnerHTML={{
                    __html:
                      SingleReportData?.participant?.class_part_report
                        ?.part_summary,
                  }}
                >
                  {/* The participant received an overall score of{" "}
                {SingleReportData?.over_all_score} out of 5, indicating that
                while they demonstrate competency in key areas, there is room
                for improvement. Below is a summary of their strengths and areas
                for development: */}
                  {/* {SingleReportData?.participant?.class_part_report?.part_summary} */}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !min-h-[842px] !px-5  flex pt-5 pb-4 `}
          >
            <div className='!w-full relative  flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Strengths of {SingleReportData?.participant?.participant_name}
              </div>

              <div className='w-[500px] border p-4 border-[#EFEFEF] shadow-[rgba(0,0,0,0.02)] flex flex-col items-center justify-center rounded-[8px] mb-8'>
                <h2 className='font-bold text-[#080808] text-xs text-center py-4'>
                  Strengths
                </h2>
                <div className='  flex gap-5 w-full'>
                  <CustomBarChart
                    data={strengthScores}
                    layout='horizontal'
                    color='#3786EE'
                    valueKey='value'
                    indexKey='category'
                    height={197}
                    width={330}
                    enableGridX
                    // marginLeft={240}
                  />
                  <div className=' w-[130px] '>
                    {/* <table className='border'>
                      <thead className='border-b'>
                        <tr className='font-bold '>
                          <th className='text-[6px] w-[80px] border-r'>
                            Competency
                          </th>
                          <th className='text-[6px] w-[20px] p-1'>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strengthScores?.map((item: any, index: number) => (
                          <tr key={index} className='border-b'>
                            <td className='text-[6px] border-r p-1'>
                              {item?.categoryFullName}
                            </td>
                            <td className='text-[6px] p-1'>{item?.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */}
                    <h2 className='text-[11px] mb-1'>Competencies</h2>
                    {[...strengthScores]
                      .sort(
                        (a: any, b: any) =>
                          Number(b.category.replace("C", "")) -
                          Number(a.category.replace("C", "")),
                      )
                      .map((item: any, index: number) => (
                        <div key={index} className='mb-2'>
                          <div className='flex items-center gap-2 mb-1'>
                            <p className='text-[8px] font-medium border p-[2px] rounded-sm'>
                              {item?.category}
                            </p>
                            <p className='text-[8px]'>
                              {item?.categoryFullName}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full gap-5'>
                <div className='bg-[rgba(239,239,241,0.45)]  p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[12px] uppercase pb-1 text-[#404040] font-medium border-b mb-4'>
                    Strengths
                  </h2>
                  <div
                    className='text-[12px]  tracking-[0.3px]  text-[#404040] leading-[18px] mb-4'
                    dangerouslySetInnerHTML={{
                      __html:
                        SingleReportData?.participant?.class_part_report
                          ?.strength,
                    }}
                  >
                    {/* {SingleReportData?.participant?.class_part_report?.strength} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`break-before-page ${onlyView === "true" ? "w-[595px] border" : "w-full"} !min-h-[842px] !px-5 flex pt-5 pb-4 `}
          >
            <div className='w-full relative  flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Areas for development of:{" "}
                {SingleReportData?.participant?.participant_name}
              </div>
              <div className='w-[500px] border p-4 border-[#EFEFEF] shadow-[rgba(0,0,0,0.02)] flex items-center flex-col justify-center rounded-[8px] mb-8'>
                <h2 className='font-medium text-[#080808] text-xs text-center py-4'>
                  Areas for development
                </h2>
                <div className='  flex justify-between  gap-5 w-full'>
                  <CustomBarChart
                    data={developmentScores}
                    layout='horizontal'
                    color='#FFB3FF'
                    valueKey='value'
                    indexKey='category'
                    height={197}
                    width={300}
                    enableGridX
                    // marginLeft={260}
                  />
                  <div className=' w-[130px]  '>
                    {/* <table className='border'>
                      <thead className='border-b'>
                        <tr className='font-bold '>
                          <th className='text-[6px] w-[80px] border-r'>
                            Competency
                          </th>
                          <th className='text-[6px] w-[20px] p-1'>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {developmentScores?.map((item: any, index: number) => (
                          <tr key={index} className='border-b'>
                            <td className='text-[6px] border-r p-1'>
                              {item?.categoryFullName}
                            </td>
                            <td className='text-[6px] p-1'>{item?.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */}
                    <h2 className='text-[11px] mb-1'>Competencies</h2>
                    {[...developmentScores]
                      .sort(
                        (a: any, b: any) =>
                          Number(b.category.replace("C", "")) -
                          Number(a.category.replace("C", "")),
                      )
                      .map((item: any, index: number) => (
                        <div key={index} className='mb-2'>
                          <div className='flex items-center gap-2 mb-1'>
                            <p className='text-[8px] font-medium border p-[2px] rounded-sm'>
                              {item?.category}
                            </p>
                            <p className='text-[8px]'>
                              {item?.categoryFullName}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full gap-5'>
                <div className='bg-[rgba(239,239,241,0.45)]  p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[12px] uppercase pb-1 text-[#404040] font-medium border-b mb-4'>
                    Areas for development
                  </h2>

                  <div
                    className='text-[12px]  tracking-[0.3px]  text-[#404040] leading-[18px] mb-4'
                    dangerouslySetInnerHTML={{
                      __html:
                        SingleReportData?.participant?.class_part_report
                          ?.area_for_dev,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !min-h-[842px] flex pt-5 pb-4`}
          >
            <div className='!w-full relative  flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Recommendations of{" "}
                {SingleReportData?.participant?.participant_name}
              </div>

              <div className='flex flex-col !w-full gap-5'>
                <div className='bg-[rgba(239,239,241,0.45)]  p-4 rounded-[3px] !w-full'>
                  <h2 className='text-[12px] uppercase pb-1 text-[#404040] font-medium border-b mb-4'>
                    Recommendations
                  </h2>
                  <div
                    className='text-[12px]  tracking-[0.3px] text-[#404040]   leading-[18px] mb-4'
                    dangerouslySetInnerHTML={{
                      __html:
                        SingleReportData?.participant?.class_part_report
                          ?.recommendation,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          {/* <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !min-h-[842px] !px-5 flex pt-5 pb-4 `}
          >
            <div className='w-full relative  flex flex-col items-center p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Participant’s score
              </div>
              <div className='mb-10 relative'>
                <SankeyChart
                  // Data={((node = SankeyChartLinks), (links = SankeyChartNode))}
                  Data={SankeyChartDataFinal}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: 20,
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "#919BA7",
                  }}
                >
                  Competencies
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    right: 20,
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "#919BA7",
                  }}
                >
                  Overall Score
                </div>
              </div>
              <div className='!mb-10'>
                <RaradChart
                  data={radarData || []}
                  indexBy='competency'
                  keys={["score"]}
                />
              </div>
              <div className='overflow-x-auto !w-full'>
                <table className='min-w-full text-sm text-left  !rounded-[3px]'>
                  <thead>
                    <tr className=' !h-[41px] '>
                      <th className='px-3 font-medium bg-[#F5F8FF]  !h-[41px] text-[9px] border-b border-gray-100'>
                        ID
                      </th>
                      <th className='px-3 font-medium bg-[#F5F8FF]  !h-[41px] text-[9px] border-b border-gray-100'>
                        Competency Name
                      </th>
                      <th className='px-3 font-medium bg-[#F5F8FF]  text-[9px] border-b border-gray-100 '>
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ParticipantScoreData.map((item: any, idx: number) => (
                      <tr key={idx} className={"!h-[41px]"}>
                        <td className='px-3 border-b text-[9px]  text-[#525252] border-gray-100'>
                          {item?.shortName}
                        </td>
                        <td className='px-3 border-b text-[9px]  text-[#525252] border-gray-100'>
                          {item?.competency}
                        </td>
                        <td className='px-3 border-b text-[9px] text-[#525252] border-gray-100 '>
                          {item?.score}
                        </td>
                      </tr>
                    ))}
                    <tr className='border-b border-gray-100 font-semibold'>
                      <td className='px-3 text-[9px] !h-[41px] font-medium'></td>
                      <td className='px-3 text-[9px] !h-[41px] font-medium'>
                        Overall Score
                      </td>
                      <td className='px-3 text-[9px] !h-[41px] font-medium'>
                        {SingleReportData?.over_all_score}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}

          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !min-h-[842px] flex pt-5 pb-4pt-5 pb-4 `}
          >
            <div className='!w-full relative  flex flex-col p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px]  text-[13px] tracking-[0.3px] font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                competency based evaluation
              </div>
              {/* <div className='my-8'>
                <CustomBarChart
                  data={
                    barChartDataOfCompetencyBasedEvaluation
                      ? barChartDataOfCompetencyBasedEvaluation
                      : []
                  }
                  layout='vertical'
                  color='#4472C4'
                  valueKey='value'
                  indexKey='category'
                  height={231}
                  width={520}
                  marginLeft={30}
                  enableGridY={true}
                  enableGridX={false}
                />
                <div style={{ marginTop: 10, fontSize: 12 }}>
                  {Object.entries(shortLabelMap).map(
                    ([short, full], idx, arr) => (
                      <div
                        key={short}
                        style={{ marginBottom: idx === arr.length - 1 ? 0 : 6 }} // no margin on last item
                      >
                        <strong>{short}</strong>: {full}
                      </div>
                    ),
                  )}
                </div>
              </div> */}
              <div className='flex w-full flex-col gap-10'>
                {ParticipantScoreData?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className='flex flex-col gap-5 break-inside-avoid page-break-inside-avoid avoid-page-break'
                  >
                    <h2 className='text-[#2b952b] text-[12px] leading-[20px] font-medium   uppercase  border-b pb-2'>
                      {item?.competency}
                    </h2>
                    <div className='bg-[rgba(239,239,241,0.45)] !w-full flex flex-col gap-3  rounded-[3px] p-3'>
                      <div className='w-full'>
                        <h3 className='text-[12px] border-b pb-2 text-[#404040] uppercase font-medium'>
                          Strengths:
                        </h3>
                        <ul
                          className='list-disc leading-[18px] tracking-[0.3px] text-[#404040]  my-2 text-[12px] px-3'
                          dangerouslySetInnerHTML={{
                            __html: `<li>${item?.strength
                              ?.split(";")
                              .map((str: string) => str.trim())
                              .filter(Boolean)
                              .join("</li><li>")}</li>`,
                          }}
                        />
                      </div>
                    </div>
                    <div className='bg-[rgba(239,239,241,0.45)] flex flex-col gap-3 rounded-[3px] p-3'>
                      <h3 className='!text-[12px] border-b pb-2 text-[#404040] uppercase font-medium'>
                        Areas for Development:
                      </h3>
                      <ul
                        className='list-disc leading-[18px] tracking-[0.3px] text-[#404040]  my-2 text-[12px] px-3'
                        dangerouslySetInnerHTML={{
                          __html: `<li>${item?.area_for_dev
                            ?.split(";")
                            .map((str: string) => str.trim())
                            .filter(Boolean)
                            .join("</li><li>")}</li>`,
                        }}
                      ></ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !min-h-[842px]  flex pt-5 pb-4 `}
          >
            <div className='w-full relative  flex flex-col p-5'>
              <div className='bg-[#F5F9FF] mb-7 w-full h-[28px] text-[13px] tracking-[0.3px] text-xs font-semibold  uppercase px-2 flex items-center text-[#0069FF]'>
                Conclusion and recommendation
              </div>
              <div className='bg-[rgba(239,239,241,0.45)] text-[12px] p-3 leading-[18px] tracking-[0.3px]  text-[#404040]'>
                The participant has strengths in collaboration and execution but
                requires improvement in strategic thinking, decision-making, and
                stakeholder influence. To enhance leadership effectiveness, it
                is recommended to focus on strategic planning, financial acumen,
                decision-making under pressure, and stakeholder engagement.
                Targeted training and mentorship will support professional
                growth and readiness for greater responsibilities.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportUI;
