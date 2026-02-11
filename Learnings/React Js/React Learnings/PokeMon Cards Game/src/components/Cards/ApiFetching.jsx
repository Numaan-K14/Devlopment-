//this code for practice only how to fetch api with the help of url , url have bunches of data and you want to display each and every array to display on browser.

import { useEffect, useState } from "react";

const API = "https://pokeapi.co/api/v2/pokemon?limit=24";
export function ApiFetching() {
  const [apiResponse, setApiResponse] = useState([]);
  useEffect(() => {
    const ApiFetchData = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();
        // console.log(data);

        const result = data.results.map(async (currentData) => {
          const newData = await fetch(currentData.url);
          const singleRes = await newData.json();
          return singleRes;
        });

        const SingleData = await Promise.all(result);
        console.log(SingleData);
        setApiResponse(SingleData);
      } catch (error) {
        console.log(error);
      }
    };
    ApiFetchData();
  }, []);

  return (
    <>
      <div>
        {apiResponse.map((current) => {
          return <p key={current.id}>{current.name}</p>;
        })}
      </div>
    </>
  );
}
