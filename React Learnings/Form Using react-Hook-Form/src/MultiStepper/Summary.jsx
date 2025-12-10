import { useLocation, useNavigate } from "react-router-dom";

export default function Summary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { personalData, parentData } = state || {};

  const goBack = () => {
    navigate("/parent", { state: { personalData } });
  };

  if (!personalData || !parentData) {
    return <p>No data found. Please start again.</p>;
  }

  const SubmitConsole = () => {
    const combinedData = {
      personalInfo: personalData,
      parentInfo: parentData,
    };
    console.log(combinedData);
  };
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 3: Your Details</h2>

      <div className="bg-gray-50 p-4 rounded mb-4">
        <h3 className="font-bold mb-2"> Personal Details</h3>
        <p>
          <strong>Name:</strong> {personalData.name}
        </p>
        <p>
          <strong>Email:</strong> {personalData.email}
        </p>
        <p>
          <strong>Age:</strong> {personalData.age}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded mb-4">
        <h3 className="font-bold mb-2">Parent Details</h3>
        <p>
          <strong>Father's Name:</strong> {parentData.fatherName}
        </p>
        <p>
          <strong>Mother's Name:</strong> {parentData.motherName}
        </p>
        <p>
          <strong>Contact:</strong> {parentData.contact}
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goBack}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          ← Previous
        </button>
        <button
          onClick={() => {
            SubmitConsole();
            alert("Submitted Sucessfully")
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit All
        </button>
      </div>
    </>
  );
}
