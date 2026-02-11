import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";


export const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <label htmlFor="password">Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button type="button" onClick={togglePasswordVisibility}>
        {showPassword ? <IoEye /> : <IoEyeOff />}
      </button>
    </div>
  );
};


//alert message and code must be 10 char message in alert box.

  //   import React, { useState } from "react";

  //  export function PasswordInput() {
  //    const [password, setPassword] = useState("");
  //    const [showLengthError, setShowLengthError] = useState(false);

  //    const handlePasswordChange = (event) => {
  //      const newPassword = event.target.value;
  //      setPassword(newPassword);
  //      // Check length and update error state
  //      if (newPassword.length < 10 && newPassword.length > 0) {
  //        setShowLengthError(true);
  //      } else {
  //        setShowLengthError(false);
  //      }
  //    };

  //    const handleSubmit = (event) => {
  //      event.preventDefault();
  //      // Handle form submission logic here
  //      if (password.length < 10) {
  //        alert("Password must be at least 10 characters long!");
  //      } else {
  //        alert("Password is valid!");
  //        // Proceed with form submission
  //      }
  //    };

  //    return (
  //      <form onSubmit={handleSubmit}>
  //        <div>
  //          <label htmlFor="password">Password:</label>
  //          <input
  //            type="password"
  //            id="password"
  //            value={password}
  //            onChange={handlePasswordChange}
  //          />
  //          {showLengthError && (
  //            <p style={{ color: "red" }}>Password must be 10 characters</p>
  //          )}
  //        </div>
  //        <button type="submit">Submit</button>
  //      </form>
  //    );
  //  }

   
