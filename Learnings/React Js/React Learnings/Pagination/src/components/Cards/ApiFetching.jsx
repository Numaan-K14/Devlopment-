import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";
import { FaUserAlt } from "react-icons/fa";
import { RiLoaderFill } from "react-icons/ri";

export function ApiFetching() {
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(10);
  const [page, setPage] = useState(1);
  const API = `https://randomuser.me/api/?results=${results}&page=${page}&seed=myfixedseed`;
  useEffect(() => {
    const apiFetching = async () => {
      try {
        const response = await fetch(API);
        const data = await response.json();
        // console.log(data.results);
        setUser(data.results);
        setLoading(false);
        console.log(results, "Result/limit>>>>>>");
        console.log(page, "Page/offset>>>>>>");
        // console.log(setResults);
      } catch (error) {
        // console.log(error);
        setLoading(false);
        setError(error);
        console.log(setResults);
      }
    };
    apiFetching();
  }, [API, page, results]);

  // -----------------------Search------------------------------|
  // const SearchData = user.filter(
  //   (abc) =>
  //     abc.name.first.toLowerCase().includes(search.toLowerCase()) ||
  //     abc.name.last.toLowerCase().includes(search.toLowerCase())
  // );

  const SearchData = user.filter((abc) => {
    const FullName = `${abc.name.first} ${abc.name.last}`.toLowerCase();
    return FullName.includes(search.toLowerCase());
  });
  // --------Loading------------------------|
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
        <RiLoaderFill className="animate-spin text-4xl" />
      </div>
    );
  }
  // -------------------------Error---------------------------|
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1>Syntax Error : {error.message}</h1>
      </div>
    );
  }
  // ------------------------------------------------------------|
  return (
    <>
      <section className="max-w-[152rem] h-[100vh]  bg-gray-100 py-10">
        <h1 className="flex text-4xl font-medium text-gray-400 mx-auto justify-center ">
          <FaUserAlt className="mx-2" /> Users Profile
        </h1>
        <input
          placeholder="Search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex m-auto border-b-2 outline-none px-3 py-2 my-10"
        />
        <div className="flex justify-between items-center gap-4 my-6">
          <button
            onClick={() => setPage(page - 1)}
            className="bg-blue-500 text-white text-xl font-medium py-2 px-4 rounded-xl hover:bg-blue-400 mx-4"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-blue-500 text-white text-xl font-medium py-2 px-4 rounded-xl hover:bg-blue-400 mx-4"
          >
            Next
          </button>
        </div>

        {SearchData.length === 0 ? (
          <h1 className="mx-12 my-12 text-2xl font-medium text-gray-500">
            No data Found
          </h1>
        ) : (
          <ul className="flex flex-wrap justify-center">
            {SearchData.map((currentData) => (
              <UserCard key={currentData.login.uuid} UserInfo={currentData} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
