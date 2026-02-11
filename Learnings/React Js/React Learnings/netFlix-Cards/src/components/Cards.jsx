export const Cards = ({ data }) => {
  const { id, name, img_url, rating, description, cast, genre, watch_url } =
    data;

    return (
    <li className="shadow-[0_0_15px_rgba(255,255,255,0.7)]  w-[300px] mb-8 bg-white">
      <img src={img_url} alt={id} className="w-full h-auto " />
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-2">Name: {name}</h2>
        <h3 className=" font-semibold mb-2">Ratings: {rating}</h3>
        <p className="mb-2 text-[#1e1d1c]">Description: {description}</p>
        <p className="mb-2 text-[#1e1d1c]">Genre: {genre}</p>
        <p className="mb-3 text-[#1e1d1c]">Cast: {cast}</p>
        <a href={watch_url} rel="no referrer" target="_blank">
          <button
            className="block bg-red-600 text-white px-5 py-2 rounded-2xl  
                   hover:translate-y-[2px] transition-transform"
          >
            Watch Now
          </button>
        </a>
      </div>
    </li>
  );
};


