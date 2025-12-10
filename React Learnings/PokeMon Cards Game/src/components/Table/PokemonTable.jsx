import { useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { ReactTable } from "./ReactTable";

const savePages = localStorage.getItem("pageSize");

export function PokemonTable() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dataLoading, setDataLoading] = useState(false); //data loading till response not came
  const [offset] = useState(0);
  const [limit, setLimit] = useState(savePages);

  const API = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  useEffect(() => {
    const fetchingData = async () => {
      try {
        setDataLoading(true); //data loading till response not came
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
        setDataLoading(false); //data loading till response not came
      } catch (error) {
        setError(error);
      }
    };
    fetchingData();
  }, [API, limit, offset]);

  // -------------Tables Columns and Data(tr) -----------------
  const columns = [
    {
      accessorKey: "Sr No",
      header: "Sr No.",
      cell: ({ row }) => (
        <span className="!text-start">{row.index + 1 + offset}</span>
      ),
    },

    {
      accessorKey: "Image",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.sprites?.front_default}
          alt={row.original.name}
          className="w-16 h-16"
        />
      ),
    },
    {
      accessorKey: "Name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-bold leading-1">
          {row.original.name.charAt(0).toUpperCase() +
            row.original.name.slice(1)}
        </span>
      ),
    },
    {
      accessorKey: "Type",
      header: "Type",
      cell: ({ row }) =>
        row.index % 2 === 0 ? (
          <span className="bg-[#E9F3FF] text-[#034ba1] px-2 py-1 rounded-md">
            {row.original.types[0]?.type.name}
          </span>
        ) : (
          <span className="bg-[#FFEEF3] text-[#fa2a68] px-2 py-1 rounded-md">
            {row.original.types[0]?.type.name}
          </span>
        ),
    },

    // if (row.index % 2 == 0) {
    //   return (
    //     <span className="bg-[#E9F3FF] text-[#034ba1] px-2 py-1 rounded-md">
    //       {row.original.types[0]?.type.name}
    //     </span>
    //   );
    // } else {
    //   return (
    //     <span className="bg-[#FFEEF3] text-[#fa2a68] px-2 py-1 rounded-md">
    //       {row.original.types[0]?.type.name}
    //     </span>
    //   );
    // }
    //   },
    // },

    { accessorKey: "height", header: "Height" },
    { accessorKey: "weight", header: "Weight" },
    {
      accessorKey: "Speed",
      header: "Speed",
      cell: ({ row }) => row.original.stats[5]?.base_stat,
    },
    { accessorKey: "base_experience", header: "Experience" },
    {
      accessorKey: "Attack",
      header: "Attack",
      cell: ({ row }) => row.original.stats[1]?.base_stat,
    },
    {
      header: "Abilities",
      cell: ({ row }) => (
        <div className="flex justify-start items-center gap-2 flex-wrap w-full">
          {row.index % 2 === 0
            ? row.original.abilities.map((a, index) => {
                if (index % 2 == 0) {
                  return (
                    <span
                      key={index}
                      className="bg-[#E9F3FF] text-[#034ba1] px-1 py-1 rounded-md "
                    >
                      {a.ability.name}
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={index}
                      className="bg-[#a2ec8b] text-black px-1 py-1 rounded-md "
                    >
                      {a.ability.name}
                    </span>
                  );
                }
              })
            : row.original.abilities.map((a, index) => {
                if (index % 2 == 0) {
                  return (
                    <span
                      key={index}
                      className="bg-[#ecaadc] text-[#f0f5fa] px-2 py-1 rounded-md "
                    >
                      {a.ability.name}
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={index}
                      className="bg-[#362036] text-[#f3eeeeea] px-2 py-1 rounded-md "
                    >
                      {a.ability.name}
                    </span>
                  );
                }
              })}
        </div>
      ),
    },
  ];

  // console.log(columns);

  // -----------------------------------Search---------------------------------|
  const searchData = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  // -----------------------------------Error----------------------------------------|
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RiLoader5Fill className="animate-spin text-9xl text-[#27262680] " />
      </div>
    );
  }
  // ---------------------------------Loading----------------------------------------|
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-900">
        <p className="font-medium text-3xl">Error: {error.message}</p>
      </div>
    );
  }
  // -------------------------------- Designing---------------------------------------------|
  return (
    <section className="px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-400 mb-10">
        Let's Catch Pokémon!
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="w-[50%] h-10 max-w-md border-b border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none  focus:border-gray-500"
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
        <div>
          <ReactTable
            columns={columns}
            data={searchData}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      )}
    </section>
  );
}
