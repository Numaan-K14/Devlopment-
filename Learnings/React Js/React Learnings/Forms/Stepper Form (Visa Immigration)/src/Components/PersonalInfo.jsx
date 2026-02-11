import { useForm } from "react-hook-form";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export function PersonalInfo() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
  
    const navigate = useNavigate();
    const onSubmit = (data) => {
     
      navigate("/ContactInfo", { state: data });
  } 

  // console.log(watch("example"));

  return (
    <>
      <section className="w-full flex">
        <div className="relative w-[30%] bg-linear-to-b from-blue-100 via-blue-200 to-blue-500 p-10 flex flex-col justify-center text-center overflow-hidden shadow-2xl border-r border-blue-200">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>

          {/* Content Layer */}
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-900 to-blue-600 mb-5 drop-shadow-md tracking-wide">
              Visa Immigration Portal
            </h1>

            <p className="text-lg text-gray-700 font-medium mb-8 px-4 leading-relaxed">
              Please fill the form carefully and professionally to ensure smooth
              visa processing.
            </p>

            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:scale-[1.02]">
              <h2 className="text-2xl font-semibold text-blue-800 mb-3">
                Important Instructions
              </h2>
              <ul className="text-gray-700 text-sm leading-relaxed space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-px">•</span>
                  <span>Ensure all details match your official documents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-px">•</span>
                  <span>Use proper capitalization (e.g., “John Doe”).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-px">•</span>
                  <span>Avoid abbreviations unless required.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 text-lg mt-px">•</span>
                  <span>Review all entered information before submitting.</span>
                </li>
              </ul>

              {/* subtle underline animation */}
              <div className="mt-5 h-0.5 w-0 bg-blue-500 group-hover:w-full transition-all duration-900 mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto w-[70%] p-6">
          <h1 className="text-3xl font-extrabold tracking-tighter text-blue-400 border-b-2 pb-3 mb-6">
            Personal & Passport Information
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            {/* --------Name-------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Full Name (as per Passport)
                <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Your Name"
                {...register("Students_Fullname", {
                  required: "Please Enter Fullname",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Students_Fullname && (
                <span className="text-xs text-red-600">
                  {errors.Students_Fullname.message}
                </span> 
              )}
            </div>
            {/* -------------------- */}
            {/* --------D-O-B---------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Date of Birth<span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register("Date_of_Birth", {
                  required: "Please Enter Date Of Birth",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Date_of_Birth && (
                <span className="text-xs text-red-600">
                  {errors.Date_of_Birth.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* --------Passport Number------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Passport Number<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Your Passport “N1234567”"
                {...register("Passport_Number", {
                  required: "Please Enter Passport Number",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Passport_Number && (
                <span className="text-xs text-red-600">
                  {errors.Passport_Number.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* --------Aadhar Number------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Aadhaar Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter 12-digit Aadhaar number"
                {...register("Your_Aadhaar", {
                  required: " Please Enter Aadhaar Details",
                })}
                type="number"
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Your_Aadhaar && (
                <span className="text-xs text-red-600">
                  {errors.Your_Aadhaar.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* ---------Marital_Status---------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Marital Status<span className="text-red-600">*</span>
              </label>
              <select
                id="maritalStatus"
                {...register("maritalStatus", {
                  required: "Please select your marital status",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              >
                <option value="">--Select status--</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.maritalStatus && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maritalStatus.message}
                </p>
              )}
            </div>
            {/* -------------------- */}
            {/* ---------Nationality----------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Nationality<span className="text-red-600">*</span>
              </label>
              <select
                id="Nationality"
                {...register("Nationality", {
                  required: "Please select your Nationality",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold"
              >
                <option value="">--Select status--</option>
                <option value="India">India</option>
                <option value="Thailand">Thailand</option>
                <option value="Malaysia ">Malaysia </option>
                <option value="Indonesia">Indonesia</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Maldives">Maldives</option>
              </select>
              {errors.Nationality && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Nationality.message}
                </p>
              )}
            </div>
            {/* -------------------- */}
            {/* ---------Place of Issue---------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Place of Issue<span className="text-red-600">*</span>
              </label>
              <select
                id="Nationality"
                {...register("Place_Issue", {
                  required: "Please select your Place Issue",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold"
              >
                <option value="">Select status</option>
                <option value="India">India</option>
                <option value="Thailand">Thailand</option>
                <option value="Malaysia ">Malaysia </option>
                <option value="Indonesia">Indonesia</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Maldives">Maldives</option>
              </select>
              {errors.Place_Issue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Place_Issue.message}
                </p>
              )}
            </div>
            {/* ---------Current Address----------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Current Address
              </label>
              <input
                placeholder="Enter Your Resident's Address"
                {...register("Current")}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
            </div>
            {/* --------Passport Issue Date--------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Passport Issue Date<span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register("Issue_Date", {
                  required: "Please Enter Issue Date",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Issue_Date && (
                <span className="text-xs text-red-600">
                  {errors.Issue_Date.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* --------Passport Expiry Date--------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Passport Expiry Date<span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register("Expiry_Date", {
                  required: "Please Enter Expiry Date",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Expiry_Date && (
                <span className="text-xs text-red-600">
                  {errors.Expiry_Date.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* ----------Gender---------- */}
            <div>
              <p className="text-black text-md font-medium">
                Gender<span className="text-red-600">*</span>
              </p>
              <label className="mr-4 text-gray-600 text-sm font-medium">
                <input
                  type="radio"
                  value="Male"
                  {...register("Students_gender", {
                    required: "Gender required",
                  })}
                />
                Male
              </label>
              <label className="mr-4 text-gray-600 text-sm font-medium">
                <input
                  type="radio"
                  value="Female"
                  {...register("Students_gender", {
                    required: "Gender required",
                  })}
                />
                Female
              </label>
              {errors.Students_gender && (
                <span className="text-xs text-red-600">
                  {errors.Students_gender.message}
                </span>
              )}
            </div>
            {/* -------------------- */}

            <button
              type="submit"
              className="bg-blue-400 text-white font-bold text-lg p-2 rounded-lg  w-full col-span-full hover:bg-blue-200"
            >
              Continue <GrFormNextLink className="inline-block text-2xl mb-1" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
