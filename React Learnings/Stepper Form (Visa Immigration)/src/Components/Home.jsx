import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  const NextPageHandle = () => {
    navigate("/PersonalInfo");
  };
  return (
    <>
      <div className="relative w-full h-screen">
        <img
          src="Home3.jpg"
          alt="Home"
          className="absolute w-full h-full object-cover"
        />

        {/* Overlay Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black/60">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg tracking-wide">
            Your Journey Starts Here
          </h1>
          <p className="text-lg tracking-wide  backdrop-blur-xl  p-2">
            Apply for visas, check your eligibility, and track your immigration
            process — all in one secure and simple platform.
          </p>
          <button
            onClick={NextPageHandle}
            className="bg-linear-to-r from-[#1E90FF] to-[#0C4A6E] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition duration-300 ease-in-out mt-2"
          >
            Visit Now
          </button>
        </div>
      </div>  
    </>
  );
}
