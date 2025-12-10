import { useLoaderData } from "react-router-dom";
import { Card } from "./Card";

export function Movies() {
  const MoviesData = useLoaderData();
  console.log("MoviesData :", MoviesData,);
  return (
    <div className="p-10">
      
      <ul className="min-h-screen grid grid-cols-4 gap-4 ">
        {MoviesData.Search.map((Current) => {
          return <Card key={Current.imdbID} data={Current} />;
        })}
      </ul>
    </div>
  );
}
