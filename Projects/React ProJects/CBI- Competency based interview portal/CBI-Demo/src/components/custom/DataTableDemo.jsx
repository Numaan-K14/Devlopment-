import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Eye } from "lucide-react";

export function DataTableDemo({
  data,
  columns,
  count,
  getStatusBadge = () => null,
  renderStars = () => null,
}) {
  return (
    <>
      <div className="max-h-[400px] overflow-y-auto">
        <Table className="w-full ">
          <TableHeader className="bg-[#F9FAFB] border-b border-[#EAECF0] text-left sticky top-0">
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
                      {col?.render ? col?.render?.(row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center bg-white sticky bottom-0 py-3.25 px-6">
          <span className="text-[#A8A8A8]">
            Showing 1 to 10 of {count} entries
          </span>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="hover:bg-[#D8E7FC] hover:text-blue-800 text-[#717680]"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
