HowToFetchApi.jsx

import { useEffect, useState } from "react";
import "./pokemon.css";

const API = "https://pokeapi.co/api/v2/pokemon"; //API url
export function HowToFetchApi() {
const [api, setApi] = useState(null);

useEffect(() => {
fetch(API)
.then((res) => res.json())
.then((data) => setApi(data))
.catch((error) => console.log(error));
}, []);

console.log(api); //print data in console (now data in "api")

return (
<>

<div className="container effect-container">
<h1> Name : {api?.name}</h1>
</div>
</>
);
}

// Line No.20: "<h1> Name : {api?.name}</h1>" console log is js function then its call before useEffect se we add "?" means if api get data then show in console.

setInterval(() => { if (loading) {
return <AiOutlineLoading3Quarters />; }}, 2000);

|-----------PokemonTable.jsx [using html table]----------------|

import { useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { TableComponent } from "./TableComponent";

const data = [
{ id: 1, name: "Ada" },
{ id: 2, name: "qqq" },
{ id: 3, name: "daaa" },
{ id: 4, name: "www" },
{ id: 5, name: "eee" },
];
const columns = [
{ accessorKey: "name", header: "Name1" },
{ accessorKey: "name", header: "Name2" },
{ accessorKey: "name", header: "Name3" },
{ accessorKey: "name", header: "Name4" },
{ accessorKey: "name", header: "Name5" },
];
export function PokemonTable() {
const [pokemon, setPokemon] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [search, setSearch] = useState("");
const [dataLoading, setDataLoading] = useState(false);
const [offset, setOffset] = useState(0);
const [limit] = useState(20);
const API = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

useEffect(() => {
console.log(limit, "Limit");
console.log(offset, "offset");
const fetchingData = async () => {
try {
setDataLoading(true);
const response = await fetch(API);
const data = await response.json();

        const details = await Promise.all(
          data.results.map(async (current) => {
            const res = await fetch(current.url);
            const single = await res.json();
            return single;
          })
        );
        // console.log(details);
        setPokemon(details);
        setLoading(false);
        setDataLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        setDataLoading(false);
      }
    };
    fetchingData();

}, [API, offset, limit]);

const searchData = pokemon.filter((abc) =>
abc.name.toLowerCase().includes(search.toLowerCase())
);

if (loading) {
return (

<div className="flex justify-center items-center min-h-screen">
<RiLoader5Fill className="animate-spin text-9xl text-[#27262680]" />
</div>
);
}

if (error) {
return (

<div className="flex justify-center items-center min-h-screen text-gray-900">
<p className="font-medium text-3xl">SyntaxError: {error.message}</p>
</div>
);
}

return (

<section className="max-w-[1520px] m-auto px-6 py-10">
<h1 className="text-4xl font-extrabold text-center text-green-700 mb-10">
Let's Catch Pokémon!
</h1>

      <div className="flex justify-between items-center gap-4 my-6">
        <button
          className="text-white text-xl px-6 py-3 bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          disabled={dataLoading || offset === 0}
        >
          Previous
        </button>

        <button
          className="text-white text-xl px-6 py-3 bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setOffset((prev) => prev + limit)}
          disabled={dataLoading}
        >
          Next
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none  focus:border-green-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {dataLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <RiLoader5Fill className="animate-spin text-7xl text-[#27262680]" />
        </div>
      ) : searchData.length === 0 ? (
        <p className="text-center text-2xl font-semibold text-gray-600 mt-10">
          No data found
        </p>
      ) : (
        <div className=" shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 ">Sr No.</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Height</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Attack</th>
                <th className="py-3 px-4">Abilities</th>
              </tr>
            </thead>
            <tbody className="bg-white ">
              {searchData.map((currentPokemon, index) => (
                <TableComponent
                  key={currentPokemon.id}
                  pokData={currentPokemon}
                  index={index + 1 + offset}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>

);
}

----------------Pokemon Table Using React TABLE Components------------|

import { useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { ReactTable } from "./ReactTable";

const data = [
{ id: 1, name: "Ada" },
{ id: 2, name: "qqq" },
{ id: 3, name: "dak" },
{ id: 4, name: "www" },
{ id: 5, name: "eee" },
];
const columns = [
{ accessorKey: "n0", header: "Sr No." },
{ accessorKey: "image", header: "Image" },
{ accessorKey: "name", header: "Name" },
{ accessorKey: "type", header: "Type" },
{ accessorKey: "height", header: "Height" },
{ accessorKey: "name", header: "Weight" },
{ accessorKey: "name", header: "Speed" },
{ accessorKey: "name", header: "Experience" },
{ accessorKey: "name", header: "Attack" },
{ accessorKey: "name", header: "Abilities" },
];
export function PokemonTable() {
const [pokemon, setPokemon] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [search, setSearch] = useState("");
const [dataLoading, setDataLoading] = useState(false);
const [offset, setOffset] = useState(0);
const [limit] = useState(20);
const API = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

useEffect(() => {
console.log(limit, "Limit");
console.log(offset, "offset");
const fetchingData = async () => {
try {
setDataLoading(true);
const response = await fetch(API);
const data = await response.json();

        const details = await Promise.all(
          data.results.map(async (current) => {
            const res = await fetch(current.url);
            const single = await res.json();
            return single;
          })
        );
        // console.log(details);
        setPokemon(details);
        setLoading(false);
        setDataLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        setDataLoading(false);
      }
    };
    fetchingData();

}, [API, offset, limit]);

const searchData = pokemon.filter((abc) =>
abc.name.toLowerCase().includes(search.toLowerCase())
);

if (loading) {
return (

<div className="flex justify-center items-center min-h-screen">
<RiLoader5Fill className="animate-spin text-9xl text-[#27262680]" />
</div>
);
}

if (error) {
return (

<div className="flex justify-center items-center min-h-screen text-gray-900">
<p className="font-medium text-3xl">SyntaxError: {error.message}</p>
</div>
);
}

return (

<section className="max-w-[1520px] m-auto px-6 py-10">
<h1 className="text-4xl font-extrabold text-center text-green-700 mb-10">
Let's Catch Pokémon!
</h1>

      <div className="flex justify-between items-center gap-4 my-6">
        <button
          className="text-white text-xl px-6 py-3 bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          disabled={dataLoading || offset === 0}
        >
          Previous
        </button>

        <button
          className="text-white text-xl px-6 py-3 bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setOffset((prev) => prev + limit)}
          disabled={dataLoading}
        >
          Next
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none  focus:border-green-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {dataLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <RiLoader5Fill className="animate-spin text-7xl text-[#27262680]" />
        </div>
      ) : searchData.length === 0 ? (
        <p className="text-center text-2xl font-semibold text-gray-600 mt-10">
          No data found
        </p>
      ) : (
        <ReactTable columns={columns} data={data} />
      )}
    </section>

);
}

{/_ ------------Buttons Next Previous---------------------| _/}
{/\* <div className="flex justify-between items-center gap-4 my-6">
<button
className="text-xs font-bold px-3 py-2 bg-gray-300 rounded-xl shadow-md hover:bg-[#EDEDED] transition disabled:opacity-30 disabled:cursor-not-allowed"
onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
disabled={dataLoading || offset === 0} >
Previous
</button>

        <button
          className=" text-xs font-bold px-3 py-2  bg-gray-300 rounded-xl shadow-md hover:bg-[#EDEDED] transition disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setOffset((prev) => prev + limit)}
          disabled={dataLoading || offset === 1300}
        >
          Next
        </button>
      </div> */}
      {/* -------------------------------------- */}

-------------reactTable.jsx-----------------------------------------------------

import {
useReactTable,
getCoreRowModel,
flexRender,
getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
const savedPageSize = Number(localStorage.getItem("pageSize")) || 5;
export function ReactTable({ data, columns }) {
const [pagination, setPagination] = useState({
pageIndex: 0,
pageSize: savedPageSize,
});
const table = useReactTable({
data,
columns,
getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },

});

return (
<div className="overflow-y-auto max-h-[500px]">
<table className="w-[90%] mx-auto shadow-md text-center mb-10">
<thead className="sticky top-0">
{table.getHeaderGroups().map((hg) => (
<tr key={hg.id}>
{hg.headers.map((header) => (
<th
                  key={header.id}
                  className="py-[14px] px-[20px] flex-1 bg-[#EDEDED] text-md font-semibold"
                >
{flexRender(
header.column.columnDef.header,
header.getContext()
)}
</th>
))}
</tr>
))}
</thead>
<tbody className="text-gray-800 font-semibold text-md leading-[100%] ">
{table.getRowModel().rows.map((row) => (
<tr key={row.id}>
{row.getVisibleCells().map((cell) => (
<td key={cell.id}>
{flexRender(cell.column.columnDef.cell, cell.getContext())}
</td>
))}
</tr>
))}
</tbody>
</table>
<div className="flex justify-center">
<button
onClick={() => table.firstPage()}
disabled={!table.getCanPreviousPage()}
className="text-xl text-gray-600 font-bold" >
{"<<"}
</button>
<button
onClick={() => table.previousPage()}
disabled={!table.getCanPreviousPage()}
className="text-xl text-gray-600 font-bold" >
{"<"}
</button>
<span className="mx-4">
Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
{table.getPageCount()}
</span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-xl text-gray-600 font-bold"
        >
          {">"}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          className="text-xl text-gray-600 font-bold"
        >
          {">>"}
        </button>
        <select
          className="font-bold text-lg text-gray-600 mx-2"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 25, 50, 75, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>

);
}
