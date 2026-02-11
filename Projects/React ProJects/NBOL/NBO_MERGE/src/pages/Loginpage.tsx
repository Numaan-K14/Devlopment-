import { axios } from "@/config/axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface LoginFormTypes {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginAPIResponse {
  data: {
    accessToken: string;
    user: string | unknown;
  };
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const loginAPI = async (data: { email: string; password: string }) => {
    const URL = `${`/user/login`}`;
    const res = await axios.post<LoginAPIResponse>(URL, data);
    return res.data;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormTypes>();

  const onSubmit: SubmitHandler<LoginFormTypes> = async (formData) => {
    try {
      const res: LoginAPIResponse = await loginAPI({
        email: formData.email,
        password: formData.password,
      });

      console.log("LOGIN PAGE RESPONSE:", res);
      navigate(0);

      if (res.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <section className="w-full grid grid-cols-2 h-screen font-inter bg-white">
        {/* ---------------- Left Section ---------------- */}
        <div className="w-[70%] flex flex-col justify-center items-center mx-auto">
          <div className="mb-10">
            <h1 className="font-semibold text-3xl leading-[38px] text-[#181D27] mb-2">
              Welcome back
            </h1>
            <p className="text-[#535862] text-md leading-6">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* ----------- Email -------------- */}
            <div>
              <label className="text-[#414651] font-medium text-base mb-1.5 leading-6 flex">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "This field is required" })}
                className="w-full outline outline-[#D5D7DA] rounded-md placeholder:font-normal placeholder:text-[#717680] placeholder:text-base px-3.5 py-2.5"
              />
              {errors.email && (
                <span className="text-xs text-red-600 mt-1 flex">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* ----------- Password ------------- */}
            <div>
              <label className="text-[#414651] font-medium text-base mb-1.5 leading-6 flex">
                Password
              </label>
              <div className="relative">
                <input
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "This field is required",
                  })}
                  className="w-full outline outline-[#D5D7DA] rounded-md placeholder:font-normal placeholder:text-[#717680] placeholder:text-base px-3.5 py-2.5"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#717680] cursor-pointer"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-600 mt-1 flex">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* ----------- Remember & Forgot Password ------------- */}
            <div className="flex justify-between items-center gap-4">
              <label className="flex items-center space-x-2 text-sm text-[#414651]">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="w-4 h-4 rounded-sm accent-[#265BB8]"
                />
                <span className="font-medium text-sm leading-5 text-[#414651]">
                  Remember for 30 days
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-[#1F4B9E] font-semibold text-sm leading-5 hover:underline"
              >
                Forgot password
              </a>
            </div>

            {/* ----------- Buttons ------------- */}
            <button
              type="submit"
              className="w-full bg-[#265BB8] py-2.5 text-base font-semibold text-white leading-6 rounded-lg hover:bg-[#154091] hover:ring-2 hover:ring-[#154091] cursor-pointer"
            >
              Sign in
            </button>

            {/* <button
              type="button"
              className="w-full border border-[#D5D7DA] py-2.5 text-base font-semibold text-[#414651] leading-6 rounded-lg flex justify-center items-center hover:bg-[#d5d8dbe3] hover:ring-2 hover:ring-[#D5D7DA] cursor-pointer"
            >
              <img
                src="icons/Social-icon.png"
                alt="Google icon"
                className="w-5 h-5 mr-3"
              />
              Sign in with Google
            </button> */}
          </form>
        </div>

        {/* ---------------- Right Section ---------------- */}
        <div className="w-full h-full">
          <img
            src="images/Section.svg"
            alt="Section"
            className="w-full h-svh object-cover rounded-tl-4xl rounded-bl-4xl"
          />
        </div>
      </section>
    </>
  );
}
