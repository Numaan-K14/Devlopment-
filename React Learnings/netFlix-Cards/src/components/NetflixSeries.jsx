import seriesData from "../api/seriesData.json";
import { Cards } from "../components/Cards.jsx";

export const NetflixSeries = () => {
  return (
    <ul
      className="grid grid-cols-3 gap-4 ">
      {seriesData.map((item) => (
        <Cards key={item.id} data={item} />
      ))}
      ;
    </ul>
  );
};

export default NetflixSeries;
