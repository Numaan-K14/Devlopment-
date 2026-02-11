import { useState } from "react";
import { InputField } from "./InputField";

export function LoginForm() {
  // ----------Using Multiples Hooks---------------------
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  // const submitHandle = (e) => {
  //   e.preventDefault();
  //   const data = {
  //     username,
  //     password,
  //   }
  //   console.log(data)
  //   // console.log("Username :", user, "password :", password);
  // };

  // --------------Using Single Hook-------------

  const [username, setUser] = useState({
    Username: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandle = (e) => {
    e.preventDefault();
    console.log(username);
  };
  // -------------------------------------------------------------

  return (
    <>
      <section className="max-w-[30%] mx-auto shadow-xl px-3 bg-white rounded-lg my-10 py-10">
        <h1 className="text-xl font-medium text-center py-2">Login</h1>
        <form className="flex flex-col gap-4">
          <InputField
            htmlFor="username"
            name="Username"
            label="Username"
            type="text"
            id="User Name"
            placeholder="Please Enter Username"
            required
            // value={username}
            value={username.Username}
            onChange={handleChange}
            // onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            required
            htmlFor="password"
            name="Password"
            label="Password"
            type="password"
            id="Password"
            placeholder="Please Enter Password"
            // value={password}
            value={username.password}
            onChange={handleChange}
            // onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            onClick={submitHandle}
          >
            Submit
          </button>
        </form>
      </section>
    </>
  );
}
