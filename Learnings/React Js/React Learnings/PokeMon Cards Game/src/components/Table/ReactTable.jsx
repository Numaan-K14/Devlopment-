import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

export function ReactTable({ data, columns, limit, setLimit }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const [sorting, setSorting] = useState([]); // can set initial sorting state here

  const table = useReactTable({
    data,
    columns,
    isMultiSortEvent: () => true, // normal click triggers multi-sorting
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // provide a sorting row model
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    sortDescFirst: true,
    state: {
      pagination,
      sorting,
    },
  });

  // console.log(
  //   table.getState().sorting,
  //   "<--------- console.log(table.getState().sorting)"
  // );

  return (
    <div className="w-[90%] mx-auto border border-gray-200 rounded-lg overflow-y">
      <table className="w-full">
        <thead className="sticky top-0 bg-gray-200 text-gray-800 ">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-gray-300">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="py-3 px-5 text-sm md:text-base font-semibold text-center bg-gray-100 cursor-pointer select-none"
                >
                  <div className="flex items-center justify-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {/* Sort direction indicator */}
                    {{
                      asc: "🔼",
                      desc: "🔽",
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="text-gray-700 font-medium text-sm md:text-base">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-3 px-5 border-b border-gray-200 text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 sticky bottom-0 bg-gray-200 p-2">
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 bg-gray-200 text-gray-700 font-bold text-xl rounded-md disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 bg-gray-200 text-gray-700 font-bold text-xl rounded-md disabled:opacity-50"
        >
          {"<"}
        </button>

        <span className="text-gray-700 font-semibold my-2">
          Page{" "}
          <span className="text-black font-bold">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          {/* of {table.getPageCount()} */}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 bg-gray-200 text-gray-700 font-bold text-xl rounded-md disabled:opacity-50"
        >
          {">"}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 bg-gray-200 text-gray-700 font-bold text-xl rounded-md disabled:opacity-40"
        >
          {">>"}
        </button>

        <select
          className="font-semibold text-gray-700 bg-white border border-gray-300 rounded-md"
          value={limit}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            setLimit(newSize);
            table.setPageSize(newSize);
            localStorage.setItem("pageSize", newSize);
          }}
        >
          {[5, 10, 25, 50, 75, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
