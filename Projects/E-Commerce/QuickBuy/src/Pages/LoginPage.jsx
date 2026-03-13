// import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { SideDrawer } from "@/components/custom/SideDrawer";
import { UserPen } from "lucide-react";
import { toast } from "sonner";

export function LoginPage({ open, setOPen }) {
  // const [profileOpen, setProfileOpen] = useState(false);
  const UserDetails = JSON.parse(localStorage.getItem("UserDetails"));
  // const navigate = useNavigate();
  // const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // const {
  //   register: profileRegister,
  //   handleSubmit: profileHandleSubmit,
  //   reset: profileReset,
  //   formState: { errors: profileErrors },
  // } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    setOPen(false);
    reset();
    localStorage.setItem("UserData", JSON.stringify(data));
    toast.success("Login successfully !");
  };

  // const SideDrawerHandle = (data) => {
  //   console.log("UserData", data);
  //   localStorage.setItem("UserDetails", JSON.stringify(data));
  //   profileReset();
  //   setProfileOpen(false);
  //   {
  //     location.pathname == "/Buy-now" && navigate(0);
  //   }
  // };

  return (
    <>
      <Dialog open={open} onOpenChange={setOPen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="p-0 w-[60%] rounded-none">
          <div className="flex w-full">
            <div className="w-1/3 bg-linear-to-r from-blue-600 to-blue-500 text-white p-8 flex flex-col justify-center items-start space-y-6">
              <div className="flex flex-col leading-none cursor-pointer select-none">
                <h1 className="text-2xl font-extrabold text-white tracking-wide">
                  Quick<span className="text-yellow-300">Buy</span>
                </h1>
                <span className="text-[11px] text-white/80 tracking-wide">
                  Fast & Quick Service
                </span>
              </div>

              <p className="font-medium text-base select-none">
                Get access to your Orders, Wishlist and Recommendations
              </p>

              <img
                src="/LOGIN-2.png"
                alt="login illustration"
                className="w-full h-90 object-contain"
              />
            </div>

            <div className="w-2/3 bg-white p-10 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-gray-400 mb-6">
                Sign in or create account
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col">
                  <input
                    {...register("username", { required: true })}
                    placeholder="Mobile number or Email"
                    className="border-b border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-b-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.username && (
                    <span className="text-red-500 text-sm mt-1">
                      This field is required
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 my-4 rounded hover:bg-blue-700 transition duration-200"
                >
                  Continue
                </button>
              </form>

              <p className="text-md text-gray-500 mt-6">
                By continuing, you agree to our{" "}
                <span className="text-blue-800 hover:underline">Terms</span> of
                Use and{" "}
                <Link
                  onClick={() => setOPen(false)}
                  to="/Privacy-Policy"
                  className="text-blue-800 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// <SideDrawer
//   open={profileOpen}
//   OpenHandle={setProfileOpen}
//   HandleSubmit={profileHandleSubmit(SideDrawerHandle)}
//   reset={reset}
//   Action="Save"
//   Heading={
//     !UserDetails && (
//       <div className="flex items-center gap-2">
//         <UserPen />
//         <span>Create Your Profile</span>
//       </div>
//     )
//   }
//   Description={
//     !UserDetails &&
//     "Control your personal details and delivery preferences "
//   }
// >
//   {!UserDetails && (
//     <form className="grid grid-rows-6 gap-6 p-4">
//       {/* ===================== NAME ===================== */}
//       <input
//         type="text"
//         placeholder="Full Name (for delivery)"
//         className="outline w-full p-2.5 placeholder:text-sm rounded"
//         {...profileRegister("fullName", {
//           required: "Full name is required",
//         })}
//       />
//       {profileErrors.fullName && (
//         <span className="text-sm text-red-600">
//           {profileErrors.fullName.message}
//         </span>
//       )}

//       {/* ===================== CONTACT ===================== */}
//       <input
//         type="tel"
//         placeholder="Mobile Number"
//         className="outline w-full p-2.5 placeholder:text-sm rounded"
//         {...profileRegister("mobile", {
//           required: "Mobile number is required",
//         })}
//       />
//       {profileErrors.mobile && (
//         <span className="text-sm text-red-600">
//           {profileErrors.mobile.message}
//         </span>
//       )}

//       {/* ===================== ADDRESS ===================== */}
//       <input
//         type="text"
//         placeholder="Pincode"
//         className="outline w-full p-2.5 placeholder:text-sm rounded"
//         {...profileRegister("pincode", {
//           required: "Pincode is required",
//         })}
//       />
//       {profileErrors.pincode && (
//         <span className="text-sm text-red-600">
//           {profileErrors.pincode.message}
//         </span>
//       )}

//       <input
//         type="text"
//         placeholder="State"
//         className="outline w-full p-2.5 placeholder:text-sm rounded"
//         {...profileRegister("state", {
//           required: "State is required",
//         })}
//       />
//       {profileErrors.state && (
//         <span className="text-sm text-red-600">
//           {profileErrors.state.message}
//         </span>
//       )}

//       <input
//         type="text"
//         placeholder="City"
//         className="outline w-full p-2.5 placeholder:text-sm rounded"
//         {...profileRegister("city", {
//           required: "City is required",
//         })}
//       />
//       {profileErrors.city && (
//         <span className="text-sm text-red-600">
//           {profileErrors.city.message}
//         </span>
//       )}

//       <input
//         type="text"
//         placeholder="Locality / Area"
//         className="outline w-full p-2.5 placeholder:text-sm rounded"
//         {...profileRegister("locality", {
//           required: "Locality is required",
//         })}
//       />
//       {profileErrors.locality && (
//         <span className="text-sm text-red-600">
//           {profileErrors.locality.message}
//         </span>
//       )}

//       <input
//         type="text"
//         placeholder="Flat / House No / Building"
//         className="outline w-full p-2.5 placeholder:text-sm rounded"
//         {...profileRegister("addressLine", {
//           required: "Address is required",
//         })}
//       />
//       {profileErrors.addressLine && (
//         <span className="text-sm text-red-600">
//           {profileErrors.addressLine.message}
//         </span>
//       )}

//       {/* ===================== ADDRESS TYPE ===================== */}
//       <select
//         className="outline w-full p-2.5 text-sm rounded"
//         {...profileRegister("addressType", {
//           required: "Select address type",
//         })}
//       >
//         <option value="">Address Type</option>
//         <option value="home">Home</option>
//         <option value="work">Work</option>
//         <option value="office">Office</option>
//       </select>
//       {profileErrors.addressType && (
//         <span className="text-sm text-red-600">
//           {profileErrors.addressType.message}
//         </span>
//       )}
//     </form>
//   )}
// </SideDrawer>
