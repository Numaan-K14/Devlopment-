import { useForm } from "react-hook-form";
// import { FaLocationDot } from "react-icons/fa6";
import { GrFormNextLink } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
// import { IoMdMailUnread } from "react-icons/io";
// import { IoCallSharp } from "react-icons/io5";
// import { RxCountdownTimer } from "react-icons/rx";

export function Document() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
const { PersonalInfo, ContactInfo } = location.state || {};
  const onSubmit = (data) => {
    const combined = {
      documentData: data,
      PersData:PersonalInfo,
      ConInfo:ContactInfo,
    };
    navigate("/Profile",{state:combined});
    // console.log(combined)
  }

  // console.log(watch("example"));

  return (
    <>
      <section className="w-full flex">
        <div className="w-[30%]">
          <img src="Visa.jpg" alt="Visa" className="object-cover h-screen " />
        </div>
        <div className=" w-[70%] p-6">
          <h1 className="text-3xl font-extrabold tracking-tighter text-blue-400 border-b-2 pb-3 mb-6">
            Document Verification
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6 overflow-y"
          >
            {/* ------ Previous Passports------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Previous Passports Details
                <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="XXXX XXXX XXXX 1234"
                type="number"
                {...register("Previous_Passports", {
                  required: "Please Fill Given Info",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Previous_Passports && (
                <span className="text-xs text-red-600">
                  {errors.Previous_Passports.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* ------ Birth Certificate------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Birth Certificate<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Registration Code"
                type="Text"
                {...register("Birth_Certificate", {
                  required: "Please Fill Given Info",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Birth_Certificate && (
                <span className="text-xs text-red-600">
                  {errors.Birth_Certificate.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* ------ Visa Application Form------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Visa Application Form<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Visa Application Form ID"
                type="text"
                {...register("Visa_Application", {
                  required: "Please Fill Given Info",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Visa_Application && (
                <span className="text-xs text-red-600">
                  {errors.Visa_Application.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* ------ Email Address------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Flight Bookings Details<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Booking PRN Number"
                type="number"
                {...register("Bookings_Details", {
                  required: "Please Fill Given Info",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Bookings_Details && (
                <span className="text-xs text-red-600">
                  {errors.Bookings_Details.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            {/* ------ Police Clearance Certificate----- */}
            <div>
              <label className="text-black text-sm font-medium">
                Police Clearance Certificate
                <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Police Clearance (ommmmmmm )NOC Number"
                type="number"
                {...register("Mobile_Number", {
                  required: "Please Fill Given Info",
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
            {/* ------ Passport-size Photograph----- */}
            <div>
              <label className="text-black text-sm font-medium">
                Passport-size Photograph<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Choose Image (om )From Files PDF"
                type="file"
                {...register("Photo", {
                  required: "Please Upload Image",
                })}
                className="outline outline-blue-400 focus:ring-2 focus:ring-blue-400 w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Photo && (
                <span className="text-xs text-red-600">
                  {errors.Photo.message}
                </span>
              )}
            </div>
            {/* -------------------- */}
            <div>
              <p className="text-black text-md font-medium">
                All Documents Approved ?<span className="text-red-600">*</span>
              </p>
              <label className="mr-4 text-gray-600 text-sm font-medium">
                <input
                  type="radio"
                  value="Yes"
                  {...register("Documents_Approved", {
                    required: "Please Select Further Option",
                  })}
                />
               Yes
              </label>
              <label className="mr-4 text-gray-600 text-sm font-medium">
                <input
                  type="radio"
                  value="No"
                  {...register("Documents_Approved", {
                    required: "Please Select Further Option",
                  })}
                />
               No
              </label>
              {errors.Documents_Approved && (
                <span className="text-xs text-red-600 flex">
                  {errors.Documents_Approved.message}
                </span>
              )}
            </div>
            {/* -------------- */}
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
