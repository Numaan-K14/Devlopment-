import CustomButton from "@/components/button";
import CustomInput from "@/components/inputs/custom-input";
import { axios } from "@/config/axios";
import { LoginInterface } from "@/interfaces/login";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import ForgotPass from "./components/ForgotPass";
// import { Checkbox } from "@/components/ui/checkbox";
export const LoginPage = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("users_obj");
  const user_obj = user && JSON.parse(user);
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [email, setEmail] = useState("");

  const [openForgotPass, setOpenForgotPass] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post(`/user/login`, data),
    onSuccess: (resp: any) => {
      let data = resp?.data?.data;
      if (!data) {
        // toast.error(resp?.response?.data?.message || "Something went wrong!");
        return false;
      }
      localStorage.setItem("token", data?.accessToken);
      localStorage.setItem("users_obj", JSON.stringify(data?.user));
      toast.success(data?.message || "Login Successful");
      navigate("/facilities-configuration");
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },

  });

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("This field is required"),
    password: Yup.string().required("This field is required"),
  });

  if (token) {
    return (
      <Navigate
        to={
          user_obj?.role === "admin"
            ? "/client-configuration"
            : user_obj?.role === "participant"
              ? "/dashboard"
              : user_obj?.role === "assessor"
                ? "/assessments"
                : "/client-configuration"
        }
      />
    );
  }

  const handleShowPassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };
  const initialValues: LoginInterface = {
    email: "",
    password: "",
  };

  return (
    <>
      <div className='flex'>
        <div className='w-1/2 flex gap-16  flex-col items-center justify-center !bg-white'>
          <div className=' !h-[573.9px] w-[381px] flex flex-col '>
            <img
              src='/nboleadershiplogo.png'
              alt='nbol leadership logo'
              className='w-[381px] h-[104px]'
            />
            <div className='mt-20'>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  mutate(values);
                }}
                validationSchema={validationSchema}
              >
                {({ values }) => {
                  return (
                    <Form>
                      <div className='flex flex-col gap-4'>
                        <CustomInput
                          name='email'
                          label='Email'
                          className='w-[381px] h-[48px]'
                          type='email'
                          onChange={(e: any) => setEmail(e.target.value)}
                        />
                        <div className='flex relative w-[381px] '>
                          <CustomInput
                            name='password'
                            label='Password'
                            className='w-[381px] h-[48px]'
                            type={type}
                          />
                          <span
                            className='absolute right-3 top-[52px] transform -translate-y-1/2 cursor-pointer'
                            onClick={handleShowPassword}
                          >
                            {type === "password" ? (
                              <FaRegEye />
                            ) : (
                              <FaRegEyeSlash />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className='flex justify-between mt-3'>
                        {/* <span className='flex gap-2 items-center'>
                      <Checkbox />
                      Remember me
                    </span> */}
                        <p
                          className='text-[#2B952B] cursor-pointer'
                          onClick={() => setOpenForgotPass(true)}
                        >
                          Forgot Password
                        </p>
                      </div>
                      <div className='flex flex-col gap-4 mt-20'>
                        {/* <Link to={"clients-config"} className="!w-full"> */}
                        <CustomButton
                          className='!h-[47.73px] w-full'
                          disabled={isPending}
                          isPending={isPending}
                          type='submit'
                        >
                          Sign In
                        </CustomButton>
                        {/* </Link> */}
                        {/* <CustomButton
                      className="!h-[47.73px] border border-[#2970FF]"
                      variant="outline"
                    >
                      Register
                    </CustomButton> */}
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
        <div className='w-1/2 '>
          <div className='relative'>
            <div
              className='!w-[533px] !h-[102.21px] absolute flex items-center bottom-0 text-lg  left-1/2 text-white  text-center bg-white/30 backdrop-blur-sm rounded-[8.45px]'
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <h2 className='text-lg w-full '>
                An assessment tool designed to evaluate, analyze, and <br />{" "}
                enhance performance
              </h2>
            </div>
            <img
              src='/icons/sean-pollock-PhYq704ffdA-unsplash 1.webp'
              alt=''
              className='!w-full !h-svh'
            />
          </div>
        </div>
        {openForgotPass && (
          <ForgotPass handleClose={setOpenForgotPass} email={email} />
        )}
      </div>
    </>
  );
};
