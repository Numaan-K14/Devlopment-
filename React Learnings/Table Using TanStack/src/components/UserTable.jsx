import { TableComponent } from "./TableComponent";
import { AddUser } from "./AddUser";
import { useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";

export const UserTable = () => {
  const [addData, setAddData] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(true);

  //store users in state
  const [Data, setData] = useState([
    {
      srNo: 1,
      name: "KL Rahul",
      jobRole: "Cricketer",
      email: "KLRahul@example.com",
      address: "01 Mumbai Central",
      province: "Maharashtra",
      country: "India",
    },
    {
      srNo: 2,
      name: "Virat",
      jobRole: "Cricketer",
      email: "virat@example.com",
      address: "18 Delhi Noida",
      province: "Maharashtra",
      country: "India",
    },
    {
      srNo: 3,
      name: "Rohit",
      jobRole: "Cricketer",
      email: "Sharma@example.com",
      address: "12 Mumbai East",
      province: "Maharashtra",
      country: "India",
    },
    {
      srNo: 4,
      name: "Rahul",
      jobRole: "Painter",
      email: "Rahul@example.com",
      address: "123 Up St",
      province: "Bihar",
      country: "India",
    },
    {
      srNo: 5,
      name: "John Smith",
      jobRole: "Architecture",
      email: "johnSm@example.com",
      address: "123 Main St",
      province: "California",
      country: "Europe",
    },
    {
      srNo: 6,
      name: "John Doe",
      jobRole: "Developer",
      email: "john@example.com",
      address: "123 Main St",
      province: "California",
      country: "Egypt",
    },

    {
      srNo: 8,
      name: "Johny Bairistow",
      jobRole: "Cricketer",
      email: "johny@example.com",
      address: "123 luis Phillips",
      province: "melbourne",
      country: "Austrillia",
    },
  ]);
  // console.log(Data, ">>>>>>>>>>");
  const columns = [
    { accessorKey: "srNo", header: "Sr No." },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "jobRole", header: "Job Role" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "province", header: "Province" },
    { accessorKey: "country", header: "Country" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 500);
  }, []);

  // For New User
  const handleAddUser = (newUser) => {
    const newEntry = { ...newUser, srNo: Data.length + 1 };
    setData((prev) => [...prev, newEntry]);
  };

  if (loader) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TbLoader2 className="animate-spin text-8xl text-gray-500" />
      </div>
    );
  }

  const SearchData = Data.filter((abc) =>
    abc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-col text-center w-[90%] h-[650px] shadow-xl shadow-[#c9c5c5] rounded-xl my-10 mx-19">
      <div className="w-[90%] m-auto py-12">
        <h1 className="flex gap-2 text-xl font-bold text-[#474444] border-b border-[#0812303f] pb-2">
          <FaUserTie className="my-1  text-xl" />
          User Table
        </h1>
      </div>
      <div className="w-[90%] m-auto border border-[#0812303f] h-[450px]">
        <div className="flex justify-between my-4 p-3">
          <input
            onChange={(e) => setSearch(e.currentTarget.value)}
            type="text"
            placeholder="Search"
            className="w-[30%]  mx-2 px-2 outline outline-[#0812303f]"
          />
          <button
            onClick={() => {
              setAddData(true);
              setOpen(true);
            }}
            disabled={addData}
            type="button"
            className="text-xs font-medium text-white bg-[#081230] px-2 py-2 disabled:cursor-not-allowed flex gap-1 rounded"
          >
            <MdAdd className="text-lg font-extrabold text-white" /> Add Details
          </button>
        </div>

        {SearchData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <img
              src="file.png"
              alt="No Data Found"
              className="h-20 w-20 mb-2"
            />
            <span className="text-xl font-bold text-gray-500">
              No Data Found
            </span>
          </div>
        ) : (
          <TableComponent
            columns={columns}
            data={SearchData} //dynamically controlled
            // setAddData={setAddData}
            // setOpen={setOpen}
            // addData={addData}
            // setSearch={setSearch}
          />
        )}

        {addData && (
          <AddUser
            setAddData={setAddData}
            open={open}
            onAddUser={handleAddUser} //send to addUser
          />
        )}
      </div>
    </div>
  );
};
