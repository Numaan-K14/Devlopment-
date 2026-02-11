import { useState } from "react";
import { Child } from "../hooks/Child"

export function Counter() {
  const [count, setCount] = useState(0);
  const ButtonHandler = () => {
    setCount(() => count + 1);
  };
  return (
    <>
      <div className="flex flex-col mx-auto text-center gap-4 my-40">
        <Child abc={count} />
        <h1 className="text-center text-2xl">{count}</h1>
        <button
          onClick={ButtonHandler}
          className="text-lg  rounded-lg py-2 px-2 bg-blue-300 mx-auto"
        >
          
          INCREMENT
        </button>
      </div>
    </>
  );
}
