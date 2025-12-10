//code explanation

// React se useState hook import kiya, jo component ki internal state banane ke liye use hota hai
import { useState } from "react";

// Axios import kiya — HTTP request (POST, GET etc.) bhejne ke liye
import axios from "axios";

// Custom component import kiya jo input field ke liye hai
import { LabelInput } from "./LabelInput";

// InputField naam ka functional component define kar rahe hain
export function InputField() {
  // inputLink: user ka diya hua image URL store karta hai
  // setInputLink: usse update karne ka function
  const [inputLink, setInputLink] = useState("");

  // outputLink: converted image ka link store karega
  const [outputLink, setOutputLink] = useState("");

  // loading: jab API call chal rahi ho tab true, warna false
  const [loading, setLoading] = useState(false);

  // Form submit hone par chalne wala function
  const handleSubmit = async (e) => {
    e.preventDefault(); // Form ka default behavior (page reload) roka

    setLoading(true); // Button disable karne ke liye loading state ko true kiya
    setOutputLink(""); // Purana result (output link) clear kiya

    try {
      // API request bhej rahe hain ek POST ke through to convert the image
      const res = await axios.post(
        "https://api.api2convert.com/v2/jobs", // API endpoint
        {
          input: [
            {
              type: "remote", // Remote image (internet URL)
              source: inputLink, // User se milne wala image link
            },
          ],
          conversion: [
            {
              category: "image", // Category image hai
              target: "png", // Target format PNG hai
              options: {
                allow_multiple_outputs: true, // Agar multiple images banti hain to allow karo
              },
            },
          ],
        },
        {
          headers: {
            "x-oc-api-key": "4b675679cbe6c509ae5cc1e223eb64f2", // API key for authorization
            "Content-Type": "application/json", // Request body JSON format mein bhej rahe hain
          },
        }
      );

      // Job ID mil gaya response se — ise use karke status check karenge
      const jobId = res.data.id;

      let jobResult = null; // Converted image ka link yahan store hoga

      // Jab tak result nahi milta, tab tak loop chalega
      while (!jobResult) {
        // Job ka status check karne ke liye GET request bhej rahe hain
        const check = await axios.get(
          `https://api.api2convert.com/v2/jobs/${jobId}`, // Job ID se specific job check
          {
            headers: { "X-Oc-Api-Key": "4b675679cbe6c509ae5cc1e223eb64f2" }, // Same API key
          }
        );

        // Agar conversion complete ho gayi
        if (check.data.status === "completed") {
          jobResult = check.data.output[0].uri; // Converted image ka link mila
          setOutputLink(jobResult); // Output link state mein save kiya
        }

        // Agar error aaya conversion mein
        else if (check.data.status === "error") {
          throw new Error("Conversion failed"); // Error throw kiya
        }

        // Agar abhi complete nahi hua, to wait karo 3 seconds
        else {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay
        }
      }
    } catch (err) {
      // Agar koi bhi error aaya to console mein dikhao aur alert karo
      console.error(err);
      alert("Something went wrong");
    }

    // Jab kaam ho gaya to loading false kar diya — button enable ho jayega
    setLoading(false);
  };

  // Component ka UI return ho raha hai (JSX)
  return (
    <div className="w-full flex bg-[#d2f5f4]">
      {" "}
      {/* Outer container with flex and background color */}
      {/* Left side mein ek image show ho rahi hai */}
      <img src="/LoginPage.jpg" alt="side" className="w-[50%] h-[39rem]" />
      {/* Right side ka form section */}
      <div className="flex flex-col mx-auto mt-10">
        {/* Page title */}
        <h1 className="text-5xl font-semibold text-[#427776] mb-10">
          Converter
        </h1>

        {/* Form start ho raha hai — jab submit hoga to handleSubmit function chalega */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* First input field: User se link input lene ke liye */}
          <LabelInput
            name="Enter Your Link Here" // Label text
            id="inputLink" // HTML id
            value={inputLink} // Current value
            onChange={(e) => setInputLink(e.target.value)} // Change hone par value update
          />

          {/* Second input field: Converted link display karne ke liye (read-only) */}
          <LabelInput
            name="Get Link Here"
            id="outputLink"
            value={outputLink}
            onChange={() => {}} // Read-only, koi function nahi diya
          />

          {/* Submit button: Jab conversion ho rahi ho tab disable */}
          <button
            type="submit"
            disabled={loading} // Loading ke time disable
            className="text-xl font-semibold rounded-2xl bg-[#121818] text-[#d2f5f4] py-2 hover:bg-[#2a2f2f]"
          >
            {loading ? "Converting..." : "Convert"}{" "}
            {/* Text button par dikh raha hai */}
          </button>
        </form>

        {/* Agar outputLink available hai to download link show karo */}
        {outputLink && (
          <a
            href={outputLink} // Converted image ka link
            download // Download attribute
            className="text-xl font-semibold rounded-2xl bg-[#121818] text-[#d2f5f4] py-2 hover:bg-[#2a2f2f]"
          >
            Download PNG
          </a>
        )}
      </div>
    </div>
  );
}
