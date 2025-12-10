import { useState } from "react";
import { InputField } from "./InputField";

export function FormContainer() {
  const [term, setTerm] = useState(false);
  const [checkbox, setCheckbox] = useState(true);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber : "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev)=>({...prev,[name]:value}))
  }

  const submitHandle = (e) => {
    e.preventDefault()
    console.log(user)
  }
 
  return (
    <>
      <section className="max-w-[30%] mx-auto shadow-xl px-3 bg-white rounded-lg py-4">
        <h1 className="text-xl font-medium py-2">Sign Up</h1>
        <p className="py-1.4 text-gray-500 ">
          Please fill this form to create an account.
        </p>
        <InputField
          name="firstName"
          label="First Name"
          type="text"
          id="First name"
          value={user.firstName}
          onChange={handleChange}
          placeholder="Enter Your First Name"
        />
        <InputField
          name="lastName"
          label="Last Name"
          type="text"
          id="Last Name"
          value={user.lastName}
          onChange={handleChange}
          placeholder="Enter Your Last Name"
        />
        <InputField
          name="email"
          label="email"
          type="mail"
          id="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Enter Your Email"
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          id="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Enter Password"
        />
        <InputField
          name="mobileNumber"
          label="Mobile Number"
          type="phone"
          pattern="[0-9]{10}"
          maxLength="10"
          id="mobile"
          value={user.mobileNumber}
          onChange={handleChange}
          placeholder="Enter Your Mobile Number"
        />
        <p>
          By Creating an account you agree to your
          <button
            type="submit"
            className="text-blue-600"
            onClick={() => setTerm(!term)}
          >
            Terms & Privacy
          </button>
        </p>

        {term && (
          <p className="text-gray-500">
            Terms and Conditions are the rules that explain how users can access
            and use a website or service. They set expectations for both the
            user and the provider, including what is allowed, what is not, and
            who owns the content. They also usually limit the provider’s
            responsibility for misuse or problems outside their control. A
            Privacy Policy describes how a website or service collects, uses,
            shares, and protects personal information. It explains what data is
            gathered, such as names, emails, or browsing details, why it is
            collected, how it may be shared with others, and what rights users
            have over their information. In short, the terms tell people the
            rules for using the service, while the privacy policy explains how
            their data is managed.
            <label className="flex items-center gap-2 text-md font-medium text-black">
              <input
                type="checkbox"
                className="w-4 h-4"
                onClick={() => setCheckbox(!checkbox)}
              />
              I Agree to Privacy Policy
            </label>
          </p>
        )}

        <button
          type="submit"
          disabled={checkbox}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          onClick={submitHandle}
        >
          Sign In
        </button>
      </section>
    </>
  );
}
