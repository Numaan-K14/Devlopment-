"use client";
import { CustomInput } from "@/components/Inputs/input";
import { Validation } from "@/schemas/Validation";
import { Form, Formik, FormikHelpers } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

function Login() {
  const router = useRouter();
  const initialValues: FormValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    localStorage.setItem("token", JSON.stringify(values?.email));
    //  setTimeout(() => {
    router.push("/Landing");
    //  }, 1000);
    console.log("Form submitted with values:", values);
    resetForm();
  };
  /* |*/
  return (
    <div className="relative min-h-screen bg-linear-to-r from-[#02071c] to-[#011b63]">
      <section
        className="shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-auto w-[75%] bg-white    rounded-tl-[200px] rounded-br-[120px]"
      >
        <div className="relative w-1/2">
          <Image
            src="/images/Login.jpg"
            alt="Login Image"
            fill
            className="object-cover  rounded-tl-[150px] "
            priority
          />
          <div className="absolute inset-0 bg-blue-800/20 rounded-tl-[150px]"></div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center text-white">
            <h1 className="text-4xl font-bold">Manage your Gym Efficiently.</h1>
            <p className="mt-4 max-w-md text-lg">
              Use a single dashboard to manage registration, members and
              administration tasks.
            </p>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center p-6">
          <Formik<FormValues>
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={Validation}
          >
            <Form className="w-full max-w-md flex flex-col gap-5">
              <div className="flex flex-col gap-2 py-6">
                <h2 className="text-4xl text-[#09163E] font-bold">
                  Hey, youre back!
                </h2>
                <p className="text-gray-600 text-2xl ">
                  Log in to your account
                </p>
              </div>

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
                className="mt-2 rounded-xl bg-[#09163E] py-3 text-white transition hover:bg-gray-800"
              >
                Sign Up
              </button>

              <p className="text-sm text-gray-500 text-center">
                I agree to the Terms & Privacy Policy.
              </p>
            </Form>
          </Formik>
        </div>
      </section>
    </div>
  );
}

export default Login;
