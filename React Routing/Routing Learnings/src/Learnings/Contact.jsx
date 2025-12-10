export const Contact = () => {
  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center ">
      <h1 className="text-5xl font-extrabold text-pink-800 mb-4">Contact Us</h1>
      <p className="text-gray-700 text-lg max-w-md text-center mb-6">
        Have questions or feedback? We’d love to hear from you!
      </p>
      <form className="bg-white p-6 rounded-2xl shadow-lg w-80 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your Name"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <textarea
          placeholder="Message"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          rows="3"
        ></textarea>
        <button className="bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition">
          Send Message
        </button>
      </form>
    </div>
  );
};
