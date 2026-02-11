import { useState } from "react";
import { Button } from "./Button";

export function Counter() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("null");

  function setCountOnSelect() {
    console.log(count);
    console.log(input);
    setCount(count + input);
    setInput("");
  }
  return (
    <section className="max-w-[70%] mx-auto my-[10rem] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-white">
      <h1 className="text-4xl font-bold py-5 text-center text-[#696b6b]">
        ADVANCED COUNTER USING useState HOOKS !
      </h1>
      <div className="mx-[4.5rem] my-[2rem] text-2xl font-medium text-[#696b6b]">
        <p>Count : {count} </p>
        <div className="flex items-center gap-4 my-12">
          <p>Step :</p>
          <input
            type="number"
            className="border border-gray-300 px-2 py-1 rounded w-[20%]"
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="py-7 justify-center flex gap-4">
        <Button
          label="Increment"
          // onClick={(() => setCount(count + input), setInput(""))}
          onClick={setCountOnSelect}
          disabled={count + input > 100}
        />
        <Button
          label="Decrement"
          onClick={() => setCount(count - input)}
          disabled={count - input < 0}
        />
        <Button label="Reset" onClick={() => setCount(0)} />
      </div>
    </section>
  );
}
