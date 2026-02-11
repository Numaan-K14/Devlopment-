import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function PersonalForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Go to next page & send form data
    navigate("/parent", { state: { personalData: data } });
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 1: Personal Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name", { required: "Name required" })}
          placeholder="Full Name"
          className="w-full border p-2 rounded mb-2"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          {...register("email", { required: "Email required" })}
          placeholder="Email"
          className="w-full border p-2 rounded mb-2"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register("age", { required: "Age required" })}
          placeholder="Age"
          className="w-full border p-2 rounded mb-2"
        />
        {errors.age && <p className="text-red-500">{errors.age.message}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next →
          </button>
        </div>
      </form>
    </>
  );
}
