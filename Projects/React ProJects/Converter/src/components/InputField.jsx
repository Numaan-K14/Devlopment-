import { useState } from "react";
import axios from "axios";
import { LabelInput } from "./LabelInput";

export function InputField() {
  const [inputLink, setInputLink] = useState("");
  const [outputLink, setOutputLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutputLink("");

    try {
      const res = await axios.post(
        "https://api.api2convert.com/v2/jobs",
        {
          input: [
            {
              type: "remote",
              source: inputLink,
            },
          ],
          conversion: [
            {
              category: "image",
              target: "png",
              options: {
                allow_multiple_outputs: true,
              },
            },
          ],
        },
        {
          headers: {
            "x-oc-api-key": "4b675679cbe6c509ae5cc1e223eb64f2",
            "Content-Type": "application/json",
          },
        }
      );

      const jobId = res.data.id;
      let jobResult = null;
      while (!jobResult) {
        const check = await axios.get(
          `https://api.api2convert.com/v2/jobs/${jobId}`,
          {
            headers: { "X-Oc-Api-Key": "4b675679cbe6c509ae5cc1e223eb64f2" },
          }
        );

        if (check.data.status === "completed") {
          jobResult = check.data.output[0].uri;
          setOutputLink(jobResult);
        } else if (check.data.status === "error") {
          throw new Error("Conversion failed");
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex bg-[#d2f5f4]">
      <img src="/LoginPage.jpg" alt="side" className="w-[50%] min-h-screen" />

      <div className="flex flex-col gap-5 mx-auto justify-center ">
        <h1 className="text-2xl font-mono text-[#427776]">
          Paste Link Here
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <LabelInput
            name="Enter Your Link Here"
            id="inputLink"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
          />

          <LabelInput
            name="Get Link Here"
            id="outputLink"
            value={outputLink}
            onChange={() => {}}
          />

          <button
            type="submit"
            disabled={loading}
            className="text-xl font-semibold rounded-2xl bg-[#121818] text-[#d2f5f4] py-2 hover:bg-[#2a2f2f]"
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </form>

        {outputLink && (
          <a
            href={outputLink}
            download
            className="text-xl font-semibold rounded-2xl bg-[#121818] text-[#d2f5f4] py-2 hover:bg-[#2a2f2f]"
          >
            Download PNG
          </a>
        )}
      </div>
    </div>
  );
}
