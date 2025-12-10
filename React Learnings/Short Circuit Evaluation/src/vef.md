import { useState } from "react"
import { ButtonComp } from "./ButtonComp";

export function ShortCircuit() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState("");
  return (
    <>
      <section className="max-w-[50%] mx-auto my-[10rem] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-white">
        <h1 className="text-4xl font-bold py-5 text-center text-[#696b6b]">
          Welcome to Short Circuit Evaluation !
        </h1>

        <div className="text-center text-2xl font-medium text-[#696b6b]">
          {loggedIn
            ? user
              ? `Hello ${user}`: "You're logged in" : "Please log in"}
        </div>

        <div className="py-7 justify-center flex">
          <ButtonComp
            label="Toggle Login State"
            onClick={() => setLoggedIn(!loggedIn)}
          />
          <ButtonComp label="Set User" onClick={() => setUser("Numaan")} />
          <ButtonComp label="Clear User" onClick={() => setUser("")} />
        </div>
      </section>
    </>
  );
}

