"use client";
import { CustomInput } from "@/components/Inputs/input";
import { Validation } from "@/schemas/Validation";
import { Form, Formik, FormikHelpers } from "formik";
import Image from "next/image";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

function Login() {
  const initialValues: FormValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    console.log("Form submitted with values:", values);
    resetForm();
  };
  return (
    <section className="flex min-h-screen w-full">
      <div className="relative w-1/2">
        <Image
          src="/images/Login.jpg"
          alt="Login Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-800/20"></div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 text-white">
          <h1 className="text-4xl font-bold">Manage your Gym Efficiently.</h1>
          <p className="mt-4 max-w-md text-lg">
            Use a single dashboard to manage registration, members and
            administration tasks.
          </p>
        </div>
      </div>

      {/* <div className="relative w-1/2 ">
        <Image
          src="/images/Form-bg.jpg"
          alt="Form Background"
          fill
          className="object-cover"
        />
        <Formik<FormValues>
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={Validation}
        >
          <Form className="absolute inset-0  flex w-full h-full flex-col gap-5  p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-center">Create Account</h2>

            <CustomInput name="email" type="email" placeholder="Email" />

            <CustomInput
              name="password"
              type="password"
              placeholder="Password"
            />

            <CustomInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />

            <button
              type="submit"
              className="mt-4 rounded-xl bg-black py-3 text-white transition hover:bg-gray-800"
            >
              Sign Up
            </button>
          </Form>
        </Formik>
      </div> */}
      <div className="relative w-1/2 flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="/images/Form-bg.jpg"
          alt="Form Background"
          fill
          className="object-cover"
        />

        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <Formik<FormValues>
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={Validation}
        >
          <Form className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex flex-col gap-5">
            <h2 className="text-3xl font-bold text-center">Create Account</h2>

            <CustomInput name="email" type="email" placeholder="Email" />

            <CustomInput
              name="password"
              type="password"
              placeholder="Password"
            />

            <CustomInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />

            <button
              type="submit"
              className="mt-4 rounded-xl bg-black py-3 text-white transition hover:bg-gray-800"
            >
              Sign Up
            </button>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default Login;
