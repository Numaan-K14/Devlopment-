import { useEffect, useState } from "react";
import "../Cards/pokemon.css"
const URL = "https://pokeapi.co/api/v2/pokemon/squirtle";
export function AsyncAwait() {
  const [api, setApi] = useState(null);

  //function for fetching api

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setApi(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(api);
  return (
    <div>
      {/* <section className="container">
        <header>
          <h1> Lets Catch Pokémon</h1>
        </header>
        <ul className="card-demo">
          <li className="pokemon-card">
            <figure>
              <img
                src={api?.sprites.other.dream_world.front_default}
                alt={api?.name}
                className="api-image"
              />
            </figure>
            <h1>{api?.name}</h1>
            <button className="cross">Gross Position</button>
          </li>
        </ul>
      </section> */}
    </div>
  );
}
