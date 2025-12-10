import { useEffect, useState } from "react";
import "./pokemon.css";
import { PokemonCards } from "./PokemonCards";
import { RiLoader5Fill } from "react-icons/ri";

export function Pokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dataLoading, setDataLoading] = useState(false);  
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const API = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;  

  // ---------------------------Functionality starts here -------------------------------|

  useEffect(() => {
    console.log("limit", 5);
    console.log("offset", offset);
    // console.log(setLimit);
    const fetchingData = async () => {
      try {
        // ----------here we got all the data but we want single data of each card-------------|

        setDataLoading(true);
        const response = await fetch(API);
        const data = await response.json();

        // --------------------------------------------------------------------|

        //SingleDataFetch gives data in promises because im using ResponseDetails with promises -----|
        const SingleDataFetch = data.results.map(async (current) => {
          const result = await fetch(current.url);
          const SingleData = await result.json();
          return SingleData;
        });
        const ResponseDetail = await Promise.all(SingleDataFetch);
        // console.log(ResponseDetail);
        setPokemon(ResponseDetail);
        setLoading(false);
        setDataLoading(false);

        // ---------------------------Throwing Error---------------------------------------|
      } catch (error) {
        // console.log(error);
        setLoading(false);
        setError(error);
      }
    };
    fetchingData();
  }, [API, offset]);

  //----------------------------------next------------------------|
  // const HandleChange = (Next) => {
  //   if (Next) {
  //     setOffset(offset + 100);
  //   } else {
  //     setOffset(offset - 100);
  //   }
  // };
  // --------------------------------Search------------------------------------|

  const searchData = pokemon.filter((abc) =>
    abc.name.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------------Loader------------------------------------|
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RiLoader5Fill className="animate-spin text-9xl text-[#27262680]" />
      </div>
    );
  }

  //-----------------error-----------|
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-900">
        <p className="font-medium text-3xl ">SyntaxError : {error.message}</p>
      </div>
    );
  }
  // -------------------------Functionality-Ends-Here--------------------------------------|

  return (
    <div>
      <section className="container">
        <h1> Let's Catch Pokemon </h1>
        <div className="flex justify-between items-center gap-4">
          <button
            className="text-white text-2xl font-normal !px-6 !py-6 bg-green-600 rounded-2xl cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            onClick={() => setOffset(offset - limit)}
            disabled={dataLoading || offset === 1}
          >
            Previous
          </button>

          <button
            className="text-white text-2xl !font-medium !px-6 !py-6 bg-green-600 rounded-2xl cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            onClick={() => setOffset(offset + limit)}
            disabled={dataLoading || offset === 100}
          >
            Next
          </button>
        </div>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {dataLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <RiLoader5Fill className="animate-spin text-9xl text-[#27262680]" />
          </div>
        ) : (
          <ul className="cards">
            {searchData.length === 0 ? (
              <p className="text-center text-2xl font-semibold text-gray-600">
                No data found
              </p>
            ) : (
              searchData.map((currentPokemon) => (
                <PokemonCards
                  key={currentPokemon.id}
                  pokData={currentPokemon}
                />  
              ))
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
