import { useState } from "react";
import { InputField } from "./InputField";

export function ContactForm() {
    
  const [user, setUser] = useState({
    Username: "",
    Password: "",
    textArea: "",
  });

  const changeHandle = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const SubmitHandle = (e) => {
    e.preventDefault();
    console.log(user);
  };
  return (
    <>
      <section className="max-w-[30%] mx-auto shadow-xl px-3 bg-white rounded-lg my-10 py-10">
        <h1 className="text-2xl font-medium text-center py-6    ">
          Contact Form
        </h1>
        <form className="flex flex-col gap-4" onSubmit={SubmitHandle}>
          <InputField
            required
            htmlFor="username"
            name="Username"
            label="Username"
            type="text"
            id="User Name"
            placeholder="Please Enter Username"
            value={user.Username}
            onChange={changeHandle}
          />
          <InputField
            required
            htmlFor="password"
            name="Password"
            label="Password"
            type="password"
            id="Password"
            placeholder="Please Enter Password"
            value={user.Password}
            onChange={changeHandle}
            autoComplete="current-password" 
          />

          <label className="text-lg font-medium">
            Message
            <textarea
              name="textArea"
              placeholder="Drop Something"
              className="flex w-full outline-none bg-blue-50 px-2 py-2 rounded-md"
              value={user.textArea}
              onChange={changeHandle}
            />
          </label>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </section>
    </>
  );
}
