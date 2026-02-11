import { useEffect, useState } from "react";

export function HowToFetchApi() {
  const [api, setApi] = useState(null);

  const API = "https://pokeapi.co/api/v2/pokemon/squirtle";

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setApi(data))
      .catch((error) => console.log(error));
  }, []);

  console.log(api);

  return (
    <div>
      <div className="container effect-container">
        <h1>Name :{api?.order}</h1>
      </div>
    </div>
  );
}
