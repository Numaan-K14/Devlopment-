import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel, //  added for sorting
} from "@tanstack/react-table";
import { useState } from "react";
// import { MdAdd } from "react-icons/md";

export function TableComponentMerge({
  data,
  columns,
  // setAddData,
  // setOpen,
  // addData,
  // setSearch,
}) {
  // const [pagination, setPagination] = useState({
  //   pageIndex: 0, //initial page index
  //   pageSize: 10, //default page size
  // });

  // ✅ Added sorting state
  // import { useState } from "react";
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting, // ✅ link sorting state
    },
    onSortingChange: setSorting, // ✅ handle sort changes
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // ✅ enable sorting model
  });

  return (
    <>
      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#c9c5c5] text-gray-800 text-left sticky top-0">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-lg cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()} // ✅ make header clickable
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* ✅ show sorting direction */}
                      {{
                        asc: "▲",
                        desc: "▼",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#c9c5c5] text-left text-md font-medium hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end bg-[#c9c5c5] text-gray-800 p-3 gap-1">
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 font-extrabold text-xl rounded-md disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 font-extrabold text-xl rounded-md disabled:opacity-50"
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 font-extrabold text-xl rounded-md disabled:opacity-50"
        >
          <span className="text-gray-700 font-semibold">
            Page{" "}
            <span className="text-black font-bold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
          </span>
          {">"}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 font-extrabold text-xl rounded-md disabled:opacity-50"
        >
          {">>"}
        </button>
        <select
          className="font-semibold text-gray-700 bg-white border border-gray-600 rounded-md"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[1, 5, 10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
