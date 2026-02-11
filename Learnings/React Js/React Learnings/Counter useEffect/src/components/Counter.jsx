import { useEffect, useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  
  useEffect(() => {
  console.log(">>>>>>>>>>>>>",count)
},[count])



  return (
    <>
      <div className="flex flex-col mx-auto text-center gap-4 my-40">
        <h1 className="text-center text-2xl font-bold">{count}</h1>
        <button className="text-lg  rounded-lg py-2 px-2 bg-blue-300 mx-auto"
        onClick={()=>setCount(count + 1)}>
          INCREMENT
        </button>
      </div>
    </>
  );
}
