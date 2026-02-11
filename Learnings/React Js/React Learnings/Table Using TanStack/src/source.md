codes without dynamic adding

AddUser.jsx
import { Dialog } from "@mui/material";
import { useId, useState } from "react";
import { IoIosEye } from "react-icons/io";
// import { BiShowAlt } from "react-icons/bi";
// import { MdDisabledVisible } from "react-icons/md";

export function AddUser(props) {
const { open, setAddData } = props;
const id = useId();
// const [inputData, setInputData] = useState([]);
const [user, setUser] = useState({
name: "",
jobRole: "",
email: "",
address: "",
province: "",
country: "",
});

const handleChange = (e) => {
const { name, value } = e.target;
setUser((prev) => ({ ...prev, [name]: value }));
};

// handle "Add" button submit (required fields will be validated)
const handleSubmit = (e) => {
e.preventDefault();
setAddData(false);
console.log(user);
};

// handle "Close" button (no validation)
const handleClose = (e) => {
e.preventDefault(); // prevent form submit
setAddData(false);
};

return (
<div>
<Dialog open={open}>
<div className="py-3 border-b border-[#0812303f] flex justify-between">
<h1 className="font-bold text-xl text-[#081230]">Add User</h1>
<button
            onClick={handleClose}
            type="button"
            className="text-3xl font-bold text-[#081230]"
          >
<IoIosEye />
</button>
</div>

        <form onSubmit={handleSubmit}>
          <InputField
            htmlFor={id + "Name"}
            label="Name*"
            type="text"
            placeholder="Name"
            id={id + "name"}
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
          <InputField
            htmlFor={id + "JobRole"}
            label="Job Role*"
            type="text"
            placeholder="Job Role"
            id={id + "JobRole"}
            name="jobRole"
            value={user.jobRole}
            onChange={handleChange}
            required
          />
          <InputField
            htmlFor={id + "Email"}
            label="Email*"
            type="email"
            placeholder="Email"
            id={id + "Email"}
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
          <InputField
            htmlFor={id + "Address"}
            label="Address"
            type="text"
            placeholder="Address"
            id={id + "Address"}
            name="address"
            value={user.address}
            onChange={handleChange}
          />
          <InputField
            htmlFor={id + "Provience"}
            label="Province*"
            type="text"
            placeholder="Province"
            id={id + "Provience"}
            name="province"
            value={user.province}
            onChange={handleChange}
            required
          />
          <InputField
            htmlFor={id + "Country"}
            label="Country*"
            type="text"
            placeholder="Country"
            id={id + "Country"}
            name="country"
            value={user.country}
            onChange={handleChange}
            required
          />

          <div className="p-3 border-t border-[#0812303f] mt-3 flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-bold text-red-500 border px-4 py-2 rounded-md"
            >
              Close
            </button>
            <button
              type="submit"
              className="text-xs font-bold text-white bg-[#081230] px-4 py-2 rounded-md"
            >
              Add
            </button>
          </div>
        </form>
      </Dialog>
    </div>

);
}

// --------------------InputField Component-----------------|
const InputField = ({
htmlFor,
label,
type,
id,
name,
required,
placeholder,
onChange,
value = { value },
}) => {
return (
<div className="mt-2">
<label htmlFor={htmlFor} className="flex font-semibold text-md">
{label}
</label>
<input
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        required={required}
        className="w-full outline outline-[#0812303f] rounded-md px-2 py-1"
      />
</div>
);
};

UserTable.jsx
import { FaUserCircle } from "react-icons/fa";
import { TableComponent } from "./TableComponent";
import { AddUser } from "./AddUser";
import { useState } from "react";

export const UserTable = () => {
const [addData, setAddData] = useState(false);
const [open, setOpen] = useState(false);
// const[userData,setUserData]=useState([])

const data = [
{
srNo: 1,
name: "John Doe",
jobRole: "Developer",
email: "john@example.com",
address: "123 Main St",
province: "California",
country: "Egypt",
},
{
srNo: 3,
name: "Johny Bairistow",
jobRole: "Cricketer",
email: "johny@example.com",
address: "123 luis Phillips",
province: "melbourne",
country: "Austrillia",
},
];

const columns = [
{ accessorKey: "srNo", header: "Sr No." },
{ accessorKey: "name", header: "Name" },
{ accessorKey: "jobRole", header: "Job Role" },
{ accessorKey: "email", header: "Email" },
{ accessorKey: "address", header: "Address" },
{ accessorKey: "province", header: "Province" },
{ accessorKey: "country", header: "Country" },
];

// const AddDataHandle = () => {
// <AddUser />;
// };

return (
<div>
<div className="flex justify-center m-4">
<h1 className="flex text-3xl font-bold  text-[#474444] ">
<FaUserCircle className="mx-2 text-4xl" />
User Table
</h1>
</div>

      <div>
        <TableComponent
          columns={columns}
          data={data}
          setAddData={setAddData}
          setOpen={setOpen}
          addData={addData}
        />

        {addData && <AddUser setAddData={setAddData} open={open} />}
      </div>
    </div>

);
};
