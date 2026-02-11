import { useForm } from "react-hook-form";
// import { FaPlay } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
// import { GrFormNextLink } from "react-icons/gr";

export function StudentDetails() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
   const navigate = useNavigate();

  const onSubmit = (data) => {
     navigate("/ParentDetails",{state:data});
  };

  // console.log(watch("example"));

  return (
    <>
      <div className="w-full flex">
        <div className="w-[50%]">
          <img
            src="Purple.jpg"
            alt="students details"
            className="object-cover h-screen w-full opacity-80 "
          />
        </div>
        {/* ------------Students Details Form-------------------- */}
        <div className="w-[50%] h-screen p-6 overflow-y-auto">
          {/* <h1 className="text-xl font-bold border-b-4  text-[#735cc7] py-3 flex">
            Student Registration Portal{" "}
            <FaPlay className="mx-2 my-1 cursor-progress" />
          </h1> */}
          <h1 className="flex items-center text-xl font-bold text-[#735cc7] my-6">
            <span className="border-l-4 border-[#735cc7] h-[1em] mr-2"></span>
            Students Details Form
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            <div>
              <label className="text-black text-sm font-medium">
                Full Name<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Your Name"
                {...register("Students_Fullname", {
                  required: "Please Enter Fullname",
                })}
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Students_Fullname && (
                <span className="text-xs text-red-600">
                  {errors.Students_Fullname.message}
                </span>
              )}
            </div>

            {/* --------------------- */}
            <div>
              {" "}
              <label className="text-black text-sm font-medium">
                Date of Birth<span className="text-red-600">*</span>
              </label>
              <input
                {...register("Students_DateOfBirth", {
                  required: " Please Enter Date Of Birth",
                })}
                type="date"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Students_DateOfBirth && (
                <span className="text-xs text-red-600">
                  {errors.Students_DateOfBirth.message}
                </span>
              )}
            </div>

            {/* -------------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Aadhaar Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter 12-digit Aadhaar number"
                {...register("Students_Aadhaar", {
                  required: " Please Enter Aadhaar Details",
                })}
                type="number"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Students_Aadhaar && (
                <span className="text-xs text-red-600">
                  {errors.Students_Aadhaar.message}
                </span>
              )}
            </div>

            {/* ------------------ */}
            <div>
              <label className="text-black text-sm font-medium">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Mobile Number"
                {...register("Students_Mobile", {
                  required: " Please Enter Mobile Number",
                })}
                type="number"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Students_Mobile && (
                <span className="text-xs text-red-600">
                  {errors.Students_Mobile.message}
                </span>
              )}
            </div>

            {/* ----------- */}
            <div>
              <label className="text-black text-sm font-medium">Email</label>
              <input
                placeholder="Enter Your Email"
                {...register("Students_email")}
                type="email"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
            </div>
            {/* --------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Address <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Enter Address"
                {...register("Students_Address", {
                  required: " Please Enter Current Address",
                })}
                type="text"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Students_Address && (
                <span className="text-xs text-red-600">
                  {errors.Students_Address.message}
                </span>
              )}
            </div>

            {/* -------------------------------- */}
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
            <button
              type="submit"
              className="bg-[#735cc7] text-white font-bold text-lg p-2 rounded-lg  w-full col-span-full hover:bg-[#8e82d1]"
            >
              Continue <GrFormNextLink className="inline-block text-2xl mb-1" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
