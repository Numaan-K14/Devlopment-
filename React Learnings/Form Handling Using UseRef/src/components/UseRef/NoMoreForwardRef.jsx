//passing component from parent to child.

import { useId, useRef } from "react";

export function NoMoreForwardRef() {
  const Username = useRef(null);
  const password = useRef(null);

  function SubmitHandle(e) {
    e.preventDefault();
    console.log(
      `Username is :${Username.current.value}, Password is :${password.current.value}`
    );
  }

  return (
    <>
      <form onSubmit={SubmitHandle}>
        <InputField
          label="Username"
          ref={Username}
          placeholder="Username"
          type="text"
        />
        <InputField
          label="password"
          ref={password}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

const InputField = ({ label, ref, placeholder, type }) => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        ref={ref}
        placeholder={placeholder}
        autoComplete="on"
      />
    </>
  );
};
