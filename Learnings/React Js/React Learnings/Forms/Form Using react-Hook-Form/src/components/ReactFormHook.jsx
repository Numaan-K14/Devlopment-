import { useForm } from "react-hook-form";

export function ReactFormHook() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login Form (React Hook Form)
        </h1>
        {/* -----------------------------------UserName------------------------------------------- */}
        <label className="mb-1 text-sm font-semibold text-gray-600">
          Username
        </label>

        <input
          {...register("username", {
            pattern: /^[A-Za-z]+$/i,
            required: "This filed is required",
          })}
          placeholder="Enter your username"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {errors.username && (
          <p className="text-sm text-red-500 mb-3">{errors.username.message}</p>
        )}

        {/* --------------------------------------------------------------------------------------------- */}

        {/* -------------------------------------Password--------------------------------------------- */}

        <label className=" mb-1 text-sm font-semibold text-gray-600">
          Password  
        </label>
        <input
          type="password"
          autoComplete="on"
          {...register("password", { required: "Password is required" })}
          placeholder="Enter your password"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mb-3">{errors.password.message}</p>
        )}
        {/* ----------------------------------------------------------------------------------- */}

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
