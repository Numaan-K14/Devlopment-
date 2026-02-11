import { useForm } from "react-hook-form";
// import { FaPlay } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export function ParentDetails() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const studentData = location.state;
  

  const onSubmit = (data) => {
    // console.log(data);
    const CombineData = {
      Parent : data,
      Student: studentData,
    }
    console.log(CombineData)
  };

  // console.log(watch("example"));

  return (
    <>
      <div className="w-full flex ">
        <div className="w-[50%]">
          <img
            src="Purple.jpg"
            alt="students details"
            className="object-cover h-screen w-full opacity-80"
          />
        </div>
        <div className="w-[50%] h-screen p-6 ">
          {/* <h1 className="text-xl font-bold border-b-4  text-[#735cc7] py-3 flex">
            Parents Registration Portal{" "}
            <FaPlay className="mx-2 my-1 cursor-progress" />
          </h1> */}
          <h1 className="flex items-center text-xl font-bold text-[#735cc7] my-6">
            <span className="border-l-4 border-[#735cc7] h-[1em] mr-2"></span>
            Parents Details Form
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            <div>
              <label className="text-black text-sm font-medium">
                Guardians Name<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Your Name"
                {...register("Fullname", { required: "Please Enter Fullname" })}
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
              />
              {errors.Fullname && (
                <span className="text-xs text-red-600">
                  {errors.Fullname.message}
                </span>
              )}
            </div>
            {/* ---------------------------------------------------------------------------------------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Guardians DOB<span className="text-red-600">*</span>
              </label>
              <input
                {...register("DateOfBirth", {
                  required: " Please Enter Date Of Birth",
                })}
                type="date"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 text-xs  placeholder:text-gray-600 placeholder:font-semibold"
              />
              {errors.DateOfBirth && (
                <span className="text-xs text-red-600">
                  {errors.DateOfBirth.message}
                </span>
              )}
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Aadhaar Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter 12-digit Aadhaar number"
                {...register("Aadhaar", {
                  required: " Please Enter Aadhaar Details",
                })}
                type="number"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
              {errors.Aadhaar && (
                <span className="text-xs text-red-600">
                  {errors.Aadhaar.message}
                </span>
              )}
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Mobile Number"
                {...register("Mobile", {
                  required: " Please Enter Mobile Number",
                })}
                type="number"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
              {errors.Mobile && (
                <span className="text-xs text-red-600">
                  {errors.Mobile.message}
                </span>
              )}
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}

            <div>
              <label className="text-black text-sm font-medium">
                Relationship to Student <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Enter Address"
                {...register("relation", {
                  required: " Please Enter Relation",
                })}
                type="text"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2 placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
              {errors.relation && (
                <span className="text-xs text-red-600">
                  {errors.relation.message}
                </span>
              )}
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Address <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Enter Address"
                {...register("Address", {
                  required: " Please Enter Current Address",
                })}
                type="text"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
              {errors.Address && (
                <span className="text-xs text-red-600">
                  {errors.Address.message}
                </span>
              )}
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}
            {/* -------------------------------------------------------------------------------------------------- */}
            <div>
              <label className="text-black text-sm font-medium">Email</label>
              <input
                placeholder="Enter Your Email"
                {...register("email")}
                type="email"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}
            <div>
              <label className="text-black text-sm font-medium">
                Occupation{" "}
              </label>
              <input
                placeholder="Enter Enter Address"
                {...register("Occupation")}
                type="text"
                className="outline outline-[#735cc7] focus:ring-2 focus:ring-[#735cc7] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
              />
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}
            <button
              type="submit"
              className="bg-[#735cc7] text-white font-bold text-lg p-2 rounded-lg w-full col-span-full hover:bg-[#8e82d1]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
