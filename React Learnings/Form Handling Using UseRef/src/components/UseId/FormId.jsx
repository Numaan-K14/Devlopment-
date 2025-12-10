import { useId } from "react";

export function FormId() {
  const id = useId(); //provide always a unique id

  const submitHandle = () => {
  
}

  return (
    <>
      <form onSubmit={submitHandle}>
        <div>
          <label htmlFor={id + "Username"}>Username</label>
          <input
            type="text"
            id={id + "Username"}
            placeholder="Username"
            autoComplete="on"
          />
        </div>
        <div>
          <label htmlFor={id + "Email"}>Email</label>
          <input
            type="email"
            id={id + "Email"}
            placeholder="Email"
            autoComplete="on"
          />
        </div>
        <div>
          <label htmlFor={id + "Password"}>Password</label>
          <input
            type="password"
            id={id + "Password"}
            placeholder="Password"
            autoComplete="on"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
