import { Link } from "react-router-dom";

export function Card({ data }) {
  const { Poster, Title, Type, Year, imdbID } = data;

  return (
    <div> 
      
        <section className="relative w-[300px] rounded-2xl overflow-hidden shadow-2xl mb-19">
          <div className="relative w-full h-[400px] overflow-hidden">
            <img
              src={Poster}
              alt={Title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {Year}
            </span>
          </div>

          {/* Movie Info */}
          <div className="p-4 flex flex-col justify-between h-[180px]">
            <h1 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
              {Title}
            </h1>
            <div className="text-sm text-gray-600 mb-2">
              <p className="capitalize">
                <span className="font-semibold text-gray-800">Type:</span>{" "}
                {Type}
              </p>
              <p>
                <span className="font-semibold text-gray-800">IMDb ID:</span>{" "}
                {imdbID}
              </p>
            </div>

            {/* Watch Button */}
            <Link
              to={`/Movies/${imdbID}`}
              className="mt-3 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 text-center"
            >
              View Details
            </Link>
          </div>
        </section>
      
    </div>
  );
}
