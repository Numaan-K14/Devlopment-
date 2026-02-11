import { axios } from "@/config/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  Table as TableInterface,
  useReactTable,
} from "@tanstack/react-table";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Search,
} from "lucide-react";
import React, { ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "../pagination";
import { cn } from "@/lib/utils";
import CustomInput from "@/components/inputs/custom-input";
import { Separator } from "../separator";
import CustomButton from "@/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Skeleton } from "../skeleton";
import { ResponseInterface } from "@/interfaces/base";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  url: string;
  getTableData?: (data: any) => any;
  actionButton?: ReactNode;
}

const SkeletonRows = ({ columns }: any) => {
  return Array(10)
    .fill("Dummy")
    .map((row, index) => (
      <TableRow key={row + index}>
        {columns.map((column: any) => (
          <TableCell
            key={row + column.accessorKey}
            className="p-3 text-gray-600"
          >
            <Skeleton className="w-[90%] h-5" />
          </TableCell>
        ))}
      </TableRow>
    ));
};

function PaginationComponent({
  currentPage,
  totalPages,
  table,
}: {
  table: TableInterface<any>;
  totalPages: number;
  currentPage: number;
}) {
  const pageNumbers = [];
  const maxVisibleButtons = 3;

  // Calculate the range of pages to display
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const canPreviousPage = currentPage !== 0;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          onClick={() => table.firstPage()}
          className={cn(
            "border border-gray-100 rounded-lg cursor-pointer text-gray-500",
            {
              "cursor-default opacity-50 hover:text-gray-500": !canPreviousPage,
            }
          )}
        >
          <PaginationLink
            className={cn(
              "hover:text-secondary-dark hover:bg-secondary-light text-gray-500",
              !canPreviousPage && "hover:text-inherit hover:bg-inherit"
            )}
          >
            <ChevronsLeft />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem
          onClick={() => table.getCanPreviousPage() && table.previousPage()}
          className={cn(
            "border border-gray-100 rounded-lg cursor-pointer text-gray-500",
            {
              "cursor-default opacity-50 hover:text-gray-500": !canPreviousPage,
            }
          )}
        >
          <PaginationLink
            className={cn(
              "hover:text-secondary-dark hover:bg-secondary-light text-gray-500",
              !canPreviousPage && "hover:text-inherit hover:bg-inherit"
            )}
          >
            <ChevronLeft />
          </PaginationLink>
        </PaginationItem>
        {currentPage >= 3 && (
          <>
            <PaginationItem
              onClick={() => table.firstPage()}
              className={cn(
                "border border-gray-100 rounded-lg cursor-pointer",
                {
                  "bg-secondary-light": 0 === currentPage,
                }
              )}
            >
              <PaginationLink
                className={cn(
                  "hover:text-secondary-dark hover:bg-secondary-light text-gray-500",
                  {
                    "text-secondary-dark hover:text-secondary-dark":
                      currentPage === 0,
                  }
                )}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="text-gray-500" />
            </PaginationItem>
          </>
        )}
        {pageNumbers.map((page) => (
          <PaginationItem
            key={page}
            onClick={() => table.setPageIndex(page - 1)}
            className={cn("border border-gray-100 rounded-lg cursor-pointer", {
              "bg-secondary-light": page - 1 === currentPage,
            })}
          >
            <PaginationLink
              className={cn(
                "hover:text-secondary-dark hover:bg-secondary-light text-gray-500",
                {
                  "text-secondary-dark hover:text-secondary-dark":
                    page - 1 === currentPage,
                }
              )}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis className="text-gray-500" />
            </PaginationItem>
            <PaginationItem
              onClick={() => table.lastPage()}
              className={cn(
                "border border-gray-100 rounded-lg cursor-pointer",
                {
                  "bg-secondary-light": totalPages === currentPage,
                }
              )}
            >
              <PaginationLink
                className={cn(
                  "hover:text-secondary-dark hover:bg-secondary-light text-gray-500",
                  {
                    "text-secondary-dark hover:text-secondary-dark":
                      totalPages === currentPage,
                  }
                )}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem
          className={cn(
            "border border-gray-100 rounded-lg cursor-pointer text-gray-500",
            {
              "cursor-default opacity-50 hover:text-gray-500":
                currentPage === totalPages,
            }
          )}
        >
          <PaginationLink
            onClick={() => table.getCanNextPage() && table.nextPage()}
            className={cn(
              "hover:text-secondary-dark hover:bg-secondary-light text-gray-500",
              currentPage === totalPages &&
                "hover:text-inherit hover:bg-inherit"
            )}
          >
            <ChevronRight />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem
          className={cn(
            "border border-gray-100 rounded-lg cursor-pointer text-gray-500",
            {
              "cursor-default opacity-50 hover:text-gray-500":
                currentPage === totalPages,
            }
          )}
        >
          <PaginationLink
            onClick={() => table.lastPage()}
            className={cn(
              "hover:text-secondary-dark hover:bg-secondary-light text-gray-500",
              currentPage === totalPages &&
                "hover:text-inherit hover:bg-inherit"
            )}
          >
            <ChevronsRight />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  url,
  getTableData,
  actionButton,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    data: tableData,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [url, pagination],
    queryFn: async () => {
      const response = await axios.get<ResponseInterface<TData[]>>(url, {
        params: pagination,
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    select: (data: ResponseInterface<TData[]>) => {
      return getTableData ? getTableData(data) : data;
    },
  });

  const table = useReactTable({
    data: tableData?.data || data,
    columns,
    state: {
      pagination,
    },
    rowCount:
      tableData?.data && !tableData?.count
        ? tableData?.data?.length
        : (tableData?.data && tableData?.count) || data?.length,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  const pages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const { pagination: tablePagination } = table.getState();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-stretch h-9 justify-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            {/* <CustomInput
              name="customField"
              value={someValue}
              onChange={handleChange}
            /> */}
          </div>
          <Separator orientation="vertical" className="!h-full" />
          <CustomButton variant="outline" className="gap-2 text-secondary-dark">
            <Filter className="h-4 w-4" />
            Apply Filter
          </CustomButton>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-r-white border-r-2 bg-secondary-light border-b border-b-secondary-dark px-3 py-[14px] text-gray-800 font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading || isRefetching ? (
              <SkeletonRows columns={columns} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3 text-gray-600">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      ) || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <div className="flex justify-center items-center flex-col">
                    <img src="/icons/empty-state.svg" className="h-[200px]" />
                    <h4 className="text-gray-700 font-semibold text-lg text-center mt-5">
                      No Data
                    </h4>
                    <p className="text-base text-gray-500 text-center">
                      There is no data to show you right now
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex justify-start items-center h-4">
          <div className="text-sm text-[#A8A8A8]">
            Showing {tablePagination.pageIndex * tablePagination.pageSize + 1}{" "}
            to{" "}
            {tablePagination.pageIndex * tablePagination.pageSize +
              tablePagination.pageSize}{" "}
            of {table.getRowCount().toLocaleString()} entries
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PaginationComponent
            currentPage={currentPage}
            table={table}
            totalPages={pages}
          />
        </div>
      </div>
    </div>
  );
}
