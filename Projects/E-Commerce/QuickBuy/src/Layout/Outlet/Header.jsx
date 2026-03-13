import React, { useState } from "react";
import {
  CircleUserRound,
  Search,
  UserPen,
  Phone,
  MapPin,
  Home,
  Building2,
  User2,
  PhoneCall,
  MapPinCheck,
  Clock,
  LogOut,
} from "lucide-react";
import { GrCart } from "react-icons/gr";
import { RiCustomerService2Fill } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LoginPage } from "@/Pages/LoginPage";
import { BiLogIn } from "react-icons/bi";
import { SideDrawer } from "@/components/custom/SideDrawer";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
// import { DropdownMenuDemo } from "@/components/custom/CategoryNav/Dropdown";

export function Header() {
  const [open, setOpen] = useState(false);
  const [loginPop, setLoginPop] = useState(false);
  const navigate = useNavigate();
  const User = JSON.parse(localStorage.getItem("UserData"));
  const UserDetails = JSON.parse(localStorage.getItem("UserDetails"));
  const MyCart = JSON.parse(localStorage.getItem("MyCart") || "[]");
  // console.log(UserDetails, ">>>>UserDetails>>>>>>");
  const iconWrapper =
    "flex items-center gap-2 text-white font-bold text-xl cursor-pointer hover:text-yellow-300 transition";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("UserData", data);
    localStorage.setItem("UserDetails", JSON.stringify(data));
    reset();
    setOpen(false);
    toast.success("Profile saved successfully!");
    {
      location.pathname == "/Buy-now" && navigate(0);
    }
  };

  function LogoutHandle() {
    localStorage.removeItem("UserDetails");
    localStorage.removeItem("UserData");
    reset();
    setOpen(false);
    toast.success("Logged out successfully!");
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-linear-to-r from-blue-600 to-blue-500 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/">
            <div className="flex flex-col leading-none cursor-pointer select-none">
              <h1 className="text-2xl font-extrabold text-white tracking-wide">
                Quick<span className="text-yellow-300">Buy</span>
              </h1>

              <span className="text-[11px] text-white/80 tracking-wide">
                Fast & Quick Service
              </span>
            </div>
          </Link>
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-sm w-105 px-3 py-2 shadow-sm">
            <input
              type="text"
              disabled
              placeholder="Search for products, brands and more"
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 disabled:cursor-not-allowed"
            />
            <Search className="text-blue-600" size={18} />
          </div>
          {/* Right Icons */}
          <div className="flex items-center gap-8">
            {User ? (
              <button onClick={() => setOpen(true)}>
                <div className={iconWrapper}>
                  <CircleUserRound strokeWidth={2} size={22} />
                  <span>Profile</span>
                </div>
              </button>
            ) : (
              <button onClick={() => setLoginPop(true)}>
                <div
                  className={`${iconWrapper} bg-blue-400 text-black p-2 rounded`}
                >
                  <BiLogIn />
                  <span>Login</span>
                </div>
              </button>
            )}
            {User && (
              <>
                <NavLink to="/Add-to-cart">
                  <div
                    className={`relative flex items-center gap-1 ${iconWrapper}`}
                  >
                    <GrCart size={20} />
                    <span>Cart</span>

                    <span className="absolute -top-3 -right-4 bg-[#ff0c0ce1] text-white rounded-full min-w-4.5 h-4.5 py-3 px-2 flex items-center justify-center text-lg font-bold ">
                      {MyCart.length}
                    </span>
                  </div>
                </NavLink>

                <NavLink to="/Support">
                  <div className={iconWrapper}>
                    <RiCustomerService2Fill size={22} />
                    <span>Support</span>
                  </div>
                </NavLink>
                <div
                  onClick={() => {
                    toast("Are you sure you want to logout?", {
                      action: {
                        label: "Logout",
                        onClick: () => LogoutHandle(),
                      },
                    });
                  }}
                  className={iconWrapper}
                >
                  <LogOut />
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <LoginPage open={loginPop} setOPen={setLoginPop} />
      <SideDrawer
        open={open}
        OpenHandle={setOpen}
        HandleSubmit={UserDetails ? LogoutHandle : handleSubmit(onSubmit)}
        reset={reset}
        Action={UserDetails ? "Logout" : "Save"}
        Heading={
          UserDetails ? (
            "Profile Information"
          ) : (
            <div className="flex items-center gap-2">
              <UserPen />
              <span>Create Your Profile</span>
            </div>
          )
        }
        Description={
          UserDetails
            ? "Keep your details up to date"
            : "Control your personal details and delivery preferences "
        }
      >
        {UserDetails ? (
          <>
            <div className="w-[90%] mx-auto my-4 bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300">
              <div className="p-5 space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-blue-900 font-semibold text-base">
                    User details
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your personal and delivery details
                  </p>
                </div>

                {/* Name */}
                <div className="flex items-center gap-3">
                  <User2 className="text-blue-800" size={20} />
                  <h2 className="text-sm font-medium text-gray-900">
                    {UserDetails?.fullName}
                  </h2>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="text-blue-800" size={18} />
                  <span>{UserDetails?.mobile}</span>
                </div>
                {/* Address */}
                <div className="flex gap-3">
                  <MapPin className="text-blue-800 mt-1" size={20} />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {UserDetails?.addressLine}, {UserDetails?.locality}, <br />
                    {UserDetails?.city} - {UserDetails?.pincode},{" "}
                    {UserDetails?.state}
                  </p>
                </div>

                {/* Address Type */}
                <div className="flex items-center gap-2">
                  {UserDetails?.addressType === "work" ? (
                    <Building2 className="text-blue-800" size={18} />
                  ) : (
                    <Home className="text-blue-800" size={18} />
                  )}

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                    {UserDetails?.addressType}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-[90%] mx-auto my-4 bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300">
              <div className="p-5 space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-blue-900 font-semibold text-base">
                    Delivery Preferences
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Help us deliver your order better
                  </p>
                </div>

                {/* Preferences List */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <PhoneCall className="text-blue-800" size={18} />
                    </div>
                    <p className="text-sm text-gray-700">
                      Call before delivery
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <MapPinCheck className="text-blue-800" size={18} />
                    </div>
                    <p className="text-sm text-gray-700">
                      Leave the package at security / doorstep if unavailable
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Clock className="text-blue-800" size={18} />
                    </div>
                    <p className="text-sm text-gray-700">
                      Prefer delivery in the evening
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <form className="grid grid-rows-6 gap-6 p-4">
            {/* ===================== NAME ===================== */}
            <input
              type="text"
              placeholder="Full Name (for delivery)"
              className="outline w-full p-2.5 placeholder:text-sm rounded"
              {...register("fullName", {
                required: "Full name is required",
              })}
            />
            {errors.fullName && (
              <span className="text-sm text-red-600">
                {errors.fullName.message}
              </span>
            )}

            {/* ===================== CONTACT ===================== */}
            <input
              type="tel"
              placeholder="Mobile Number"
              className="outline w-full p-2.5 placeholder:text-sm rounded"
              {...register("mobile", {
                required: "Mobile number is required",
              })}
            />
            {errors.mobile && (
              <span className="text-sm text-red-600">
                {errors.mobile.message}
              </span>
            )}

            {/* ===================== ADDRESS ===================== */}
            <input
              type="text"
              placeholder="Pincode"
              className="outline w-full p-2.5 placeholder:text-sm rounded"
              {...register("pincode", {
                required: "Pincode is required",
              })}
            />
            {errors.pincode && (
              <span className="text-sm text-red-600">
                {errors.pincode.message}
              </span>
            )}

            <input
              type="text"
              placeholder="State"
              className="outline w-full p-2.5 placeholder:text-sm rounded"
              {...register("state", {
                required: "State is required",
              })}
            />
            {errors.state && (
              <span className="text-sm text-red-600">
                {errors.state.message}
              </span>
            )}

            <input
              type="text"
              placeholder="City"
              className="outline w-full p-2.5 placeholder:text-sm rounded"
              {...register("city", {
                required: "City is required",
              })}
            />
            {errors.city && (
              <span className="text-sm text-red-600">
                {errors.city.message}
              </span>
            )}

            <input
              type="text"
              placeholder="Locality / Area"
              className="outline w-full p-2.5 placeholder:text-sm rounded"
              {...register("locality", {
                required: "Locality is required",
              })}
            />
            {errors.locality && (
              <span className="text-sm text-red-600">
                {errors.locality.message}
              </span>
            )}

            <input
              type="text"
              placeholder="Flat / House No / Building"
              className="outline w-full p-2.5 placeholder:text-sm rounded"
              {...register("addressLine", {
                required: "Address is required",
              })}
            />
            {errors.addressLine && (
              <span className="text-sm text-red-600">
                {errors.addressLine.message}
              </span>
            )}
            {/* ===================== ADDRESS TYPE ===================== */}
            <select
              className="outline w-full p-2.5 text-sm rounded"
              {...register("addressType", {
                required: "Select address type",
              })}
            >
              <option value="">Address Type</option>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="work">Office</option>
            </select>
            {errors.addressType && (
              <span className="text-sm text-red-600">
                {errors.addressType.message}
              </span>
            )}
          </form>
        )}
      </SideDrawer>
    </>
  );
}
