// import { useState } from "react";

// export function Form() {
//   const [user, setUser] = useState({
//     username: "",
//     password: "",
//   });
//   function submitValue(e) {
//     const { name, value } = e.target;
//     setUser((prev) => ({ ...prev, [name]: value }));
//   }
//   function handleChange(e) {
//     e.preventDefault();
//     console.log(user);
//   }
//   return (
//     <>
//       <form onSubmit={handleChange}>
//         <h1>Login Page</h1>
//         <input
//           type="text"
//           placeholder="username"
//           name="username"
//           onChange={submitValue}
//           value={user.username}
//         />
//         <input
//           type="password"
//           placeholder="password"
//           name="password"
//           onChange={submitValue}
//           autoComplete="off"
//           value={user.password}
//         />
//         <button type="submit">submit</button>
//       </form>
//     </>
//   );
// }

import { useRef } from "react";
export function Form() {
  // ---This Is Js DoMS Method and we use react so we avoid these and use  useRef()----
  //   const username = document.getElementById("username");
  //   const password = document.getElementById("password");

  const username = useRef(null);
  const password = useRef(null);
  console.log(username);

  function submitHandle(e) {
    e.preventDefault();
    console.log(username.current.value, password.current.value);
  }
  return (
    <>
      <form onSubmit={submitHandle}>
        <input
          type="text"
          placeholder="username"
          name="username"
          id="username"
          ref={username}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          autoComplete="on"
          id="password"
          ref={password}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
