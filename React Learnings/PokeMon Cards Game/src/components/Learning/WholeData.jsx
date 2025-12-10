import { useEffect } from "react";

const API = "https://pokeapi.co/api/v2/pokemon?limit=1302";

export function WholeData() {
  useEffect(() => {
    const ApiFetchData = async () => {
      try {
        const result = await fetch(API);
        const data = await result.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    ApiFetchData();
  }, []);

  return (
    <>
      <h1>Api Data</h1>
    </>
  );
}
