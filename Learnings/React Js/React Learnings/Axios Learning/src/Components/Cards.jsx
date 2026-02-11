import { FaStar } from "react-icons/fa";

export function Cards({ StoreData }) {
  const { category, description, image, price, rating, title } = StoreData;

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 
                 hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* Image Section */}
      <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
        <img src={image} alt={title} className="h-full object-contain p-4" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <span className="text-lg font-semibold text-blue-600 uppercase">
          {category}
        </span>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-sm flex gap-2 items-center">
            <FaStar /> {rating.rate}
          </span>
          <span className="text-gray-400 text-xs">
            ({rating.count} reviews)
          </span>
        </div>  

        {/* Price + Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-bold text-blue-700">${price}</span>

          <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-lg font-medium hover:bg-white hover:text-blue-800 hover:outline hover:outline-blue-600 transition duration-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
