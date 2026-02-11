import { useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { TableComponent } from "./TableComponent";
import { IoMdSearch } from "react-icons/io";

export function PokTable() {
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
    <section className="max-w-[1520px] m-auto px-6 py-10 bg-green-50 h-[100vh]">
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

      <div className=" flex justify-center mb-10 relative">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none  focus:border-green-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IoMdSearch className="absolute w-8 h-8 text-gray-500 ml-[25rem] my-2" />
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
        <table className="w-full text-left m-auto shadow-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 font-bold text-xl">Sr No.</th>
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
            {searchData.map((currentPokemon) => (
              <TableComponent
                key={currentPokemon.id}
                pokData={currentPokemon}
                abc={currentPokemon.id}
              />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
