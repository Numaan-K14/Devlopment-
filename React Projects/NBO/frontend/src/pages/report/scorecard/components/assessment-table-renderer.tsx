import { PageHeading } from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Score {
  [assessorName: string]: string | number;
}

interface Row {
  competency: string;
  scores: Score[];
}

interface Section {
  section: string;
  rows: Row[];
}

const AssessmentTableRenderer = ({ data }: { data: Section[] }) => {
  return (
    <>
      {data.map((section, sectionIndex) => {
        const competencies = section.rows.map((r) => r.competency);
        const assessorNames =
          section?.rows?.[0]?.scores?.map((s) => Object.keys(s)[0]) ?? [];

        return (
          <div key={sectionIndex} className='!mb-10'>
            <PageHeading variant='secondary'>{section.section}</PageHeading>
            <Table className='border overflow-x-scroll text-sm'>
              <TableHeader>
                <TableRow className='bg-[#EFF4FF] h-[60px] text-[#5F6D7E] text-sm font-medium'>
                  <TableHead className='border text-center'>Assessor</TableHead>
                  {competencies.map((competency, index) => (
                    <TableHead key={index} className='border text-center'>
                      {competency}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessorNames.map((assessor, assessorIndex) => (
                  <TableRow
                    key={assessorIndex}
                    className='text-center overflow-x-scroll h-[60px]'
                  >
                    <TableCell className='border !min-w-[200px] font-medium'>
                      {assessor}
                    </TableCell>
                    {section.rows.map((row, rowIndex) => {
                      const scoreObj = row.scores.find(
                        (s) => Object.keys(s)[0] === assessor,
                      );
                      return (
                        <TableCell
                          key={rowIndex}
                          className='!min-w-[200px]  border'
                        >
                          {scoreObj ? scoreObj[assessor] : "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </>
  );
};

export default AssessmentTableRenderer;
