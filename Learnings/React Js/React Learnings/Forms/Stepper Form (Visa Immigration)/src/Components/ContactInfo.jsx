import { useForm } from "react-hook-form";
import { FaLocationDot } from "react-icons/fa6";
import { GrFormNextLink } from "react-icons/gr";
import { IoMdMailUnread } from "react-icons/io";
import { IoCallSharp } from "react-icons/io5";
import { RxCountdownTimer } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";

export function ContactInfo() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
 const navigate = useNavigate();
 const location = useLocation();
 const PersonalInfo = location.state;

 const onSubmit = (data) => {
   navigate("/Document", {
     state: {
       PersonalInfo: PersonalInfo,
       ContactInfo: data, 
     },
   });
 };

  // console.log(watch("example"));

  return (
    <>
      <section className="w-full flex">
        <div className="relative w-[30%] bg-linear-to-b from-blue-100 via-blue-200 to-blue-500 p-10 flex flex-col justify-center text-center overflow-hidden shadow-2xl border-r border-blue-200">
          {/* Decorative glowing orbs */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>

          {/* Content Layer */}
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-900 to-blue-600 mb-5 drop-shadow-md tracking-wide">
              Contact Support
            </h1>

            <p className="text-lg text-gray-700 font-medium mb-8 px-4 leading-relaxed">
              Need help or have questions about your visa application? Our
              support team is here to assist you professionally.
            </p>

            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:scale-[1.02]">
              <h2 className="text-2xl font-semibold text-blue-800 mb-3">
                Get in Touch
              </h2>
              <ul className="text-gray-700 text-sm leading-relaxed space-y-4 text-left">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm">
                    <IoCallSharp />
                  </span>
                  <span>+91 9156538381</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm">
                    <IoMdMailUnread />
                  </span>
                  <span>numaankazi145@gmail.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm">
                    <FaLocationDot />
                  </span>
                  <span>One Place, Wanowire, Pune</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm">
                    <RxCountdownTimer />
                  </span>
                  <span>Mon–Fri: 9:00 AM – 6:00 PM</span>
                </li>
              </ul>

              {/* Subtle underline animation */}
              <div className="mt-5 h-0.5 w-0 bg-blue-500 group-hover:w-full transition-all duration-900 mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto w-[70%] p-6">
          <h1 className="text-3xl font-extrabold tracking-tighter text-blue-400 border-b-2 pb-3 mb-6">
            Contact & Immediate Family
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            {/* ------ Email Address------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Email Address
                <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Your Valid Email"
                {...register("Email", {
                  required: "Please Enter Email",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Email && (
                <span className="text-xs text-red-600">
                  {errors.Email.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* ------- Mobile Number--------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Mobile Number<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Mobile Number"
                type="number"
                {...register("Mobile_Number", {
                  required: "Please Enter Mobile Number",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Mobile_Number && (
                <span className="text-xs text-red-600">
                  {errors.Mobile_Number.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* -------Alternate Mobile Number------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Alternate Mobile Number
              </label>
              <input
                placeholder="Enter Your  Alternate Number”"
                {...register("Alternate_Mobile_Number")}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
            </div>
            {/* -------------------- */}
            {/* ------- Residential Address------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Residential Address
              </label>
              <input
                placeholder="Enter Your Residential"
                {...register("Residential_Address")}
                type="text"
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
            </div>
            {/* -------------------- */}
            {/* ---------Country of Residence---------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Country of Residence<span className="text-red-600">*</span>
              </label>
              <select
                id="Country_Resident"
                {...register("Country_Resident", {
                  required: "Please select Country of Residences",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              >
                <option value="">--Select status--</option>
                <option value="India">India</option>
                <option value="Thailand">Thailand</option>
                <option value="Malaysia ">Malaysia </option>
                <option value="Indonesia">Indonesia</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Maldives">Maldives</option>
              </select>
              {errors.Country_Resident && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Country_Resident.message}
                </p>
              )}
            </div>
            {/* -------------------- */}
            {/* ---------City----------- */}
            <div>
              <label className="text-black text-sm font-medium">
                City<span className="text-red-600">*</span>
              </label>
              <input
              placeholder="Enter City Here"
                {...register("City", {
                  required: "Please select your City",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
              {errors.City && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.City.message}
                </p>
              )}
            </div>
            {/* -------------------- */}
            {/* ---------Postal Code--------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Postal Code
              </label>
              <input
                placeholder="Enter Postal Code"
                type="text"
                {...register("Postal_Code")}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
            </div>
            {/* ---------Preferred Communication Language----------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Preferred Communication Language
                <span className="text-red-600">*</span>
              </label>
              <select
                placeholder="Enter Your Resident's Address"
                {...register("Communication_Language", {
                  required: "Please Enter Language",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              >
                <option value="">--Select status--</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Arabic ">Arabic </option>
                <option value="Other">Other</option>
              </select>
              {errors.Communication_Language && (
                <span className="text-xs text-red-600">
                  {errors.Communication_Language.message}
                </span>
              )}
            </div>
            {/* --------   Emergency Contact Name--------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Emergency Contact Name<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Emergency Contact Name"
                type="text"
                {...register("Emergency_Contact_Name", {
                  required: "Please Enter Emergency Contact Name",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Emergency_Contact_Name && (
                <span className="text-xs text-red-600">
                  {errors.Emergency_Contact_Name.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* -------Relationship with Emergency Contact-------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Relationship with Emergency Contact
              </label>
              <select
                type="date"
                {...register("Relation_Emergency_Contact")}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              >
                <option value="">--Select status--</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sister ">Sister </option>
                <option value="Friend">Friend</option>
                <option value="Relative">Relative</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* -------------------- */}
            {/* --------CheckBox------------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Has any family member previously immigrated?
              </label>
              <input
                type="checkbox"
                {...register("Selected")}
                className="ml-2"
              />
            </div>
            {/* -------------------- */}

            <button
              type="submit"
              className="bg-blue-400 text-white font-bold text-lg p-2 rounded-lg  w-full col-span-full hover:bg-blue-200"
            >
              Next
              <GrFormNextLink className="inline-block text-2xl mb-1" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
