import { Label } from "@/components";
import AppBar from "@/components/app-bar";
import { useQuery } from "@/hooks/useQuerry";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const ExpectedBehaviorsPageForLeaddershipLevel = () => {
  const { id } = useParams();

  //-------- api call ---------//
  const { data: CompetancyData } = useQuery<any>({
    queryKey: [`/competency/nbol-levels-competency/${id}`],
    select: (data: any) => data?.data?.data[0],
    enabled: true,
  });

  // Creating rows dynamically
  const rows = useMemo(() => {
    let data: (string | null)[][] = [];

    if (CompetancyData?.competencies) {
      const maxRows = CompetancyData.competencies.reduce(
        (prev: number, curr: any) =>
          curr.expected_behaviours.length > prev
            ? curr.expected_behaviours.length
            : prev,
        0,
      );

      for (let index = 0; index < maxRows; index++) {
        let compRows: (string | null)[] = [];
        for (const competency of CompetancyData.competencies) {
          compRows.push(
            competency.expected_behaviours[index]
              ? competency.expected_behaviours[index].expected_behaviour
              : null,
          );
        }
        data.push(compRows);
      }
    }
    return data;
  }, [CompetancyData]);

  return (
    <div>
      {/* <PageHeading>{CompetancyData?.leadership_level}</PageHeading> */}
      <AppBar
        title={`${CompetancyData?.leadership_level}`}
        subTitle='Expected Behaviors'
      />
      <div className='flex flex-col mt-6 gap-8'>
        <div className='flex flex-col gap-1 '>
          <Label>Description</Label>

          <span className='border p-4 w-[764px] rounded-[5px] text-[#5F6D7E] text-[13px] '>
            {CompetancyData?.description}
          </span>
        </div>
        <div className='overflow-x-auto '>
          <table className='min-w-full bg-white'>
            <thead>
              <tr className='bg-[#E0E7FF]'>
                <th
                  colSpan={CompetancyData?.competencies?.length || 1}
                  className='p-4 h-[60px] text-center text-base font-medium text-[#5F6D7E]'
                >
                  Expected Behaviors
                </th>
              </tr>
              <tr className='bg-[#E0E7FF]'>
                {CompetancyData?.competencies?.map(
                  (item: any, index: number) => (
                    <th
                      key={index}
                      className='border border-[#DAE0E6] h-[49px] p-3 text-left text-[13px] !w-[257.5px]  font-normal text-[#49556D]'
                    >
                      {item?.competency}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows?.map((row: any[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className='border border-[#DAE0E6] p-3 h-[55px] !w-[257.5px] text-[12px] text-[#5F6D7E]'
                    >
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpectedBehaviorsPageForLeaddershipLevel;
