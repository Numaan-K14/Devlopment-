import NetflixSeries from "./components/NetflixSeries";
import "./components/netFlix.css";

export const App = () => {
  return (
    <section className="max-w-[150rem]  px-20 bg-black/90">
      <h1 className="card-heading">BEST SERIES OF NETFLIX</h1>

      <NetflixSeries />
    </section>
  );
};  
