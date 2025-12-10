import { useEffect, useState } from "react";

import { FaUserAlt } from "react-icons/fa";
import { RiLoaderFill } from "react-icons/ri";
import { DataTable } from "./DataTable";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { RiLoader5Fill } from "react-icons/ri";

export function UserData() {
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results] = useState(10); //limit
  const [page, setPage] = useState(1); //offset
  const API = `https://randomuser.me/api/?results=${results}&page=${page}&seed=myfixedseed`;
  useEffect(() => {
    const apiFetching = async () => {
      console.log(results, "Result/limit>>>>>>");
      console.log(page, "Page/offset>>>>>>");
      try {
        setDataLoading(true);
        const response = await fetch(API);
        const data = await response.json();
        // console.log(data.results);
        setUser(data.results);
        setLoading(false);
        setDataLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };
    apiFetching();
  }, [API, page, results]);

  // -----------------------Search------------------------------|

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
      <section className="max-w-[152rem] py-10">
        <h1 className="flex text-4xl font-medium text-gray-400 mx-auto justify-center ">
          <FaUserAlt className="mx-2" /> Users Profile
        </h1>
        <input
          placeholder="Search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex m-auto border-b-2 border-gray-400 outline-none px-3 py-2 my-10"
        />
        <div className="flex justify-between items-center gap-2 my-6">
          <button
            onClick={() => setPage(page - results)}
            className="text-gray-400 text-3xl font-bold py-2 px-4 rounded-xl hover:text-gray-600 mx-4 disabled:opacity-20 disabled:cursor-not-allowed"
            disabled={dataLoading || page === 1}
          >
            <GrFormPrevious />
          </button>
          <button
            onClick={() => setPage(page + results)}
            className="text-gray-400 text-3xl font-bold py-2 px-4 rounded-xl hover:text-gray-600 mx-4 disabled:opacity-20 disabled:cursor-not-allowed"
            disabled={dataLoading}
          >
            <GrFormNext />
          </button>
        </div>
        {dataLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <RiLoader5Fill className="animate-spin text-7xl text-[#27262680]" />
          </div>
        ) : SearchData.length === 0 ? (
          <h1 className="mx-12 my-12 text-2xl font-medium text-gray-500">
            No data Found
          </h1>
        ) : (
          <div className="flex justify-center max-h-[350px] overflow-y-auto">
            <table className="w-[80%] min-w-[1300px] text-left shadow-lg">
              <thead className="bg-blue-400 text-white sticky top-0">
                <tr>
                  <th className="px-3 py-3 text-xl font-semibold text-center  ">
                    No.
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Image
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Name
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Age
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Gender
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Id
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Email
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Mobile
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Country
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Provience
                  </th>
                  <th className="px-3 py-3 text-xl font-semibold text-center ">
                    Street
                  </th>
                </tr>
              </thead>
              <tbody>
                {SearchData.map((currentData, index) => (
                  <DataTable
                    key={currentData.login.uuid}
                    data={currentData}
                    index={index + page}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
