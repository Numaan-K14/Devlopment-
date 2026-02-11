import { Formik, Form, Field, ErrorMessage } from "formik";
import { SchemaValidation } from "../Schemas/SchemasValidations";

export function Registration() {
  return (
    <section className="flex w-full min-h-screen bg-[#ebe9ee73]">
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={SchemaValidation} // Yup validation connected here
        onSubmit={(values, { resetForm }) => {
          console.log(values);
          resetForm();
        }}
      >
        {/* Formik gives form state automatically to <Form> */}
        <Form className="flex w-[55%] mx-auto flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-semibold">Create Account</h2>

          <Field
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-md border px-4 py-2 bg-white focus:outline-none"
          />
          <ErrorMessage
            name="email"
            component="p" //Render the error message inside a <p> HTML tag
            className="text-red-500 text-sm"
          />

          <Field
            name="password"
            type="password"
            placeholder="Password"
            className="rounded-md border px-4 py-2 bg-white focus:outline-none"
          />
          <ErrorMessage
            name="password"
            component="p" //Render the error message inside a <p> HTML tag
            className="text-red-500 text-sm"
          />

          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="rounded-md border px-4 py-2 bg-white focus:outline-none"
          />
          <ErrorMessage
            name="confirmPassword"
            component="p" //Render the error message inside a <p> HTML tag
            className="text-red-500 text-sm"
          />

          <button
            type="submit"
            className="rounded-md bg-black px-10 py-2 text-white hover:opacity-90"
          >
            Register
          </button>
        </Form>
      </Formik>

      <div className="w-[45%]">
        <img
          src="LoginImg.jpg"
          alt="Register"
          className="h-screen w-full object-cover"
        />
      </div>
    </section>
  );
}
