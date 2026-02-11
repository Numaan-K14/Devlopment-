import { Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();
  // console.log(error);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-medium text-gray-700 mb-2">
        {error.status}
      </h1>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {error.error.message}
      </h2>

      <p className="text-gray-600 max-w-md mb-6">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
        Please check the URL or return to the{" "}
        <Link to="/" className=" text-blue-500 underline">
          HomePage
        </Link>
      </p>
    </div>
  );
}
