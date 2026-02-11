import { useForm } from "react-hook-form";
import { FaPlay } from "react-icons/fa";

export function AddmissionDetails() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  // console.log(watch("example"));

  return (
    <>
      <div className="w-full flex">
        <div className="w-[50%]">
          <img
            src="Students.jpg"
            alt="students details"
            className="object-cover h-screen w-full opacity-80"
          />
        </div>

        <section className="w-[50%] h-screen p-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ------------Students Details Form-------------------- */}

            <h1 className="text-xl font-bold border-b-4  text-[#aa6d37] py-3  flex">
              Student Registration Portal{" "}
              <FaPlay className="mx-2 my-1 cursor-progress" />
            </h1>
            <h1 className="flex items-center text-xl font-bold text-[#aa6d37] my-6">
              <span className="border-l-4 border-[#aa6d37] h-[1em] mr-2"></span>
              Students Details Form
            </h1>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-black text-sm font-medium">
                  Full Name<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Your Name"
                  {...register("Students_Fullname", {
                    required: "Please Enter Fullname",
                  })}
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
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
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
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
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
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
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
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
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
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
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
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
            </div>

            {/* ----------------------------------Parents Section------------------------------------ */}
            <h1 className="flex items-center text-xl font-bold text-[#aa6d37] my-6">
              <span className="border-l-4 border-[#aa6d37] h-[1em] mr-2"></span>
              Parents Details Form
            </h1>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-black text-sm font-medium">
                  Guardians Name<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Your Name"
                  {...register("Guardians_Name", {
                    required: "Please Enter Fullname",
                  })}
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs placeholder:text-gray-600 placeholder:font-semibold "
                />
                {errors.Guardians_Name && (
                  <span className="text-xs text-red-600">
                    {errors.Guardians_Name.message}
                  </span>
                )}
              </div>
              {/* ---------------------------------------------------------------------------------------- */}
              <div>
                <label className="text-black text-sm font-medium">
                  Guardians DOB<span className="text-red-600">*</span>
                </label>
                <input
                  {...register("Guardians_BirthInfo", {
                    required: " Please Enter Date Of Birth",
                  })}
                  type="date"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 text-xs  placeholder:text-gray-600 placeholder:font-semibold"
                />
                {errors.Guardians_BirthInfo && (
                  <span className="text-xs text-red-600">
                    {errors.Guardians_BirthInfo.message}
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
                  {...register("Guardians_AadhaarNo", {
                    required: " Please Enter Aadhaar Details",
                  })}
                  type="number"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
                />
                {errors.Guardians_AadhaarNo && (
                  <span className="text-xs text-red-600">
                    {errors.Guardians_AadhaarNo.message}
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
                  {...register("Guardians_MobileNo", {
                    required: " Please Enter Mobile Number",
                  })}
                  type="number"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
                />
                {errors.Guardians_MobileNo && (
                  <span className="text-xs text-red-600">
                    {errors.Guardians_MobileNo.message}
                  </span>
                )}
              </div>
              {/* -------------------------------------------------------------------------------------------------- */}

              <div>
                <label className="text-black text-sm font-medium">
                  Relationship to Student
                  <span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Enter Address"
                  {...register("Guardians_Relation", {
                    required: " Please Enter Relation",
                  })}
                  type="text"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2 placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
                />
                {errors.Guardians_Relation && (
                  <span className="text-xs text-red-600">
                    {errors.Guardians_Relation.message}
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
                  {...register("Guardians_Address", {
                    required: " Please Enter Current Address",
                  })}
                  type="text"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
                />
                {errors.Guardians_Address && (
                  <span className="text-xs text-red-600">
                    {errors.Guardians_Address.message}
                  </span>
                )}
              </div>
              {/* -------------------------------------------------------------------------------------------------- */}
              {/* -------------------------------------------------------------------------------------------------- */}
              <div>
                <label className="text-black text-sm font-medium">Email</label>
                <input
                  placeholder="Enter Your Email"
                  {...register("Guardians_email")}
                  type="email"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
                />
              </div>
              {/* -------------------------------------------------------------------------------------------------- */}
              <div>
                <label className="text-black text-sm font-medium">
                  Occupation{" "}
                </label>
                <input
                  placeholder="Enter Enter Address"
                  {...register("Guardians_Occupation")}
                  type="text"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
                />
              </div>
              {/* -------------------------------------------------------------------------------------------------- */}
              {/* -------------------------------------------------------------------------------------------------- */}
              {/* <div>
                <label className="text-black text-sm font-medium">
                  Document
                </label>
                <input
                  placeholder="Enter Enter Address"
                  {...register("Guardians_Document")}
                  type="file"
                  className="outline outline-[#aa6d37] focus:ring-2 focus:ring-[#aa6d37] w-full rounded p-2  placeholder:text-xs placeholder:text-gray-600 placeholder:font-semibold"
                />
              </div> */}
              {/* -------------------------------------------------------------------------------------------------- */}
              <button
                type="submit"
                className="bg-[#aa6d37] text-white font-bold text-lg p-2 rounded-lg  w-full col-span-full"
              >
                Submit
              </button>
              {/* -------------------------------------------Ends Here------------------------------------------- */}
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
