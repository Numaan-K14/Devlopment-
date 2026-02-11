import { Form, Formik } from "formik";
import { SchemaValidation } from "../Schemas/SchemasValidations";
import { CustomInput } from "../Components/CustomInput";
import { CustomButton } from "../Components/CustomButton";

export function CleanRegistration() {
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit = (values) => {
    console.log("Form submitted with values:", values);
  };

  return (
    <section className="flex w-full min-h-screen ">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={SchemaValidation}
        validateOnMount
      >
        {({ isValid }) => (
          <Form className="flex w-[55%] flex-col items-center justify-center  mx-20 gap-4">
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <CustomInput name="email" type="email" placeholder="email" />
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
            <CustomButton label="Register" isValid={isValid} />
          </Form>
        )}
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
