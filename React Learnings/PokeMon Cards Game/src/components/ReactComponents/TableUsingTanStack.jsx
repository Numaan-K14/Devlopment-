import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { RiLoader5Fill } from "react-icons/ri";

const LIMIT = 10;

export function TableUsingTanStack() {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  const API = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`;

  // ✅ Fetch Data using async/await
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const response = await fetch(API);
        const data = await response.json();

        // Fetch detailed Pokémon data
        const details = await Promise.all(
          data.results.map(async (current) => {
            const res = await fetch(current.url);
            const single = await res.json();
            return single;
          })
        );
        console.log(details);
        // Add Sr No. dynamically
        const updatedData = details.map((pokemon, index) => ({
          srNo: index + 1 + offset,
          image: pokemon.sprites?.front_default,
          name: pokemon.name,
          type: pokemon.types[0]?.type.name,
          height: pokemon.height,
          weight: pokemon.weight,
          speed: pokemon.stats[5]?.base_stat,
          experience: pokemon.base_experience,
          attack: pokemon.stats[1]?.base_stat,
          abilities: pokemon.abilities.map((a) => a.ability.name).join(", "),
        }));

        setData(updatedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setDataLoading(false);
      }
    };

    fetchData();
  }, [API, offset]);

  // ✅ Define columns for Tanstack Table
  const columns = [
    { accessorKey: "srNo", header: "Sr No." },
    {
      accessorKey: "image",
      header: "Image",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="pokemon"
          className="w-20 h-20 object-contain"
        />
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "height", header: "Height" },
    { accessorKey: "weight", header: "Weight" },
    { accessorKey: "speed", header: "Speed" },
    { accessorKey: "experience", header: "Experience" },
    { accessorKey: "attack", header: "Attack" },
    { accessorKey: "abilities", header: "Abilities" },
  ];

  // ✅ Initialize Tanstack table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ✅ Loading & Error States
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
        <p className="font-medium text-3xl">Error: {error}</p>
      </div>
    );
  }

  // ✅ Filter data by search term
  const filteredData = data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Render Table
  return (
    <section className="max-w-[1520px] m-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10">
        Pokémon Table (TanStack)
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:border-green-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-between items-center gap-4 my-6">
        <button
          className="text-white text-xl px-6 py-3 bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setOffset((prev) => Math.max(prev - LIMIT, 0))}
          disabled={dataLoading || offset === 0}
        >
          Previous
        </button>

        <button
          className="text-white text-xl px-6 py-3 bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setOffset((prev) => prev + LIMIT)}
          disabled={dataLoading}
        >
          Next
        </button>
      </div>

      {/* Table */}
      {dataLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <RiLoader5Fill className="animate-spin text-7xl text-[#27262680]" />
        </div>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-2xl font-semibold text-gray-600 mt-10">
          No Pokémon found
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-green-600 text-white">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="py-3 px-4">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border border-gray-300 hover:bg-green-100 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
