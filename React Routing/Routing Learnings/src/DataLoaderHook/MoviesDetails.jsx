import { Link, useLoaderData } from "react-router-dom";

export function MoviesDetails() {
  const MoviesDetails = useLoaderData();
  console.log(MoviesDetails, ">>>>>>>>>>>>>>>");
  const {
    Title,
    Year,
    Rated,
    Runtime,
    Genre,
    Director,
    Writer,
    Actors,
    Plot,
    Awards,
    Poster,
    imdbRating,
    BoxOffice,
  } = MoviesDetails;
  return (
    <div className="max-w-4xl mx-10 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 mt-10 flex flex-row transition-transform hover:scale-[1.02]">
      {/* Poster Section */}
      <div className="w-1/3">
        <img src={Poster} alt={Title} className="w-full h-full object-cover" />
      </div>

      {/* Info Section */}
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            {Title}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            {Year} • {Rated} • {Runtime}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500 text-lg font-semibold">
              ⭐ {imdbRating}
            </span>
            <span className="text-gray-400 text-sm">(IMDb)</span>
          </div>

          {/* Genre */}
          <p className="text-sm text-blue-600 font-medium mb-2">{Genre}</p>

          {/* Plot */}
          <p className="text-gray-700 leading-relaxed mb-4">{Plot}</p>

          {/* Cast and Crew */}
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Director:</span> {Director}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Writer:</span> {Writer}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Actors:</span> {Actors}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Awards:</span> {Awards}
          </p>
          <p className="text-gray-800 font-semibold">Box Office: {BoxOffice}</p>
          <Link
            to={"/Movies"}
            className="bg-blue-600 text-white font-bold text-xs p-2 rounded-xl"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
