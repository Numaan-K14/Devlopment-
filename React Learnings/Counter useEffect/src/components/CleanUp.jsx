import { useEffect, useState } from "react";

export function CleanUp() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div>
      <div className="w-[30%] flex flex-col mx-auto text-center items-center gap-4 my-40 bg-white shadow-2xl py-10  box-border">
        <h1 className="text-3xl font-bold">Auto Counter</h1>
        <h2 className=" text-3xl font-bold">{count}</h2>
        <button
          className="text-lg  rounded-lg py-2 px-2 bg-[#0e3b46] mx-auto text-white "
          onClick={() => setCount(0)}
        >
          INCREMENT
        </button>
        {/* <button
          className="text-lg  rounded-lg py-2 px-2 bg-[#0e3b46] mx-auto text-white"
          onClick={() => setCount(count - 1)}
        >
          DECREMENT
        </button> */}
      </div>
    </div>
  );
}
