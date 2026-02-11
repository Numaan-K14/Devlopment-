Full Name

Date of Birth

Gender

Class / Grade

Roll Number

Address

Mobile Number

Email ID



👨‍👩‍👧 Parent Details

Father’s Name

Mother’s Name

Occupation (Father & Mother)

Contact Number

Email ID

Address (if different from student)

Emergency Contact Name & Number






<div className="w-[50%] h-[109vh] border border-blue-100 shadow-lg shadow-blue-300 p-3">
          <h1 className="text-xl font-bold border-b text-[#CC774F] py-3">
            Students Details Form
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-2">
              <label className="text-gray-600 text-sm font-medium">
                Full Name<span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Your Name"
                {...register("Fullname", { required: "Please Enter Fullname" })}
                className="outline outline-blue-200 focus:ring-2 focus:ring-blue-400 w-full rounded p-1"
              />
              {errors.Fullname && (
                <span className="text-xs text-red-600">
                  {errors.Fullname.message}
                </span>
              )}
            </div>

            {/* ---------------------------------------------------------------------------------------- */}
            <div className="mb-2">
              <label className="text-gray-600 text-sm font-medium">
                Date of Birth<span className="text-red-600">*</span>
              </label>
              <input
                {...register("DateOfBirth", {
                  required: " Please Enter Date Of Birth",
                })}
                type="date"
                className="outline outline-blue-200 focus:ring-2 focus:ring-blue-400 w-full rounded p-1"
              />
              {errors.DateOfBirth && (
                <span className="text-xs text-red-600">
                  {errors.DateOfBirth.message}
                </span>
              )}
            </div>

            {/* -------------------------------------------------------------------------------------------------- */}
            <div className="mb-2">
              {" "}
              <label className="text-gray-600 text-sm font-medium">
                Aadhaar Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter 12-digit Aadhaar number"
                {...register("Aadhaar", {
                  required: " Please Enter Aadhaar Details",
                })}
                type="number"
                className="outline outline-blue-200 focus:ring-2 focus:ring-blue-400 w-full rounded p-1"
              />
              {errors.Aadhaar && (
                <span className="text-xs text-red-600">
                  {errors.Aadhaar.message}
                </span>
              )}
            </div>

            {/* -------------------------------------------------------------------------------------------------- */}
            <div className="mb-2">
              {" "}
              <label className="text-gray-600 text-sm font-medium">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Mobile Number"
                {...register("Mobile", {
                  required: " Please Enter Mobile Number",
                })}
                type="number"
                className="outline outline-blue-200 focus:ring-2 focus:ring-blue-400 w-full rounded p-1"
              />
              {errors.Mobile && (
                <span className="text-xs text-red-600">
                  {errors.Mobile.message}
                </span>
              )}
            </div>

            {/* -------------------------------------------------------------------------------------------------- */}
            <div className="mb-2">
              <label className="text-gray-600 text-sm font-medium">Email</label>
              <input
                placeholder="Enter Your Email"
                {...register("email")}
                type="email"
                className="outline outline-blue-200 focus:ring-2 focus:ring-blue-400 w-full rounded p-1"
              />
            </div>
 {/* -------------------------------------------------------------------------------------------------- */}
            <div className="mb-2">
              <label className="text-gray-600 text-sm font-medium">
                Address <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="Enter Enter Address"
                {...register("Address", {
                  required: " Please Enter Current Address",
                })}
                type="text"
                className="outline outline-blue-200 focus:ring-2 focus:ring-blue-400 w-full rounded p-1"
              />
              {errors.Address && (
                <span className="text-xs text-red-600">
                  {errors.Address.message}
                </span>
              )}
            </div>

            {/* -------------------------------------------------------------------------------------------------- */}
            <div className="mb-2">
              <p className="text-gray-800 text-md font-medium">Gender:</p>
              <label className="mr-4 text-gray-600 text-sm font-medium">
                <input
                  type="radio"
                  value="Male"
                  {...register("gender", { required: "Gender is required" })}
                />
                Male
              </label>
              <label className="mr-4 text-gray-600 text-sm font-medium">
                <input
                  type="radio"
                  value="Female"
                  {...register("gender", { required: "Gender is required" })}
                />
                Female
              </label>
              {errors.gender && (
                <span className="text-xs text-red-600">
                  {errors.gender.message}
                </span>
              )}
            </div>
            {/* -------------------------------------------------------------------------------------------------- */}
            <button
              type="submit"
              className="bg-[#CC774F] text-white font-bold text-lg p-2 rounded-lg w-full flex items-center justify-center gap-1 hover:bg-[#b8653f]"
            >
              Continue <GrFormNextLink className="text-3xl font-extrabold" />
            </button>
          </form>
        </div>