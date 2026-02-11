import { useFormik } from "formik";
import { SchemaValidation } from "../Schemas/SchemasValidations";


export function RegistrationForm() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: SchemaValidation,

    onSubmit: (values, { resetForm }) => {
      console.log(values);
      resetForm();
    },
  });

  return (
    <section className="flex w-full min-h-screen bg-[#ebe9ee73]">
      <form
        onSubmit={formik.handleSubmit}
        className="flex w-[55%] mx-auto flex-col items-center justify-center gap-4"
      >
        <h2 className="text-2xl font-semibold">Create Account</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-md border px-4 py-2 bg-white focus:outline-none"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="rounded-md border px-4 py-2 bg-white focus:outline-none"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="rounded-md border px-4 py-2 bg-white focus:outline-none"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {formik.errors.confirmPassword}
          </p>
        )}

        <button
          type="submit"
          className="rounded-md bg-black px-10 py-2 text-white hover:opacity-90"
        >
          Register
        </button>
      </form>

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


// import { useFormik } from "formik";
// import { SchemaValidation } from "../Schemas/Schemas";

// export function RegistrationForm() {
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//       ConfirmPassword: "",
//     },
//     validationSchema: SchemaValidation,
//     onSubmit: (values) => {
//       console.log(values);
//       formik.resetForm();
//     },
//   });
//   return (
//     <section className="flex w-full min-h-screen bg-[#ebe9ee73]">
//       <form
//         onSubmit={formik.handleSubmit}
//         className="flex w-[55%] mx-auto flex-col items-center justify-center gap-4"
//       >
//         <h2 className="text-2xl font-semibold">Create Account</h2>

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="rounded-md border px-4 py-2 bg-white focus:outline-none"
//           value={formik.values.email}
//           onChange={formik.handleChange}
//         />
//         {formik.errors.email}
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           className="rounded-md border px-4 py-2 bg-white focus:outline-none"
//           value={formik.values.password}
//           onChange={formik.handleChange}
//         />
//         {formik.errors.password}

//         <input
//           name="ConfirmPassword"
//           type="password"
//           placeholder="Confirm Password"
//           className="rounded-md border px-4 py-2 bg-white focus:outline-none"
//           value={formik.values.ConfirmPassword}
//           onChange={formik.handleChange}
//         />
//         {formik.errors.ConfirmPassword}
//         <button
//           type="submit"
//           className="rounded-md bg-black px-10 py-2 text-white hover:opacity-90"
//         >
//           Register
//         </button>
//       </form>

//       <div className="w-[45%]">
//         <img
//           src="LoginImg.jpg"
//           alt="Register"
//           className="h-screen w-full object-cover"
//         />
//       </div>
//     </section>
//   );
// }    