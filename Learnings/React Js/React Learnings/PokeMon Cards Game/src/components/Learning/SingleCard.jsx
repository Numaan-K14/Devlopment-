import { useEffect, useState } from "react";
import "../components/pokemon.css";


const API = "https://pokeapi.co/api/v2/pokemon/rattata";
export function SingleCard() {
  const [api, setApi] = useState(null);
  const [handleError, setHandleError] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setApi(data))
      .catch((error) => {
        console.log(error);
        setHandleError(error);
      });
  }, []);

  console.log(api);

  if (handleError)
    return (
      <p>
        <b>Error </b>: {handleError.message}
      </p>
    );
  return (
    <div>
      <section className="container">
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
          </li>
        </ul>
      </section>
    </div>
  );
}
