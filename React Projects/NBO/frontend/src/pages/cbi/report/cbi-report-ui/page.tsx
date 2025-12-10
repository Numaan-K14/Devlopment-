import { useQuery } from "@/hooks/useQuerry";
import moment from "moment";
import CustomBarChart from "pages/report-ui/components/BarChart";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const CbiReportUIPage = () => {
  const { state } = useLocation();
  console.log(state, ",-0 syststt");
  const [searchParams] = useSearchParams();
  const onlyView = searchParams.get("onlyView");
  const user_obj = localStorage.getItem("users_obj");
  const user = user_obj && JSON.parse(user_obj);
  const { data: SingleReportData } = useQuery<any>({
    queryKey: [`cbi/report-data/${state}`],
    select: (data: any) => data?.data?.data,
    enabled: !!state,
  });

  console.log(SingleReportData, ",------- SingleReportData");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (SingleReportData) {
      const combinedRows = [
        ...(SingleReportData?.reportData?.strengths?.rows || []),
        ...(SingleReportData?.reportData?.development_areas?.rows || []),
      ];

      const formattedData = combinedRows.map((item: any, index: number) => ({
        id: `${index}`,
        comp_id: `${index}`,
        category: `C${index}`,
        categoryFullName: item?.competency,
        value: item?.rating,
      }));

      setChartData(formattedData);
      console.log("Combined Chart Data:", formattedData);
    }
  }, [SingleReportData]);

  console.log("Rendered Chart Data:", chartData);
  const CompScores = [
    {
      id: "5",
      comp_id: "5",
      category: `C5`,
      categoryFullName: "Talent Development and Inclusion",
      value: "3.0",
    },
    {
      id: "4",
      comp_id: "4",
      category: `C4`,
      categoryFullName: "Collaborative Influence and Stakeholder Engagement",
      value: "3.2",
    },
    {
      id: "3",
      comp_id: "3",
      category: `C3`,
      categoryFullName: "Business Acumen and Financial Stewardship",
      value: "3.5",
    },
    {
      id: "2",
      comp_id: "2",
      category: `C2`,
      categoryFullName: "Strategic Vision and Insight",
      value: "3.8",
    },
    {
      id: "1",
      comp_id: "1",
      category: `C1`,
      categoryFullName: "Inspirational Leadership and Decision-Making",
      value: "4.2",
    },
  ];

  const AvgScore = [
    {
      id: "5",
      comp_id: "5",
      category: `C5`,
      categoryFullName: "Talent Development and Inclusion",
      value: "3.0",
    },
  ];
  return (
    <div>
      <div className='py-10 !bg-white !inter'>
        <div className='flex flex-col gap-10 items-center justify-center'>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !h-[842px]   pt-5 pb-4 flex flex-col items-center `}
          >
            <div className=' relative  flex flex-col   gap-12 pt-16 pb-[37px] w-[440px] h-[540px]'>
              <div className='flex justify-between items-center  border-b-2 border-[#17B26A] pb-[6px]'>
                <img
                  src='/nboleadershiplogo.png'
                  className='w-[260px] h-[80px]'
                />

                <div>
                  <p className='text-[#90A1B9] text-xs uppercase tracking-[1.2px]'>
                    Document Type
                  </p>
                  <p className='text-sm text-[#314158]'>Assessment Report</p>
                </div>
              </div>

              <div className='flex flex-col  h-[115px]'>
                <span className='bg-[rgba(23,178,106,0.1)] text-xs text-[#17B26A] h-[36px] flex justify-center items-center rounded-full w-[190px] tracking-[1.2px]'>
                  Official Assessment
                </span>
                <div className='text-[#0F172B] text-[22px] leading-[60px]'>
                  Assessment Report
                </div>
                <div className='text-[#62748E] '>
                  Competency-Based Interview System
                </div>
              </div>

              <div className='border-l-2 border-[#E2E8F0] flex flex-col gap-8 pl-4 py-3'>
                <div className='flex flex-col gap-2 '>
                  <p className='text-[10px] leading-[16px] text-[#90A1B9] uppercase tracking-[1.2px]'>
                    Participant
                  </p>
                  <p className='text-[#0F172B] '>
                    {SingleReportData?.reportData?.participant
                      ?.participant_name || "-"}
                  </p>
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-[10px] leading-[16px] text-[#90A1B9] uppercase'>
                    Assessment Date
                  </p>
                  <p className='text-[#0F172B] '>
                    {moment(SingleReportData?.reportData?.createdAt).format(
                      "DD/MM/YYYY",
                    ) || "-"}
                  </p>
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-[10px] leading-[16px] text-[#90A1B9] uppercase'>
                    Total Questions
                  </p>
                  <p className='text-[#0F172B] '>
                    {SingleReportData?.totalQuestionCount} Questions
                  </p>
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-[10px] leading-[16px] text-[#90A1B9] uppercase'>
                    Assessment Type
                  </p>
                  <p className='text-[#0F172B] '>Competency Based</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !h-[842px]  flex pt-5 pb-4`}
          >
            <div
              className='w-full
             relative  flex flex-col  items-center '
            >
              <div className='flex flex-col mb-5 w-full border-b pb-2 border-[#17B26A]  '>
                <p className='text-[#0F172B] text-xl !leading-[30px]'>
                  AI Scoring Standards
                </p>
                <p className='text-[#62748E] text-sm'>Assessment Report</p>
              </div>
              <div className='w-full flex flex-col gap-4'>
                <div className='text-[#404040] text-[10px] leading-[18px]'>
                  Our AI analyzes your responses using natural language
                  processing to evaluate competency demonstration, example
                  quality, and response structure. Scores are calibrated against
                  professional standards and validated responses from industry
                  experts.
                </div>
                <div>
                  <span className='text-[#535862] text-sm'>
                    Performance Scale Overview
                  </span>
                  <div className='!rounded-[6px] flex '>
                    <div className='w-[20%] bg-[#FB2C36] rounded-l-[6px]'></div>
                    <div className='w-[20%] bg-[#FB64B6]'></div>
                    <div className='w-[20%] bg-[#F0B100]'></div>
                    <div className='w-[20%] bg-[#00C950]'></div>
                    <div className='w-[20%] text-[#2B7FFF] bg-[#2B7FFF] rounded-r-[6px]'>
                      h
                    </div>
                  </div>
                  <div className='text-[10px] leading-[18px] text-[#62748E] flex justify-between py-1'>
                    <span>1.0 (Poor)</span>
                    <span>5.0 (Excellent)</span>
                  </div>
                </div>
                <div>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm    !rounded-md'>
                      <thead className=''>
                        <tr className=' !h-[41px]'>
                          <th className='w-[92px] borber-b text-[7.87px]  text-[#171717]'>
                            Score Range
                          </th>
                          <th className='w-[92px] borber-b text-[7.87px]  text-[#171717] '>
                            Performance
                          </th>
                          <th className='w-[289px] borber-b text-[7.87px]  text-[#171717]'>
                            Definition
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={"!h-[38px]"}>
                          <td className='px-3 text-center border-t-[0.5px] border-[#DAE0E6]  text-black  py-1 text-[7.87px] leading-[14px] tracking-[0.2px] flex items-center justify-center gap-1 !h-[38px]'>
                            <div className='!w-[10px] h-[10px] bg-[#FF0000] text-[#FF0000] rounded-[2px]'>
                              0
                            </div>
                            <span>0.0 - 1.0</span>
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px] border-t-[0.5px] border-[#DAE0E6] text-[7.87px] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Poor
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  border-[#DAE0E6] border-t text-[7.87px] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance falls significantly below expectations.
                            Significant improvement needed.
                          </td>
                        </tr>
                        <tr className={"!h-[38px]"}>
                          <td className='px-3 text-center border-t-[0.5px] border-[#DAE0E6]  text-black  py-1 text-[7.87px] leading-[14px] tracking-[0.2px] flex items-center justify-center gap-1 !h-[38px]'>
                            <div className='!w-[10px] h-[10px] bg-[#FB64B6] text-[#FB64B6] rounded-[2px]'>
                              0
                            </div>
                            <span>1.1 - 2.0</span>
                          </td>
                          <td className='px-3 py-1  border-b-[0.5px] text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Below Average
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance is below the expected level. Notable
                            gaps in understanding or execution.
                          </td>
                        </tr>
                        <tr className={"!h-[38px]"}>
                          <td className='px-3 text-center border-t-[0.5px] border-[#DAE0E6]  text-black  py-1 text-[7.87px] leading-[14px] tracking-[0.2px] flex items-center justify-center gap-1 !h-[38px]'>
                            <div className='!w-[10px] h-[10px] bg-[#F0B100] text-[#F0B100] rounded-[2px]'>
                              0
                            </div>
                            <span>2.1 - 3.0</span>
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Competent
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance meets the expected level. Adequate but
                            with room for improvement.
                          </td>
                        </tr>
                        <tr className={"!h-[38px]"}>
                          <td className='px-3 text-center border-t-[0.5px] border-[#DAE0E6]  text-black  py-1 text-[7.87px] leading-[14px] tracking-[0.2px] flex items-center justify-center gap-1 !h-[38px]'>
                            <div className='!w-[10px] h-[10px] bg-[#00C950] text-[#00C950] rounded-[2px]'>
                              0
                            </div>
                            <span>3.1 - 4.4</span>
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Good
                          </td>
                          <td className='px-3 py-1 border-b-[0.5px]  text-[7.87px] border-[#DAE0E6] leading-[14px] tracking-[0.2px]  text-[#525252]  '>
                            Performance exceeds expectations. Strong
                            understanding and execution.
                          </td>
                        </tr>
                        <tr className={"!h-[38px] border-b-[0.5px]"}>
                          <td className='px-3 text-center border-t-[0.5px]  border-[#DAE0E6]  text-black  py-1 text-[7.87px] leading-[14px] tracking-[0.2px] flex items-center justify-center gap-1 !h-[38px]'>
                            <div className='!w-[10px] h-[10px] bg-[#2B7FFF] text-[#2B7FFF] rounded-[2px]'>
                              0
                            </div>
                            <span>4.5 - 5.0</span>
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
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !h-[842px]  flex pt-5 pb-4`}
          >
            <div
              className='w-full
             relative  flex flex-col  items-center '
            >
              <div className='flex flex-col mb-5 w-full border-b pb-2 border-[#17B26A]  '>
                <p className='text-[#0F172B] text-xl !leading-[30px]'>
                  {SingleReportData?.reportData?.participant?.participant_name}
                </p>
                <p className='text-[#62748E] text-sm'>Summary of Participant</p>
              </div>
              <div className='w-full flex flex-col gap-4'>
                <div className='h-[117px] flex gap-4 '>
                  <div
                    className={`w-1/2 text-white rounded-[6px] bg-gradient-to-r  flex flex-col gap-2 items-center justify-center ${SingleReportData?.reportData?.overall_score <= 1 ? "bg-[#FF0000]" : SingleReportData?.reportData?.overall_score <= 2 ? "bg-[#FB64B6]" : SingleReportData?.reportData?.overall_score <= 3 ? "bg-[#F0B100]" : SingleReportData?.reportData?.overall_score <= 4.4 ? "from-[#00C950] to-[#00A63E]" : SingleReportData?.reportData?.overall_score < 5 ? "bg-[#2B7FFF]" : "bg-[#2B7FFF]"}`}
                  >
                    <p className='text-[48px] leading-[60px] font-bold border-b'>
                      {SingleReportData?.reportData?.overall_score || "-"}
                    </p>
                    <p className='text-[#F0FDF4] text-xs'>Overall Score</p>
                  </div>
                  <div className='w-1/2 rounded-[6px] flex flex-col gap-1 justify-center border border-[#E2E8F0] pl-6'>
                    <p className='text-xl text-[#0F172B]'>
                      {SingleReportData?.reportData?.overall_score <= 1.0
                        ? "Poor"
                        : SingleReportData?.reportData?.overall_score <= 2.0
                          ? "Below Average"
                          : SingleReportData?.reportData?.overall_score <= 3.0
                            ? "Competent"
                            : SingleReportData?.reportData?.overall_score <= 4.5
                              ? "Good"
                              : SingleReportData?.reportData?.overall_score >=
                                  4.5
                                ? "Excellent"
                                : "Poor"}
                    </p>
                    <p className='text-[#62748E] text-xs'>Performance Level</p>
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <span className='text-[#0F172B] text-xs'>
                    Competency Scores
                  </span>
                  <div className='border border-[#E2E8F0] rounded-[6px] p-[17px]  flex gap-5 w-full'>
                    <CustomBarChart
                      data={chartData}
                      layout='horizontal'
                      // color='#3786EE'
                      valueKey='value'
                      indexKey='category'
                      height={197}
                      width={330}
                      enableGridX

                      // marginLeft={240}
                    />
                    <div className=' w-[130px] '>
                      <h2 className='text-[11px] mb-1'>Competencies</h2>
                      {[...CompScores]
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
                <div className='w-full p-4 '>
                  <div className='font-bold text-[10px] leading-[20px] text-[#404040] border-b border-[#BEC8D0] pb-1 mb-4'>
                    Strengths
                  </div>
                  <div className='flex flex-col gap-4 text-[10px] leading-[18px] text-[#404040] break-before-page'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          SingleReportData?.reportData?.strengths
                            ?.overall_strength || "-",
                      }}
                    ></div>
                    {/* <p>
                      <span className='text-[10px] leading-[18px] font-semibold'>
                        Strategic thinking
                      </span>{" "}
                      is another key strength, as reflected in his Strategising
                      skills. He aligns his efforts with organizational
                      objectives and recognizes emerging trends, enabling him to
                      contribute meaningfully to long-term goals.
                    </p>
                    <p>
                      Lastly, his
                      <span className='text-[10px] leading-[18px] font-semibold'>
                        {" "}
                        Self-Awareness{" "}
                      </span>
                      allows him to acknowledge strengths and weaknesses while
                      maintaining composure under pressure. His openness to
                      feedback and ability to reflect on performance contribute
                      to his continuous personal and professional growth.
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${onlyView === "true" ? "w-[595px] border" : "w-full"} break-before-page !px-5 !h-[842px]  flex pt-5 pb-4`}
          >
            <div
              className='w-full
             relative  flex flex-col gap-6 items-center '
            >
              <div className='flex flex-col  w-full border-b pb-2 border-[#17B26A]  '>
                <p className='text-[#0F172B] text-xl !leading-[30px]'>
                  {SingleReportData?.reportData?.participant?.participant_name}
                </p>
                <p className='text-[#62748E] text-sm'>Development Insights</p>
              </div>
              <div className='w-full p-4 '>
                <div className='font-bold text-[10px] leading-[20px] text-[#404040] border-b border-[#BEC8D0] pb-1 mb-4'>
                  Areas for development
                </div>
                <div className='flex flex-col gap-4 text-[10px] leading-[18px] text-[#404040] break-before-page'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        SingleReportData?.reportData?.development_areas
                          ?.overall_development || "-",
                    }}
                  ></div>
                  {/* <p>
                    His{" "}
                    <span className='text-[10px] leading-[18px] font-semibold'>
                      Entrepreneurial Spirit
                    </span>{" "}
                    can be further developed by taking a more proactive approach
                    to innovation. While he performs well in structured
                    settings, challenging the status quo, seeking creative
                    solutions.
                  </p>
                  <p>
                    Finally, enhancing his ability to{" "}
                    <span className='text-[10px] leading-[18px] font-semibold'>
                      Lead
                    </span>{" "}
                    From Any Position will help him make a stronger impact
                    beyond his current responsibilities. Taking initiative,
                    influencing team members positively, and stepping up in key
                    moments.
                  </p> */}
                </div>
              </div>
              <div className='w-full p-4 break-before-page'>
                <div className='font-bold text-[10px] leading-[20px] text-[#404040] border-b border-[#BEC8D0] pb-1 mb-4'>
                  Recommendations
                </div>
                <div className='flex flex-col gap-4 text-[10px] leading-[18px] text-[#404040]'>
                  <div className=''>
                    <p className='text-[10px] leading-[18px] font-semibold uppercase'>
                      30 Days plan :{" "}
                    </p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          SingleReportData?.reportData?.recommendations?.day30,
                      }}
                    ></div>
                  </div>
                  <div>
                    <p className='text-[10px] leading-[18px] font-semibold uppercase'>
                      60 Days plan :{" "}
                    </p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          SingleReportData?.reportData?.recommendations?.day60,
                      }}
                    ></div>
                  </div>
                  <div>
                    <p className='text-[10px] leading-[18px] font-semibold uppercase'>
                      90 Days plan :{" "}
                    </p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          SingleReportData?.reportData?.recommendations?.day90,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CbiReportUIPage;
