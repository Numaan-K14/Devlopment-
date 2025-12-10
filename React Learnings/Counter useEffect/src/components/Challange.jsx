import { useEffect, useState } from "react";

export function Challange() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    document.title = `Count : ${count}`;
  }, [count]);

  useEffect(() => {
    console.log(name);
  }, [name]);
  return (
    <>
      <div className="w-[30%] flex flex-col mx-auto text-center items-center gap-4 my-40 bg-white shadow-2xl py-10  box-border">
        <h1 className="text-center text-2xl font-bold">{count}</h1>
        <button
          className="text-lg  rounded-lg py-2 px-2 bg-[#0e3b46] mx-auto text-white "
          onClick={() => setCount(count + 1)}
        >
          INCREMENT
        </button>
        <button
          className="text-lg  rounded-lg py-2 px-2 bg-[#0e3b46] mx-auto text-white"
          onClick={() => setCount(count - 1)}
        >
          DECREMENT
        </button>
        <label className="text-2xl font-bold">Name :{ name }</label>
        <input   
          type="text"
          className="w-[70%] bg-[#0e3b46] text-white px-2 py-2"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
    </>
  );
}
