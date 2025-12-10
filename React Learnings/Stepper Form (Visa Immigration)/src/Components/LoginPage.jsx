// import { useState } from "react";
import { useForm } from "react-hook-form";
import { GiEagleEmblem } from "react-icons/gi";
import { Router } from "../Routing/Router";
import { useState } from "react";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [Login, SetLogin] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    if (data.Password == "1234") {
      alert("Login SuccessFully");
      SetLogin(true);
    } else {
      alert("Invalid Crediantials");
    }
  };
  if (Login) return <Router />;

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      {/* Background */}
      <img
        src="LoginBg.jpg"
        alt="Login Background"
        className="absolute  object-cover w-full h-full"
      />

      {/* Login Container */}
      <div className="relative w-[55%] h-120 rounded-2xl shadow-2xl flex overflow-hidden">
        <div className="relative w-[50%]">
          <img
            src="LoginContainter.jpg"
            alt="Login Left"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center space-y-3">
            <GiEagleEmblem className="text-6xl text-white" />

            <p className="text-white text-3xl font-extrabold tracking-wide">
              MoveEase Global
            </p>
            <p className="text-white text-sm font-medium tracking-wider opacity-90">
              Immigration & Citizenship Services
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-[50%] flex flex-col justify-center items-center p-10 bg-white">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-extrabold text-[#163769] text-center mb-3 tracking-wide">
              SECURE LOGIN
            </h1>
            <p className="text-xs font-semibold text-[#163769] text-center mb-8">
              Access Your Application & Explore Opportunities
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-8"
            >
              {/* Email Field */}
              <div className="w-full flex flex-col">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  {...register("Email", { required: "Please Enter Email" })}
                  className="h-10 w-full rounded-md  px-3 text-sm placeholder:font-semibold  ring-1 ring-[#163769]"
                />
                {errors.Email && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.Email.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="w-full flex flex-col ">
                <input
                  autoComplete="off"
                  type="password"
                  placeholder="Enter Your Password"
                  {...register("Password", {
                    required: "Please Enter Password",
                  })}
                  className="h-10 w-full rounded-md  px-3 text-sm placeholder:font-semibold  ring-1 ring-[#163769]"
                />
                {errors.Password && (
                  <span className="text-xs text-red-600 font-medium">
                    {errors.Password.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className=" w-full bg-linear-to-r from-[#153b42] via-[#3e6066] to-[#208ea1] text-white font-bold text-lg py-2 rounded-full shadow-md hover:opacity-90 transition"
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { GiEagleEmblem } from "react-icons/gi";
// import { Router } from "../Routing/Router"; // ✅ Make sure you import your Router component

// export function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   // ✅ Added local state to store login success
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // ✅ Handle form submission
//   const onSubmit = (data) => {
//     console.log(data);

//     // ✅ Simple password check (temporary logic)
//     if (data.Password === "Numaan") {
//       setIsAuthenticated(true);
//       alert("Login Successfully")// show Router page
//     } else {
//       alert("Invalid Password");
//     }
//   };

//   // ✅ Conditional Rendering — shows login form or Router based on state
//   if (isAuthenticated) {
//     return <Router />;
//   }

//   return (
//     <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
//       {/* 🌄 Background Image */}
//       <img
//         src="LoginBg.jpg"
//         alt="Login Background"
//         className="absolute object-cover w-full h-full"
//       />

//       {/* 🧱 Main Container */}
//       <div className="relative w-[55%] h-120 rounded-2xl shadow-2xl flex overflow-hidden">
//         {/* 🖼 Left Side Image Section */}
//         <div className="relative w-[50%]">
//           <img
//             src="LoginContainter.jpg"
//             alt="Login Left"
//             className="h-full w-full object-cover"
//           />

//           {/* 🔲 Overlay for dimming the image */}
//           <div className="absolute inset-0 bg-black/50"></div>

//           {/* 🦅 Logo + Text */}
//           <div className="absolute inset-0 flex flex-col justify-center items-center text-center space-y-3">
//             <GiEagleEmblem className="text-6xl text-white drop-shadow-lg" />
//             <p className="text-white text-3xl font-extrabold tracking-wide">
//               GLOBAL PATHWAYS
//             </p>
//             <p className="text-white text-sm font-medium tracking-wider opacity-90">
//               Immigration & Citizenship Services
//             </p>
//           </div>
//         </div>

//         {/* 🧾 Right Side Form */}
//         <div className="w-[50%] flex flex-col justify-center items-center p-10 bg-white">
//           <div className="w-full max-w-sm">
//             <h1 className="text-3xl font-extrabold text-[#163769] text-center mb-3 tracking-wide">
//               SECURE LOGIN
//             </h1>
//             <p className="text-xs font-semibold text-[#163769] text-center mb-8">
//               Access Your Application & Explore Opportunities
//             </p>

//             {/* 🧩 Login Form */}
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex flex-col items-center gap-8"
//             >
//               {/* 📧 Email Field */}
//               <div className="w-full flex flex-col">
//                 <input
//                   type="email"
//                   placeholder="Enter Your Email"
//                   {...register("Email", { required: "Please Enter Email" })}
//                   className="h-10 w-full rounded-md px-3 text-sm placeholder:font-semibold ring-1 ring-[#163769]"
//                 />
//                 {errors.Email && (
//                   <span className="text-xs text-red-600 font-medium">
//                     {errors.Email.message}
//                   </span>
//                 )}
//               </div>

//               {/* 🔐 Password Field */}
//               <div className="w-full flex flex-col">
//                 <input
//                   autoComplete="off"
//                   type="password"
//                   placeholder="Enter Your Password"
//                   {...register("Password", {
//                     required: "Please Enter Password",
//                   })}
//                   className="h-10 w-full rounded-md px-3 text-sm placeholder:font-semibold ring-1 ring-[#163769]"
//                 />
//                 {errors.Password && (
//                   <span className="text-xs text-red-600 font-medium">
//                     {errors.Password.message}
//                   </span>
//                 )}
//               </div>

//               {/* 🚪 Login Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-linear-to-r from-[#153b42] via-[#3e6066] to-[#208ea1] text-white font-bold text-lg py-2 rounded-full shadow-md hover:opacity-90 transition"
//               >
//                 LOGIN
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
