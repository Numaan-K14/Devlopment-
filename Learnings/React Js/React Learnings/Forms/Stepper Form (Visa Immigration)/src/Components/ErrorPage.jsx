import { Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  return (
    <div className="relative w-full min-h-screen bg-linear-to-b from-blue-500 via-blue-200 to-blue-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Error Code */}
      <h1 className="text-[8rem] font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-900 via-blue-600 to-blue-400 drop-shadow-md leading-none">
        {error.status}
      </h1>

      {/* Message */}
      <h2 className="text-3xl font-semibold text-blue-600 mt-4 mb-3">
        {error.data}
      </h2>
      <p className="text-gray-700 text-lg max-w-lg mx-auto leading-relaxed">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
        Please check the URL or return to the{" "}
        <Link to="/" className="text-blue-600 underline cursor-pointer">
          Homepage.
        </Link>
      </p>

      {/* Decorative line */}
      <div className="mt-8 mx-auto h-[3px] w-0 bg-blue-900 rounded-full animate-[expandLine_1s_ease-in-out_forwards]"></div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes expandLine {
            from { width: 0; }
            to { width: 200px; }
          }
        `}
      </style>
    </div>
  );
}
