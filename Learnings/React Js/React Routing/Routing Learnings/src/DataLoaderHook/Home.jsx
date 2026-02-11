import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const GetStartedHandle = () => {
    navigate("/Movies");
  };
  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
        Welcome Home
      </h1>
      <p className="text-gray-700 text-lg max-w-md text-center">
        This is your Home Page. Explore, learn, and create beautiful web apps
        with React!
      </p>
      <button
        onClick={GetStartedHandle}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
};
