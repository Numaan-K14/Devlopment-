import { useState } from "react";
import { ButtonComp } from "./ButtonComp";

const USER_KEY = "abcLocalUser";
const LOGIN_KEY = "abcLocalLogin";

export function Operators() {
  // Restore from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : "";
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    const storedLogin = localStorage.getItem(LOGIN_KEY);
    return storedLogin ? JSON.parse(storedLogin) : false;
  });

  // Update localStorage and this state for user
  const updateUser = (value) => {
    localStorage.setItem(USER_KEY, JSON.stringify(value));
    setUser(value);
  };

  // Update localStorage and this state for login
  const updateLogin = (value) => {
    localStorage.setItem(LOGIN_KEY, JSON.stringify(value));
    setLoggedIn(value);
  };

  let abc; 
  if (!loggedIn) {
    abc = "Please Log In";
  } else if (user) {
    abc = `Hello ${user}`;
  } else {
    abc="Your Logged In"
  }

  return (
    <section className="max-w-[50%] mx-auto my-[10rem] shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-white">
      <h1 className="text-4xl font-bold py-5 text-center text-[#696b6b]">
        Welcome to Short Circuit Evaluation !
      </h1>

      <div className="text-center text-2xl font-medium text-[#696b6b]">
        {/* {loggedIn
          ? user
            ? `Hello ${user}`
            : "You're logged in"
          : "Please log in"} */}
        <p>{abc}</p>
      </div>

      <div className="py-7 justify-center flex gap-4">
        <ButtonComp
          label="Toggle Login State"
          onClick={() => updateLogin(!loggedIn)}
        />
        <ButtonComp label="Set User" onClick={() => updateUser("Numaan")} />
        <ButtonComp label="Clear User" onClick={() => updateUser("")} />
      </div>
    </section>
  );
}
