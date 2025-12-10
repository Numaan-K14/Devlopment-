import { useState } from "react";
import { ButtonComp } from "./ButtonComp";

// variable for LocalStorage
const Local = "abcLocal";

export function ShortCircuit() {
  // useStates FIRST
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(() => {
    const RawTodoKey = localStorage.getItem(Local);
    return RawTodoKey ? JSON.parse(RawTodoKey) : "";
  });

  // LocalStorage set Function
  const setLocalStorage = (abc) => {
    localStorage.setItem(Local, JSON.stringify(abc));
    setUser(abc);
  };

  return (
    <section className="max-w-[50%] mx-auto my-[10rem] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-white">
      <h1 className="text-4xl font-bold py-5 text-center text-[#696b6b]">
        Welcome to Short Circuit Evaluation !
      </h1>
      <div className="text-center text-2xl font-medium text-[#696b6b]">
        {loggedIn
          ? user
            ? `Hello ${user}`
            : "You're logged in"
          : "Please log in"}
      </div>

      <div className="py-7 justify-center flex gap-4">
        <ButtonComp
          label="Toggle Login State"
          onClick={() => setLoggedIn(!loggedIn)}
        />
        <ButtonComp label="Set User" onClick={() => setLocalStorage("Brian")} />
        <ButtonComp label="Clear User" onClick={() => setLocalStorage("")} />
      </div>
    </section>
  );
}
