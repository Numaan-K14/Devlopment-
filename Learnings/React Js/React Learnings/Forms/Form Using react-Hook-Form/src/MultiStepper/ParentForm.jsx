import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function ParentForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { personalData } = state || {}; // data from first form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (parentData) => {
    navigate("/summary", { state: { personalData, parentData } });
  };

  const goBack = () => {
    navigate("/", { state: { personalData } });
  };

  if (!personalData) return <p>No personal data found. Please go back.</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 2: Parent Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("fatherName", { required: "Father Name required" })}
          placeholder="Father's Name"
          className="w-full border p-2 rounded mb-2"
        />
        {errors.fatherName && (
          <p className="text-red-500">{errors.fatherName.message}</p>
        )}

        <input
          {...register("motherName", { required: "Mother Name required" })}
          placeholder="Mother's Name"
          className="w-full border p-2 rounded mb-2"
        />
        {errors.motherName && (
          <p className="text-red-500">{errors.motherName.message}</p>
        )}

        <input
          {...register("contact", { required: "Contact Number required" })}
          placeholder="Parent Contact"
          className="w-full border p-2 rounded mb-2"
        />
        {errors.contact && (
          <p className="text-red-500">{errors.contact.message}</p>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={goBack}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            ← Previous
          </button>
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
