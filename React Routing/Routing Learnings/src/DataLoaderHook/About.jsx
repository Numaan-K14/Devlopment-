export const About = () => {
  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-green-800 mb-4">About Us</h1>
      <p className="text-gray-700 text-lg max-w-md text-center">
        We are passionate developers building clean and responsive web
        applications using React and Tailwind CSS.
      </p>
      <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition">
        Learn More
      </button>
    </div>
  );
};
